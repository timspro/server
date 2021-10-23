#!/usr/bin/env bash

# set -x

SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")

ABSOLUTE_DIR=$(readlink -f "${@: -1}")
WATCHED+="--watch \"$ABSOLUTE_DIR\""

exec node_modules/.bin/nodemon $WATCHED "$SCRIPT_DIR/src/run.js" "$@"