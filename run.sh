#!/usr/bin/env bash
SCRIPT=$(readlink -f "$0")
DIR=$(dirname "$SCRIPT")

WATCHED=()
for dir in $@; do
  WATCHED+="--watch \"$dir\""
done

node_modules/.bin/nodemon $WATCHED "$DIR/src/run.js" "$@"