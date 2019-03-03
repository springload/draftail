import React, { Component } from "react";

// Get a component's display name
const getDisplayName = (WrappedComponent) => {
  const component = WrappedComponent.WrappedComponent || WrappedComponent;
  return component.displayName || component.name || "Component";
};

export default ({ blockKeyStore }) => (WrappedComponent) =>
  class BlockFocusDecorator extends Component {
    static displayName = `BlockFocus(${getDisplayName(WrappedComponent)})`;

    static WrappedComponent =
      WrappedComponent.WrappedComponent || WrappedComponent;

    componentDidMount() {
      const { block } = this.props;
      blockKeyStore.add(block.getKey());
    }

    componentWillUnmount() {
      const { block } = this.props;
      blockKeyStore.remove(block.getKey());
    }

    onClick = (e) => {
      const { blockProps } = this.props;

      e.preventDefault();

      if (!blockProps.isFocused) {
        blockProps.setFocusToBlock();
      }
    };

    render() {
      const { blockProps } = this.props;
      const { isFocused } = blockProps;
      return (
        <WrappedComponent
          {...this.props}
          onClick={this.onClick}
          isFocused={isFocused}
        />
      );
    }
  };
