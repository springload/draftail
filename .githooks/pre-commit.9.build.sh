#!/usr/bin/env bash

if [ -n "$JS_STAGED" ] || [ -n "$SCSS_STAGED" ] || [ -n "$HTML_STAGED" ];
then
  npm run dist -s
  npm run test:integration -s
  npm run test:performance -s
  npm run report:size -s
fi
