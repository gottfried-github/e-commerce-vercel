#! /bin/bash
admin_pswd=$1
app_pswd=$2
network_name=$3
network_alias=$4

docker run --rm -i --network $network_name mongo bash << EOF
mongosh "mongodb://admin:$admin_pswd@$network_alias"

// initiate the replica set (https://docs.mongodb.com/manual/tutorial/convert-standalone-to-replica-set/)
rs.initiate()

// create the user app
use app
db.createUser({user: "app", pwd: "$app_pswd", roles: [{role: "readWrite", db: "app"}, {role: "dbAdmin", db: "app"}]})

quit()
EOF
