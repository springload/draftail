#!/usr/bin/env bash

if [ -n "$JS_STAGED" ] || [ -n "$SNAPSHOT_STAGED" ];
then
  npm run test:coverage -s
fi
