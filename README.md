## About The Project

[TechScrum](https://techscrumapp.com)

For more info please refer to

- https://lilac-dancer-737.notion.site/Backend-8d15124cec444344bbd41935ed697b1e

#### Master

[![CircleCI](https://dl.circleci.com/status-badge/img/bb/010001/be.techscrum/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/bb/010001/be.techscrum/tree/master)

#### Develop

[![CircleCI](https://dl.circleci.com/status-badge/img/bb/010001/be.techscrum/tree/develop.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/bb/010001/be.techscrum/tree/develop)

### Tech Stack

- Express (Back end web application framework)
- Agenda (Job scheduling)
- Winston (Logging framework)
- Nodemon (Automatically restarts application when code files are updated)
- Compression (Enabling gzip compression in Express.js)
- Swagger (API docs)
- Loggly (Cloud-based logging solutions)

## TechDebt

These are ongoing techdebt that needed to be fixed

- [] REMOVE all CommonJS require('...') to use ES6 modules ( import ... from '...' )

See the [open issues](https://010001.atlassian.net/jira/software/projects/TEC/boards/2/backlog) for a full list of proposed features (and known issues).

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

Docker Desktop

### Installation

One time command

- docker build -t techscrum:lastest .
- cp .env.example .env
- Update the value in .env ask Kitman for AWS
- npm run build
- npm run init-app
- start application
- Go to chrome paste this http://localhost:8000/api/v2/healthcheck

### Start application

docker run -p 8000:8000 -d -v ${pwd}/.:/app techscrum:lastest (WINDOW ONLY)

localhost:8000

## API Docs

The generate the latest api docs you can run the following command

- npm run swagger-autogen

Once the docs is generated you can visit the via

- http://localhost:[YOUR_PORT_NUMBER]/api-docs

To know more about this package you can visit https://www.npmjs.com/package/swagger-autogen

### Folder structure (Devs)

- config: Contains configuration files that store settings and parameters used to customize the behavior of an application.
- controllers: Manages the flow of data between the front end (view) and the back end (services).
- database: Should not be touching this
- emailTemplate: email templates for AWS
- middleware: filter or intermediary in the request-response cycle.
- model: holds the data models of an application, defining the structure, relationships
- routes: Define the various endpoints and paths of a web application, mapping them to the appropriate controller functions for handling requests.
- services: Contains the business logic and data manipulation code.
- types: Typescript types
- utils: helper functions that provide common, reusable functionalities used across different parts of an application.
- validation: process of ensuring that input data meets predefined criteria and is correct, complete, and secure before it's processed or used in an application.
- loader: Stuff that starts the application

## Tests

- npm run test

## Logs

Logs file help developers/devops to address server or code issues when application crashes, you would need to ask email and password from Kitman.

- Local: /storage/logs/logger.log. This file will only generate when there are errors
- Production: https://techscrumapp.loggly.com/search?terms=tag:heroku&from=-20m&until=now&source_group=&newtab=1#terms=tag:*&from=2023-08-12T06:55:41.477Z&until=2023-08-12T07:15:41.477Z&source_group=

## License

## Contact

Kitman Yiu - [Kitman Yiu](www.kitmanyiu.com)
Emil (Junqian Su)
Implement Register, Login, Forgetpassword, board, tasks, account setting, email sende.
Jest testing: forgetPassword

## Coding Standard

- https://lilac-dancer-737.notion.site/Coding-Guidelines-bfa77d75476a4b19a195ddb20b02bb33

basic docker command

- go into docker
  docker ps (find your container id)
  docker exec -it <container_id> bash

- kill all unused docker images
  docker system prune

cat filename

//history | grep run

docker run -p 8000:8080 -d -v ${pwd}/.:/app techscrum:lastest
