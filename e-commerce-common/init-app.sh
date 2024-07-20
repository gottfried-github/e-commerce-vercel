#!/bin/bash

# apply migrations
/app/e-commerce-common/node_modules/.bin/migrate-mongo up -f /app/e-commerce-common/migrate-mongo-config.js

# create admin user for the application
node --trace-warnings /app/e-commerce-signup/src/cli.js $USER_NAME $USER_EMAIL $USER_PSSWD

cd /app/e-commerce-app/

# see https://www.tiny.cloud/docs/tinymce/latest/react-pm-host/
cp -r /app/e-commerce-react/node_modules/tinymce ./public/
npm run build

cd /