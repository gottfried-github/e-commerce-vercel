# Description
The REST API for the [e-commerce project](https://github.com/gottfried-github/e-commerce-app). Work in progress: currently, there's no notion of orders or cart, etc.. Implemented is authentication (with [passport](http://www.passportjs.org/)); [data validation](#validation); CRUD routes and file upload logic for product; a [client library](#client) making it easier to make requests.

The package produces an `express` router which you can attach to an `express` app. 

* [REST API specification](#rest-api)
* [store API specification](#store-api)
* [code overview](#code-overview)

# Usage
## Arguments
* **store.** A storage implementation that adheres to the [specification](#store-api)
* **options**
    * `productUploadPath` (mandatory): absolute path to file upload directory
    * `productDiffPath` (mandatory): absolute path relative to which actual pathname of each uploaded file should be stored

## Express session
The router uses [passport](http://www.passportjs.org/) which requires [express-session](https://www.npmjs.com/package/express-session). So the app in which you use the router needs to use [express-session](https://www.npmjs.com/package/express-session).

# Code overview
## Server
The code is organized into services, middleware and routes. 

Routes are grouped into a number of [express](https://expressjs.com/) routers which are basically organized around store collections. The routers are all attached to the top router (see [the code](/src/server/routes/admin/admin.js)). Error handling is done in a centralized fashion, in [`_errorHandler`](/src/server/middleware/error-handler.js) which maps the various errors to http status codes and sends them to the client.

### Validation
Input validation is done [here](/src/server/middleware/admin/product-validate-lib.js). 

I implement validation using `json-schema` `oneOf` keyword: I apply different schemas for when `expose` is `true` and when it's `false` (see [Data structure](#data-structure) for the relationship between `expose` and other fields).

#### Which errors to report
Consider the case: 
```json
{
    expose: 5,
    name: 10
}
```
If `expose` is invalid, the document is invalid regardless whether other fields are valid or not. Does this mean that I should only report the `expose` error? I guess no, because if I report the other error as well, the user can correct both errors and if I don't, she will need two iterations.
For the given case, should I report a `required` error on the `itemInitial`? For the field to be required, `expose` must be `true`. But here we don't know whether user intended it to be `true` or `false`. Thus, we don't know if `itemInitial` is ought to be `required`.
So, if `expose` is invalid or missing, we should report any errors regarding the other fields, except the `required` errors.

#### Technicalities
When data violates one of the schemas in `oneOf`, errors for every schema are generated.
Let's consider the case of the product schema.
1. case data: `{}`, `{expose: 5}`. Both these data will have:
    1. `name`: `required`
    2. `itemInitial`: `required`

We've established, in [Which errors to report](#which-errors-to-report), that in a case like this, we don't want to report the `required` errors.

2. Additionally, with `{expose: true, name: 'a name'}`, `expose` will still have an `enum` error, from the second schema in `oneOf`.

3. `{expose: true, name: 5}`. This will have a `required` error for `itemInitial`.

##### Some observations
Both schemas are identical except of:
1. the value of the `enum` keyword for `expose`; and
2. the other fields being `required`

So, whenever an error occurs, there will be identical errors for each of the schemas, except that
1. there will be no `required` errors for the other fields (because of `2` from above) from the second schema and,
2. if `expose` satisfies one of the schemas, there will be no `enum` error for that schema (because of `1` from above).

##### Filtering out irrelevant errors
[`filterErrors`](https://github.com/gottfried-github/e-commerce-api/blob/master/src/server/middleware/admin/product-helpers.js#L23) adheres to these principles.

1. *In case if `expose` is invalid or missing*: the `required` errors for the other fields are irrelevant - see [Which errors to report](#which-errors-to-report); all the other errors will be identical for each of the schemas -- so we can
    1. ignore the `required` errors for the other fields and
    2. arbitrarily pick any schema and ignore errors from all the other ones
    3. additionally, we can ignore `enum` errors for `isInSale` (which is the only field these errors are possible for), because that keyword is used to make a logical distinction, based on which to choose schema, not to actually specify allowed values
2. *If `expose` satisfies one of the schemas*, then the schema which doesn't have the `enum` error for `expose` is the appropriate schema.

#### Time range
[A `Date` object can represent the range between approximately -8.6 and 8.6 quadrillion milliseconds](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#the_epoch_timestamps_and_invalid_date). Hence, the range I specify for the `time` field: `86e14` and `-86e14`.

## Client
I [wrap](https://github.com/gottfried-github/e-commerce-api/tree/master/src/client) http requests to the api in a succint interface which can be used by a client application.

# Tests
`npm run test`

Authentication route handlers are unit tested as well as `_errorHandler` and product route-level validation.

# Specification
## Data structure
```json
{
  expose: Boolean,
  ... 
}
```
Whether all fields except `expose` are required depends on the value of `expose`: if it is `true` then the other fields are required, and if it is `false` then the other fields are not required.

### The relation between photos and the `expose` field
Photos, associated with a product are stored in a separate collection. 

Here's their structure:

```json
{
    productId: ObjectId,
    ...
    public: Boolean,
    cover: Boolean,
    order: Number
}
```

The `order` field is only present if the `public` field is set to `true`.

Photos with `public: true` are to be displayed to the visitor.

A product can't have `expose: true` if it doesn't have any photos with `public: true` and/or with `cover: true`.

I enforce this at the level of write operations in the store (when creating/updating the product and when updating the relevant fields in the product's photos). 

I treat discrepancies in this respect (e.g., when one tries to set `expose` to `true` when there's no `public` photos) as a validation error.

### The `time` field
Time is stored in the format of the number of milliseconds since Unix time (Jan 1, 1970 UTC). Any time that's stored is to be treated as UTC time: if the client wants to display the corresponding local time, they should convert the time. Likewise, any local time should be converted to UTC before sending it for storage.

#### Implementation note
`node.js` mongoDB driver converts the `time` field into a javascript `Date` object and that gets converted into JSON as a timezone-free ISO string instead of the milliseconds number. To convert it back to the number would cost in performance so I leave it as is. This means that: the REST API specification for getting the product should specify the `time` field as a string instead of as a number; the client will receive the ISO string instead of a number.

### The `price` field
The number, stored in the `price` field is meant to represent kopiykas. The maximum possible number of hryvnias shall be one trillion. This means that the maximum allowed number in the `price` field should be that times 100: `10e13`.

## Messages
Messages represent the interface between the store and the api. They are abstracted away from the specifics of any particular database and describe what happens with records in general terms. 

All messages have `code` and `message` properties. Almost all messages have `data` property. Some messages also have additional properties.

The code for messages can be found [here](https://github.com/gottfried-github/e-commerce-common)

### ResourceNotFound
On read operation, a document satisfying a given query doesn't exist.

### ResourceExists
On write operation, a document with a given value already exists (e.g., a field with unique key).

### InvalidCriterion
* on read operation, a given query is syntactically invalid
* on update operation, a given query doesn't match any documents

### ValidationError
Document fails data validation. Has the `tree` property which describes the structure of the failed data in [ajv-errors-to-data-tree](https://www.npmjs.com/package/ajv-errors-to-data-tree) format.

## Store api
### create
#### parameters
  1. `fields`

#### behavior
* **success**: return id of created document
* **validation failure**: throw [ValidationError](#validationerror)

Any other error shall be treated as an internal error.

### update
#### parameters
  1. `id`
  2. `write`
  3. `remove`

#### behavior
  * **success**: return `true`
  * **invalid `id` or no document with given id**: throw [InvalidCriterion](#invalidcriterion)
  * **validation failure**: throw [ValidationError](#validationerror)

Any other error shall be treated as an internal error.

### update photos
#### parameters
1. `id`
2. `photos`

#### behavior
* **success**: return `true`
* **invalid `id`**: throw [InvalidCriterion](#invalidcriterion)
* **validation failure**: throw [ValidationError](#validationerror)
* **no document with given `id`**: return `null`

### delete
#### parameters
  1. `id`

#### behavior
  * **success**: return `true`
  * **invalid `id` or no document with given id**: throw [InvalidCriterion](#invalidcriterion)

Any other error shall be treated as an internal error.

### getById
#### parameters
  1. `id`

#### behavior
  * **success**: return the found document
  * **no document found**: return `null`
  * **invalid id**: throw [InvalidCriterion](#invalidcriterion)

Any other error shall be treated as an internal error.

## REST api
### The function of the api
**Inward.** Api transmits the received data over to the store. In doing so, it should make sure that:
1. appropriate fields exist in the received data
2. the values are of the correct type
3. fields that don't belong to data, don't exist

**Outward.** Assign status codes and messages to the output of the store and send it in response to the client.

### Content type
The responses are JSON-encoded. The `Content-Type` of responses is `application/json`.

### Errors
#### Handling malformed requests
See [`body-parser` docs](http://expressjs.com/en/resources/middleware/body-parser.html#errors) for scenarios in which [body-parser](https://www.npmjs.com/package/body-parser) generates errors.

#### Other errors
##### Bad input
* status: `400`,
* body: [ValidationError](#validationerror)

##### Invalid criterion
* status: `400`
* body: [InvalidCriterion](#invalidcriterion)

##### Resource exists
* status: `409`
* body: `ResourceExists` with `tree`, if any, being [ajv-errors-to-data-tree](https://www.npmjs.com/package/ajv-errors-to-data-tree)-formatted tree

##### Internal error
* status: `500`,
* body: 
```json
{
    message: "some message",
    <optional properties>
}
```

### Visitor
#### Product
##### get many
url: `POST /api/product/get-many`

###### request
* Content-Type: `application/json`
* Body: 
```json
{
    name: String,
    dir: Number,
    inStock: Boolean
}
```

### Admin
#### Product
##### create
url: `POST /api/admin/product/create`

###### request
* Content-Type: `application/json`
* body: 
```json
{
    expose: Boolean,
    name?: String,
    price?: Number,
    is_in_stock?: Boolean,
    photos_all?: Array,
    photos?: Array,
    cover_photo?: String,
    description?: String,
    time?: Number
}
```

###### response
* success
    * status: `201`
    * body: the created document's id
* invalid data (no `expose` field, improper types or `ValidationError` on behalf of the store)
    * as described in [Bad Input](#bad-input)

##### update
url: `POST /api/admin/product/update:id` (e.g.: `/api/admin/product/update/an-id`)

###### request
* Content-Type: `application/json`,
* body: 
```json
{
    expose?: Boolean,
    name?: String,
    price?: Number,
    is_in_stock?: Boolean,
    photos_all?: Array,
    photos?: Array,
    cover_photo?: String,
    description?: String,
    time?: Number
}
```

Note: at least one field in fields must be specified.

###### response
* success
    * status: `200`,
    * body: the updated document
* no field
    * status: `400`,
    * body: `ValidationError` without `tree`
* `ValidationError` on behalf of the store
    * as described in [Bad Input](#bad-input)
* `InvalidCriterion` on behalf of the store
    * as described in [Invalid criterion](#invalid-criterion)

##### upload photos
url: `POST /api/admin/product/photos/upload`

###### request
* Content-Type: `multipart/form-data`
* body: multipart form data containing the files to upload and an `id` field (the id of the product to add the uploaded photos to), preceeding the files

###### response
* success
    * status: `201`
    * body: the document to which the photos were added
* no id field or id field doesn't preceede files
    * status: `400`
    * body: an `httpError`
* photos uploaded but no document matching given id
    * status: `400`
    * body: 
    ```json
    {
        message: "<a message>"
    }
    ```

#### Signup
url: `POST /api/admin/auth/signup`

##### request
* Content-Type: `application/x-www-form-urlencoded`,
* body: `name=String&password=String`

##### response
* success
    * status: `201`
    * body: 
        ```json
        {}
        ```
* user name exists
    * as described in [Resource exists](#resource-exists)

#### Login
url: `POST /api/admin/auth/login`

##### request
* Content-Type: `application/x-www-form-urlencoded`,
* body: `name=String&password=String`

##### response
* success
    status: `200`
    body: 
    ```json
    {message: "successfully logged in"}
    ```
* user doesn't exist
    status: `404`
    body: `ResourceNotFound`
* incorrect password
    * as described in [Invalid criterion](#invalid-criterion)