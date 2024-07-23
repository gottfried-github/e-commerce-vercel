# Description
A modular e-commerce application. Consists of [e-commerce-api](https://github.com/gottfried-github/e-commerce-api), [e-commerce-react](https://github.com/gottfried-github/e-commerce-react) and [e-commerce-mongo](https://github.com/gottfried-github/e-commerce-mongo).

* [REST API specification](https://github.com/gottfried-github/e-commerce-api#rest-api)
* [store API specification](https://github.com/gottfried-github/e-commerce-api#store-api)

See the website live [here](http://gottfried.chost.com.ua:3000).

# Initialize the app
## Initialize local stuff
`./init.sh`

## Set up environment variables
I have three files containing environment variables.

`.env.init` is for initializing the database.

`.env.vercel` is to be imported into the Vercel project.

The `APP_ADMIN_` variables in `.env.init` aren't actually used but the initialization scripts, you'll have to pass them as arguments to the signup script. I just add these into the file for convenience, to keep all the data in one place.

## 1. Initialize the database
### 1.1. Create MongoDB Atlas cluster

### 1.2. Get database data into environment variables
#### Variables to use for initialization and production
In Atlas account, select Node.js driver and copy the url. 

Add the url as `MONGODB_URI` into `.env.init` and `.env.vercel`.

Copy the name of the database in the Atlas cluster which you will use for the app.

Add it as `DB_NAME` in `.env.init` and `.env.vercel`.

#### Variable for the back up script (only needed for backup)
In the Atlas account, copy the database connection string for `shell` (`mongosh`). 

Then, reformat the string into [proper format](https://www.mongodb.com/docs/manual/reference/connection-string/#srv-connection-format). 

E.g., Atlas will give you the the string in the following format:

`mongodb+srv://host/`

And what you need to do is to transform it into the following, adding username, password and database name from your Atlas account:

`mongodb+srv://<username>:<password>@host/<database name>`

Add this string into `.env.init` as `MONGODB_URI_SHELL`. The init scripts don't use this but I add this for convenience.

### 1.3. Run migrations
1. Remove `"type": "module"` from `package.json`
2. Run: `MONGODB_URI=<variable value> ./node_modules/.bin/migrate-mongo up -f src/e-commerce-mongo/migrate-mongo-config.js`

### 1.4. Create admin user
`node --env-file .env.init --trace-warnings e-commerce-signup/src/cli.js <APP_ADMIN_USERNAME> <APP_ADMIN_EMAIL> <APP_ADMIN_PSSWD>`

## 2. Initialize Vercel project
### 2.1. Create a project on vercel from the github repo

### 2.2. Import environment variables
In `Environemt Variables` section of the project's `Settings`, click the `Import .env` button and upload `.env.vercel`.

### 2.2. Create a Vercel Blob Store for the project
Creating a Blob Store will add `BLOB_READ_WRITE_TOKEN` environment variable to the project.

## 3. Run the project locally
### 3.1. Connect the project on Vercel to the local directory
Run `vercel` and choose the existing project you created in `2.1.` to link to the local directory.

### 3.2. Pull environment from Vercel
Run `vercel env pull`. This will create `.env.local` file, which our `dev` script uses.

### 3.3. Build and run
1. Run `npm run build`
2. Run `npm run dev`

# Back up and restore
## Database
### Back up
Run `MONGODB_URI_SHELL=<variable value> ./backup-db.sh`

### Restore
Assuming you have a database and app user set up, i.e., you have run `1` and `2` from [Run](#run).

Run:

1. `docker compose -f backup.docker-compose.yml run backup bash`

Inside the running container, run:

2. `cd /app/e-commerce-common && ./backup-db-restore.sh <path to backup file inside container's volume>`
  E.g., `./backup-db-restore.sh /app/backup/db/e-commerce-app@0.4.2_2024-05-15.gz`

## Uploads
### Back up
From `e-commerce-common`, run:

`./backup-files.sh`

This will produce a directory with a `.tar.gz` file inside in `backups/uploads/`

### Restore
In `e-commerce-app`, extract the `.tar.gz` file.

# `config.js`
## `imageScaleTemplates`
Create templates for scaling uploaded images.

`suffix` will be appended to the scaled image file name and will be used to store the file name in the database.

`width`, `height` and `options` are [`sharp`'s `resize` method arguments](https://sharp.pixelplumbing.com/api-resize).