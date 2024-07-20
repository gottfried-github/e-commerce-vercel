#!/bin/bash

mongorestore --nsInclude=app --nsExclude=app.admins --gzip --drop --archive=$1 "mongodb://$APP_USER:$APP_PSSWD@$NET_NAME/$DB_NAME"