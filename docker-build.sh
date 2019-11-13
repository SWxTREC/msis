#!/bin/bash -eu

REGISTRY=web-registry.lasp.colorado.edu
NAME=project-name
# have to check to make sure REFSPEC is bound / not empty for script to run
if [[ ! -z ${REFSPEC+x} ]] && [ "${REFSPEC}" = "dev" ] ; then
VERSION=dev
else
VERSION="${VERSION:-$(npm version | head -n 1 | awk '{print $3;}' | tr -d "',")}"
fi

npm install
ng build --prod --aot=false --build-optimizer=false --base-href '${NGINX_CONTEXT_ROOT}'
docker build --force-rm -t ${REGISTRY}/${NAME}:${VERSION} .
