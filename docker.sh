#!/bin/sh
export WEBPACK_PORT=8080
export WEBPACK_HOSTNAME=localhost
export WEBPACK_OPEN=false
#docker build -t mcoc .
docker run --name champions -it --rm -p 8080:8080 "mcoc:latest"
