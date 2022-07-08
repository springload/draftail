#!/usr/bin/env bash

# Format and re-stage fully staged files only.
if [ -n "$PRETTIER_FULLY_STAGED" ];
then
  npx prettier --cache --write $PRETTIER_FULLY_STAGED
  git add $PRETTIER_FULLY_STAGED
fi

if [ -n "$PRETTIER_STAGED" ];
then
  npx prettier --cache --check $PRETTIER_STAGED
fi
