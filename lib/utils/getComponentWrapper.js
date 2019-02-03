// @flow
import React from "react";
import type { ComponentType } from "react";

/**
 * Wraps a component to provide it with additional props based on context.
 */
const getComponentWrapper = (Wrapped: ComponentType<{}>, wrapperProps: {}) => {
  const Wrapper = (props: {}) => (
    // flowlint inexact-spread:off
    <Wrapped {...props} {...wrapperProps} />
  );

  return Wrapper;
};

export default getComponentWrapper;
