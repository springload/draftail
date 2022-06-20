import * as React from "react";

export as namespace DCWP;
declare namespace DCWP {
  function decorateComponentWithProps<C extends React.Component<>, EP>(
    component: C,
    extraProps: EP,
  ): React.Component<C["props"] & EP>;
}

import decorateComponentWithProps = DCWP.decorateComponentWithProps;

export { decorateComponentWithProps };
