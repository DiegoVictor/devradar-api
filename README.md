# [API] DevRadar
[![CircleCI](https://img.shields.io/circleci/build/github/DiegoVictor/devradar-api?style=flat-square&logo=circleci)](https://app.circleci.com/pipelines/github/DiegoVictor/devradar-api)
[![mongoose](https://img.shields.io/badge/mongoose-6.6.1-green?style=flat-square&logo=mongo&logoColor=white)](https://mongoosejs.com/)
[![nodemon](https://img.shields.io/badge/nodemon-2.0.20-76d04b?style=flat-square&logo=nodemon)](https://nodemon.io/)
[![eslint](https://img.shields.io/badge/eslint-8.23.1-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![airbnb-style](https://flat.badgen.net/badge/style-guide/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
[![jest](https://img.shields.io/badge/jest-29.0.3-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/devradar-api?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/devradar-api)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/devradar-api/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=DevRadar&uri=https%3A%2F%2Fraw.githubusercontent.com%2FDiegoVictor%2Fdevradar-api%2Fmain%2FInsomnia_2021-07-20.json)

Responsible for provide data to the [`web`](https://github.com/DiegoVictor/devradar-web) and [`mobile`](https://github.com/DiegoVictor/devradar-app) front-ends. Permit developers to register yourself using GitHub and to find another developers. The app has pagination, pagination's link header (to previous, next, first and last page), friendly errors, use JWT to logins, validation, also a simple versioning was made.

## Table of Contents
* [Installing](#installing)
  * [Configuring](#configuring)
    * [MongoDB](#mongodb)
    * [.env](#env)
    * [GitHub OAuth App](#github-oauth-app)
* [Usage](#usage)
  * [Error Handling](#error-handling)
    * [Errors Reference](#errors-reference)
  * [Pagination](#pagination)
    * [Link Header](#link-header)
    * [X-Total-Count](#x-total-count)
  * [Bearer Token](#bearer-token)
  * [Versioning](#versioning)
  * [Routes](#routes)
    * [Requests](#requests)
* [Running the tests](#running-the-tests)
  * [Coverage report](#coverage-report)

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
The application uses just one database: [MongoDB](https://www.mongodb.com).  For the fastest setup is recommended to use [docker-compose](https://docs.docker.com/compose/), you just need to up all services:
```
$ docker-compose up -d
```

### MongoDB
Store all application data. If for any reason you would like to create a MongoDB container instead of use `docker-compose`, you can do it by running the following command:
```
$ docker run --name devradar-mongo -d -p 27017:27017 mongo
```

### .env
In this file you may configure your MongoDB database connection, JWT settings, the environment, app's port, url to documentation (this will be returned with error responses, see [error section](#error-handling)) and GitHub's OAuth App keys. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

|key|description|default
|---|---|---
|APP_PORT|Port number where the app will run.|`3333`
|NODE_ENV|App environment.|`development`
|JWT_SECRET|An alphanumeric random string. Used to create signed tokens.| -
|JWT_EXPIRATION_TIME|How long time will be the token valid. See [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#usage) repo for more information.|`7d`
|MONGO_URL|MongoDB's server url.|`mongodb://mongo:27017/devradar`
|GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET|GitHub's OAuth App credentials. See [GitHub OAuth App](#github-oauth-app) for more information.| -
|DOCS_URL|An url to docs where users can find more information about the app's internal code errors.|`https://github.com/DiegoVictor/devradar-api#errors-reference`

### Github OAuth App
First you need to create a [GitHub OAuth App](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app), just remember to configure the field `Authorization callback URL` with the project's [`web`](https://github.com/DiegoVictor/devradar-web) version home page url.

![GitHub OAuth App](https://raw.githubusercontent.com/DiegoVictor/devradar-api/main/screenshots/github_oauth_app.png)

> If you are running the application local I recommend you to use [ngrok](https://ngrok.com) to export a url to access the application. (e.g. `https://25752eff.ngrok.io`)

# Usage
To start up the app run:
```
$ yarn start
```
Or:
```
$ npm run start
```

## Error Handling
Instead of only throw a simple message and HTTP Status Code this API return friendly errors:
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "You are already registered",
  "code": 140,
  "docs": "https://github.com/DiegoVictor/devradar-api#errors-reference"
}
```
> Errors are implemented with [@hapi/boom](https://github.com/hapijs/boom).
> As you can see a url to errors docs are returned too. To configure this url update the `DOCS_URL` key from `.env` file.
> In the next sub section ([Errors Reference](#errors-reference)) you can see the errors `code` description.

### Errors Reference
|code|message|description
|---|---|---
|140|You are already registered|The GitHub's user is already registered.
|144|Developer does not exists|The `id` sent not references an existing developer in the database.
|531|An error ocurred while trying to exchange a GitHub's access token|An error occurred during the request to get the user's access token on GitHub API, look the `details` key for more information.
|532|An error ocurred while trying to retrieve the user from GitHub|The request to get GitHub user's data from GitHub API throw an error. Look the `details` key for more information.
|240|Missing authorization token|The Bearer Token was not sent.
|241|Token expired or invalid|The Bearer Token provided is invalid or expired.

## Pagination
All the routes with pagination returns 10 records per page, to navigate to other pages just send the `page` query parameter with the number of the page.

* To get the third page of incidents:
```
GET http://localhost:3333/v1/developers?page=3
```

### Link Header
Also in the headers of every route with pagination the `Link` header is returned with links to `first`, `last`, `next` and `prev` (previous) page.
```
<http://localhost:3333/v1/developers?page=7>; rel="last",
<http://localhost:3333/v1/developers?page=4>; rel="next",
<http://localhost:3333/v1/developers?page=1>; rel="first",
<http://localhost:3333/v1/developers?page=2>; rel="prev"
```
> See more about this header in this MDN doc: [Link - HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link).

### X-Total-Count
Another header returned in routes with pagination, this bring the total records amount.

## Bearer Token
A few routes expect a Bearer Token in an `Authorization` header.
> You can see these routes in the [routes](#routes) section.
```
DELETE http://localhost:3333/v1/developers Authorization: Bearer <token>
```
> To achieve this token you just need authenticate through the `/sessions` route and it will return the `token` key with a valid Bearer Token.

## Versioning
A simple versioning was made. Just remember to set after the `host` the `/v1/` string to your requests.
```
GET http://localhost:3333/v1/developers
```

## Routes
|route|HTTP Method|pagination|params|description|auth method
|:---|:---:|:---:|:---:|:---|:---:
|`/sessions`|POST|:x:|Body with user's `code`.|Authenticates developer, return a Bearer Token and developer's information.|:x:
|`/search`|GET|:x:|`techs`, `latitude` and `longitude` query parameters.|Search nearest developers with the same techs.|:x:
|`/developers`|GET|:heavy_check_mark:|`page` query parameter.|List developers.|:x:
|`/developers/:id`|GET|:x:|`:id` of the developer.|Return one developer.|:x:
|`/developers`|POST|:x:|Body with developer's `techs`, `latitude`, `longitude` and `code`.|Create new developers.|:x:
|`/developers`|PUT|:x:|Body with developer's `name`, `bio`, `avatar_url`, `techs`, `latitude` and `longitude`.|Update one developer.|Bearer
|`/developers`|DELETE|:x:| - |Remove one developer.|Bearer

> Routes with `Bearer` as auth method expect an `Authorization` header. See [Bearer Token](#bearer-token) section for more information. After users approve your [OAuth App](#github-oauth-app) on GitHub, it will redirect to the `Authorization callback URL` with a parameter `code` that should be sent in some routes, that you can see above.

### Requests
* `POST /sessions`

Request body:
```json
{
  "code": "32g2a27129w2qc23pch3"
}
```

* `POST /developers`

Request body:
```json
{
  "code": "6qca5876158fqq1ccat9",
  "techs": "Node.js, ReactJS, React Native",
  "latitude": 52.1199,
  "longitude": 159.0477
}
```

* `PUT /developers`

Request body:
```json
{
  "techs": "Node.js, ReactJS",
  "name": "John Doe",
  "avatar_url": "https://avatars2.githubusercontent.com/u/15165349?s=460",
  "bio": "Let's go!",
  "latitude": -73.0510,
  "longitude": -64.7188
}
```

# Running the tests
[Jest](https://jestjs.io) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
