#!/usr/bin/env bash

# set -x

SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")

OPTIONS=$(getopt --unquoted --long routes: -- "$@")

WATCHED=""
if [ ! -z "$OPTIONS" ]; then
  # substring(1, -3); older versions don't like seeing :-3
  ABSOLUTE_DIR=$(readlink -f "${OPTIONS:1: -3}")
  WATCHED+="--watch $ABSOLUTE_DIR"
fi

exec node_modules/.bin/nodemon $WATCHED "$SCRIPT_DIR/src/run.js" "$@"