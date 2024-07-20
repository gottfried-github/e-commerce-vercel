#!/bin/bash

cd /app/e-commerce-app

version=$(npm version | grep e-commerce-app | grep -o "'[^']\+',$" | grep -o "[^',]*")
now=$(date +"%Y-%m-%d-%H:%M")

cd /app

mongodump --gzip --archive="backup/db/e-commerce-app@${version}_${now}.gz" "mongodb://$APP_USER:$APP_PSSWD@$NET_NAME/$DB_NAME"