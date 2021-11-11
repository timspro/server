#!/usr/bin/env bash

# set -x

SCRIPT=$(readlink -f "$0")
SCRIPT_DIR=$(dirname "$SCRIPT")

ARG_ARRAY=("$@") 
for INDEX in "${!ARG_ARRAY[@]}"; do
  if [ "${ARG_ARRAY[$INDEX]}" = "--routes" ]; then 
    WATCHED="--watch ${ARG_ARRAY[$INDEX + 1]}"
    break
  fi
done

exec node_modules/.bin/nodemon $WATCHED "$SCRIPT_DIR/src/run.js" "$@"