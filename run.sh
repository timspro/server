#!/usr/bin/env bash

# set -x

SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")

WATCHED=()
for DIR in $@; do
  ABSOLUTE=$(readlink -f "$DIR")
  WATCHED+="--watch $ABSOLUTE"
done

node_modules/.bin/nodemon $WATCHED "$SCRIPT_DIR/src/run.js" "$@"