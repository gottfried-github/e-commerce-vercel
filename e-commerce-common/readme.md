# Description
A library for the [e-commerce project](https://github.com/gottfried-github/e-commerce-app) (work in progress). Particularly, implements the interface, defined [here](https://github.com/gottfried-github/e-commerce-api#messages) (see [messages.js](/messages.js)). Also, contains initialization setup and scripts for the entire project.

# Having to run `init-db.docker-compose` twice
On the first run, the script, run by the `init` container (`init-db.sh`) fails to connect to the database for some reason. On the second run it connects successfully.