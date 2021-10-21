#!/usr/bin/env bash

# set -x

SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")


if [[ -v INSPECT ]]; then
  INSPECTED="--inspect"
else
  INSPECTED=""
fi

ABSOLUTE=$(readlink -f "${@: -1}")
WATCHED+="--watch \"$ABSOLUTE\""

node_modules/.bin/nodemon $INSPECTED $WATCHED "$SCRIPT_DIR/src/run.js" "$@"