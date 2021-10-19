#!/usr/bin/env bash

# set -x

SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")

WATCHED=()
for DIR in $@; do
  ABSOLUTE=$(readlink -f "$DIR")
  WATCHED+="--watch $ABSOLUTE"
done

if [[ -v INSPECT ]]; then
  INSPECTED="--inspect"
else
  INSPECTED=""
fi

node_modules/.bin/nodemon $INSPECTED $WATCHED "$SCRIPT_DIR/src/run.js" "$@"