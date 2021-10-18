#!/bin/bash 
SCRIPT=$(readlink -f "$0")
DIR=$(dirname "$SCRIPT")

node_modules/.bin/nodemon --watch $DIR "$DIR/src/run.js" "$@"