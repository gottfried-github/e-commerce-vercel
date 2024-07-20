#!/bin/bash

cd ../e-commerce-app

version=$(npm version | grep e-commerce-app | grep -o "'[^']\+',$" | grep -o "[^',]*")
now=$(date +"%Y-%m-%d-%H:%M")

dirname="e-commerce-app@${version}_${now}"

mkdir ../backup/uploads/$dirname

tar -cvzf ../backup/uploads/$dirname/public.tar.gz public