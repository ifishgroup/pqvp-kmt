#!/usr/bin/env sh
set -e

usage() {
    echo "Usage: $0 <BASE_URL>"
    exit 1
}
 
if [[ $# -eq 0 ]] ; then
    usage;
fi

echo "Setting BASE_URL to: $1"

sed -i -e "s,SED_REPLACE_URL,${1},g" /usr/share/nginx/html/static/js/app.*.js

echo "BASE_URL successfully set"

nginx -g "daemon off;"