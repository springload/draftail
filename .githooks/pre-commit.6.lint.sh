#!/usr/bin/env bash

if [ -n "$JS_STAGED" ];
then
  npx eslint $JS_STAGED
fi

if [ -n "$SCSS_STAGED" ];
then
    npx stylelint $SCSS_STAGED
fi
