#!/bin/bash
# create the data dir for the database
mkdir ../data

# keyfile for database (see details [here](https://docs.mongodb.com/manual/tutorial/deploy-replica-set-with-keyfile-access-control/#create-a-keyfile))
touch ../data/keyfile
openssl rand -base64 756 > ../data/keyfile
chmod 400 ../data/keyfile