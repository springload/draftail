#!/usr/bin/env bash
# Format and re-stage fully staged files only.

if [ -n "$JS_FULLY_STAGED" ];
then
  npx prettier --write $JS_FULLY_STAGED
  git add $JS_FULLY_STAGED
fi

if [ -n "$JS_STAGED" ];
then
  npx prettier --list-different $JS_STAGED
fi

if [ -n "$SCSS_FULLY_STAGED" ];
then
  npx prettier --write $SCSS_FULLY_STAGED
  git add $SCSS_FULLY_STAGED
fi

if [ -n "$SCSS_STAGED" ];
then
  npx prettier --list-different $SCSS_STAGED
fi

if [ -n "$CSS_FULLY_STAGED" ];
then
  npx prettier --write $CSS_FULLY_STAGED
  git add $CSS_FULLY_STAGED
fi

if [ -n "$CSS_STAGED" ];
then
  npx prettier --list-different $CSS_STAGED
fi

if [ -n "$MD_FULLY_STAGED" ];
then
  npx prettier --write $MD_FULLY_STAGED
  git add $MD_FULLY_STAGED
fi

if [ -n "$MD_STAGED" ];
then
  npx prettier --list-different $MD_STAGED
fi

if [ -n "$JSON_FULLY_STAGED" ];
then
  npx prettier --write $JSON_FULLY_STAGED
  git add $JSON_FULLY_STAGED
fi

if [ -n "$JSON_STAGED" ];
then
  npx prettier --list-different $JSON_STAGED
fi

if [ -n "$YAML_FULLY_STAGED" ];
then
  npx prettier --write $YAML_FULLY_STAGED
  git add $YAML_FULLY_STAGED
fi

if [ -n "$YAML_STAGED" ];
then
  npx prettier --list-different $YAML_STAGED
fi
