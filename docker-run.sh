#!/bin/bash -eu

# Example script to run a contianer locally for dev
NAME="${NAME:-Project-name}"
VERSION="${VERSION:-$(npm version | head -n 1 | awk '{print $3;}' | tr -d "',")}"

if docker ps -a -f "name=$NAME" --format '{{.Names}}' |  grep $NAME ; then
  docker stop $NAME || true
  docker rm $NAME
fi
docker run -p 8080:80 -e NGINX_CONTEXT_ROOT='/dev' -d --name web-registry.lasp.colorado.edu/$NAME $NAME:$VERSION
