#!/usr/bin/env bash

if [ -n "$JS_STAGED" ];
then
  npx eslint $JS_STAGED
fi

if [ -n "$SCSS_STAGED" ];
then
  npx stylelint $SCSS_STAGED
fi

FLOW_STAGED=$(grep -e '.flowconfig$' <<< "$STAGED" || true)

if [ -n "$JS_STAGED" ] || [ -n "$FLOW_STAGED" ];
then
  npx flow
fi
