# Description
A modular e-commerce application. Consists of [e-commerce-api](https://github.com/gottfried-github/e-commerce-api), [e-commerce-react](https://github.com/gottfried-github/e-commerce-react) and [e-commerce-mongo](https://github.com/gottfried-github/e-commerce-mongo).

* [REST API specification](https://github.com/gottfried-github/e-commerce-api#rest-api)
* [store API specification](https://github.com/gottfried-github/e-commerce-api#store-api)

See the website live [here](http://gottfried.chost.com.ua:3000).

# Initialize the app
## Create MongoDB Atlas cluster

## Integrate MongoDB Atlas cluster with Vercel

## Get the URI for connecting to your cluster

## Run migrations
1. Remove `"type": "module"` from `package.json`
2. Run: `MONGODB_URI=<connection string> ./node_modules/.bin/migrate-mongo up -f src/e-commerce-mongo/migrate-mongo-config.js`

## Create admin user
`node --env-file .env --trace-warnings e-commerce-signup/src/cli.js <username> <email> <password>`

# Run
## Preparations
### Clone the repos
Clone [e-commerce-common](https://github.com/gottfried-github/e-commerce-common), [e-commerce-mongo](https://github.com/gottfried-github/e-commerce-mongo), [e-commerce-api](https://github.com/gottfried-github/e-commerce-api), [e-commerce-react](https://github.com/gottfried-github/e-commerce-react), [e-commerce-app](https://github.com/gottfried-github/e-commerce-app) and [e-commerce-signup](https://github.com/gottfried-github/e-commerce-signup) into a common root directory. Perform all further instructions inside that directory.

## Instructions
From each of the subfolders - `e-commerce-common`, `e-commerce-mongo`, `e-commerce-api`, `e-commerce-front-end`, `e-commerce-app`, `e-commerce-signup` - run `npm install`. 

Then, run the initialization commands from within `e-commerce-common`:

```shell
cd e-commerce-common

# create data directory and a keyfile for the database
./init.sh
```

### 1. Initialize the database
From within `e-commerce-common`, run the following.

Run this command and wait a few moments to make sure the script has connected to the database and initialized it (you should see `mongosh` logs from the `init` container in the stdout). Then you can interrupt (`CTRL+c`).

`docker compose -f init-db.docker-compose.yml up --build`

### 2. Apply migrations and create admin user for the app
First, temporarily remove the `"type": "module"` declaration from `e-commerce-common/package.json` and `e-commerce-mongo/package.json` [`1`].

Then, from within `e-commerce-common`, run the following and wait a few moments until the scripts are executed (you should see logs from the `node` container):

`docker compose -f init-app.docker-compose.yml up --build`

Then, add the `"type": "module"` declaration back in.

### 3. Run the application
From within `e-commerce-common`, run the following and wait a few moments until the server starts (you should see logs from the `node` container):

`docker compose -f run.docker-compose.yml up --build`

### Access the network
run `docker ps`, find container with IMAGE of "fi-common_node" and copy it's ID (e.g., e28354082f09)

then `docker inspect` that container and find *NetworkSettings.Networks.fi-common_default.IPAddress*

this is taken from [here](https://stackoverflow.com/a/56741737)

### Notes
1. `migrate-mongo`, which is run in `init-app.sh`, doesn't work with es6 modules.

# Back up and restore
## Database
### Back up
From `e-commerce-common` directory, run:

1. `docker compose -f backup.docker-compose.yml run --build backup bash`

Inside the running container, run:

2. `cd /app/e-commerce-common && ./backup-db.sh`

This will produce a database dump in `../backup/db/`

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

## Run migrations
First, temporarily remove the `"type": "module"` declaration from `e-commerce-common/package.json` and `e-commerce-mongo/package.json` [`1`].

1. from `e-commerce-common`, run:

`docker compose -f run.docker-compose.yml run node bash`

2. inside the running container, run:

`/app/e-commerce-common/node_modules/.bin/migrate-mongo up -f /app/e-commerce-common/migrate-mongo-config.js`

or, for down:

`/app/e-commerce-common/node_modules/.bin/migrate-mongo down -f /app/e-commerce-common/migrate-mongo-config.js`

# Self-signed SSL certificate
The instructions are taken from [`1`].

In `e-commerce-app`:

1. `mkdir cert && cd cert`
2. generate a private key: `openssl genrsa -out key.pem`
3. generate a Certificate Signing Request (CSR): `openssl req -new -key key.pem -out csr.pem`
4. generate the SSL certificate: `openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem`

## Refs
1. https://dev.to/devland/how-to-generate-and-use-an-ssl-certificate-in-nodejs-2996

# `config.js`
## `imageScaleTemplates`
Create templates for scaling uploaded images.

`suffix` will be appended to the scaled image file name and will be used to store the file name in the database.

`width`, `height` and `options` are [`sharp`'s `resize` method arguments](https://sharp.pixelplumbing.com/api-resize).