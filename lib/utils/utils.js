import React from 'react';

/**
 * Wraps a component to provide it with additional props based on context.
 */
export const getComponentWrapper = (Wrapped, wrapperProps) => {
    const Wrapper = props => <Wrapped {...props} {...wrapperProps} />;

    return Wrapper;
};
