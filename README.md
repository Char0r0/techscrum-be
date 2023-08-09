## About The Project

[TechScrum](https://techscrumapp.com)

For more info please refer to

- https://lilac-dancer-737.notion.site/Backend-8d15124cec444344bbd41935ed697b1e

### Tech Stack

- Express (Back end web application framework)
- Agenda (Job scheduling)
- Winston (Logging framework)
- Nodemon (Automatically restarts application when code files are updated)
- Compression (Enabling gzip compression in Express.js)
- Swagger (API docs)

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
- cp .env.example .env (ASK DEVS FOR THE VALUES)
- Update the value in .env
- npm run build
- npm run init-app
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

## Tests

- npm run test

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
