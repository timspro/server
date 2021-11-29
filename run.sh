#!/usr/bin/env bash

# set -x

# https://stackoverflow.com/questions/59895/how-can-i-get-the-source-directory-of-a-bash-script-from-within-the-script-itsel
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do
  DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE"
done
SCRIPT_DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"

ARG_ARRAY=("$@") 
for INDEX in "${!ARG_ARRAY[@]}"; do
  if [ "${ARG_ARRAY[$INDEX]}" = "--routes" ]; then 
    WATCHED="--watch ${ARG_ARRAY[$INDEX + 1]}"
    break
  fi
done

exec node_modules/.bin/nodemon $WATCHED "$SCRIPT_DIR/src/run.js" "$@"