#!/bin/bash

# This renders environment variables passed to a container at runtime.
urlencode() {
    # urlencode <string>
    old_lc_collate=$LC_COLLATE
    LC_COLLATE=C
    local length="${#1}"
    for (( i = 0; i < length; i++ )); do
        local c="${1:i:1}"
        case $c in
            [a-zA-Z0-9.~_-]) printf "$c" ;;
            *) printf '%%%02X' "'$c" ;;
        esac
    done
    LC_COLLATE=$old_lc_collate
}

# Var list is comma separated, ie VARS='${VAR_1},${VAR_2},${VAR_N},...'
export VARS='${NGINX_CONTEXT_ROOT},${LATIS_BASE},'

# Set the default context root if not defined.
if [ -z "${NGINX_CONTEXT_ROOT:-}" ] ; then
  export NGINX_CONTEXT_ROOT='/'
fi
# Render nginx configuration before angular stuff to avoid base-href conflicts
envsubst "$VARS" < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/swp.conf
# NGINX_CONTEXT_ROOT / angular base-href must end with a /
if [[ ! "${NGINX_CONTEXT_ROOT}" =~ /$ ]] ; then
  export NGINX_CONTEXT_ROOT="${NGINX_CONTEXT_ROOT}/"
fi
for f in $(find /usr/share/nginx/html -type f -exec grep -Iq . {} \; -and -print) ; do
  envsubst "$VARS" < $f > $f.tmp && mv $f.tmp $f
done
