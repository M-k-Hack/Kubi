<h1 align="center"> Kubi </h1> <br>  

<p>logo</p>

<p align="center">
  Orchestrate containers with an Express API.
</p>

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Feedback](#feedback)
- [Contributors](#contributors)
- [Requirements](#requirements)
- [Build Process](#build-process)
    - [Docker](#docker)
    - [MongoDB](#mongodb)
    - [Node Express Back-End](#node-express-back-end)
    - [Endpoints](#endpoints)
    - [Front-End](#front-end)
- [Acknowledgments](#acknowledgments)


## Introduction

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

We needed to orchestrate container for a CTF but a simple way. So we created this.

## Features

A few of the things you can do with Kubi :

* You can run containers wit a simple web request on a random port.
* You can upload docker images to run it.
* You havce a (not really) nice web interface to interact with endpoints.

## Feedback

Feel free to send us feedback. [File an issue](https://github.com/gitpoint/git-point/issues/new).

## Contributors

For the moment, only MAK'HACK members can contribute to this project.

## Requirements

* Docker
* MongoDB
* NodeJS
    * express
    * mongoose
    * dockerode
    * dotenv
    * body-parser

## Build Process

### Docker

First, install [Docker](https://docs.docker.com/engine/install/).

For the first launch, build a random image (like ubuntu) to test running :
```
docker pull ubuntu
```

### MongoDB

First, you have to install [Mongo](https://www.mongodb.com/docs/manual/installation/), create a database and a user for the database with `readWrite` permissions.

Also don't forget to enable [Access Control](https://www.mongodb.com/docs/v4.4/tutorial/enable-authentication/) for your MongoDB instance.

If your MongoDB instance is not on the same machine, change your bind_ip in `/etc/mongod.conf` to 0.0.0.0.

If you build the docker image ubuntu previously. Add a line in your mongoDB just created (don't forget to auth):

```bash
db.containers.insert({name:"My Nice Ubuntu Image", name_container:"ubuntu", "exposed_port":22})
```

### Node Express Back-End

Now, clone the project :
```bash
git clone https://github.com/M-k-Hack/Kubi.git
```
Create a `.env` file, and add your credententials, etc... :
```
ADMIN_TOKEN=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
```

Install dependencies and run project :
```bash
npm install
sudo node server.js
```

### Endpoints
```
GET /api/docker/start/:id --> Start a container with and id specified
GET /api/docker/stop/:id --> Stop container (only for admin)
GET /api/container/ --> Get all containers stored in Mongo Databases
GET / --> Web Interface (Pure HTML/CSS/JS)
```

### Front-End
Express App serves a web interface. You can use to test good functionalities or in your projet. But you can also create your own front-end app to use the API.

## Acknowledgments

Thanks to MAK'HACK members and creators of [dockerode](https://github.com/apocas/dockerode).

## License

MIT License.


<!-- Truc lien -->
[contributors-shield]: https://img.shields.io/github/contributors/M-k-Hack/Kubi.svg?style=for-the-badge
[contributors-url]: https://github.com/M-k-Hack/Kubi/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/M-k-Hack/Kubi.svg?style=for-the-badge
[forks-url]: https://github.com/M-k-Hack/Kubi/network/members
[stars-shield]: https://img.shields.io/github/stars/M-k-Hack/Kubi.svg?style=for-the-badge
[stars-url]: https://github.com/M-k-Hack/Kubi/stargazers
[issues-shield]: https://img.shields.io/github/issues/M-k-Hack/Kubi.svg?style=for-the-badge
[issues-url]: https://github.com/M-k-Hack/Kubi/issues
[license-shield]: https://img.shields.io/github/license/M-k-Hack/Kubi.svg?style=for-the-badge
[license-url]: https://github.com/M-k-Hack/Kubi/master/LICENSE
