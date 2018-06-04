[![GitHub issues](https://img.shields.io/github/issues/fadedDexofan/koa-typeorm-boilerplate.svg?style=flat-square)](https://github.com/fadedDexofan/koa-typeorm-boilerplate/issues)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/451cb07dc5e84535999de481b4383d8f)](https://www.codacy.com/app/fadedDexofan/koa-typeorm-boilerplate?utm_source=github.com&utm_medium=referral&utm_content=fadedDexofan/koa-typeorm-boilerplate&utm_campaign=Badge_Grade)

# koa-typeorm-starter

Starter project for using koa with TypeScript and TypeORM

# Prerequisites

* Node 10 or higher (you can try to manage your versions using [nvm](https://github.com/creationix/nvm))
* [Yarn](https://yarnpkg.com/lang/en/) package manager or you need to generate `package-lock.json` by yourself

# Installing

* Set up your database and make sure you change the config to your own setup. You can find your database config under `config/ormconfig.json` for your development environment. Change accordingly to your chosen environment (development/test/production)

      {
        "type": "postgres",
        "host": "localhost",
        "port": 5432,
        "username": "username",
        "password": "password",
        "database": "database",
        "logging": false
      }

  For more info like supported database driver visit [TypeORM](https://github.com/typeorm/typeorm).

- And start your application by running this in the terminal. This would watch for changes and rebuild(transpiled) your application

      $ npm run debug

  With that, you can see in your terminal and logs that the app is ready to listen for requests. For example:

      [2018-06-04T01:55:18.426Z] [info]: Server started at http://localhost:3000 NODE_ENV=development

  For run in production run this in terminal:

      $ npm run start

  And then check logs in `dirname/logs` to make sure that the startup is successful

# Running the tests

To run the test suites, type in your terminal

    $ npm run test

Or per test type

    $ npm run e2e:test
    $ npm run unit:test

# Built With

* [Routing controllers](https://github.com/typestack/routing-controllers) - Web framework
* [TypeORM](https://github.com/typeorm/typeorm) - Database Management
* [TypeDI](https://github.com/typestack/typedi) - Dependencies injection

# Contributing

Open for pull requests!

# Authors

* [fadedDexofan](https://github)

Big thanks to [JM Santos](https://github.com/jmaicaaan) for similar [Express starter](https://github.com/jmaicaaan/express-starter-ts)
