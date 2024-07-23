#!/bin/bash

version=$(npm version | grep e-commerce-vercel | grep -o "'[^']\+',$" | grep -o "[^',]*")
now=$(date +"%Y-%m-%d-%H:%M")

mongodump --gzip --archive="backup/db/e-commerce-vercel@${version}_${now}.gz" "$MONGODB_URI_SHELL"