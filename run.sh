#!/bin/bash 
# Absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
DIR=$(dirname "$SCRIPT")

"$DIR/node_modules/.bin/nodemon" --watch $DIR "$DIR/src/run.js" "$@"