# Installation

## Dependencies

- [Git](https://git-scm.com) (Optional)
- [Docker](https://www.docker.com)
- [Docker Compose](https://docs.docker.com/compose/)


## Install Steps

1. Clone or download the repository

``` 
$ git clone https://github.com/ifishgroup/pqvp-kmt.git
$ cd pqvp-kmt
```

2. Pull latest containers from Docker Hub

```
$ docker-compose pull
```

3. Start containers

```
$ docker-compose up
```

4. Open broswer to `http://localhost/`

## Stopping Containers

1. ctrl-c if still running in docker-compose

2. To remove containers

``` 
$ docker-compose down
```

## Building Containers Manually

1. Building insight

```
$ docker build -t ifishgroup/insight .
```

2. Building insight-api

```
$ docker build -t ifishgroup/insight-api ./api/
```

3. Building insight import container

```
$ docker build -t ifishgroup/insight-import ./api/data/
```
