#!/usr/bin/env bash

if [ -n "$JS_STAGED" ] || [ -n "$SNAPSHOT_STAGED" ];
then
    npx flow
    npm run test:coverage -s
fi
