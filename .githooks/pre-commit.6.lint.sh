#!/usr/bin/env bash

if [ -n "$JS_STAGED" ];
then
  npx eslint --cache --cache-location $JS_STAGED
fi

if [ -n "$SCSS_STAGED" ];
then
  npx stylelint $SCSS_STAGED
fi
