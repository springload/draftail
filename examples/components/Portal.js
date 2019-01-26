// @flow
import React, { Component } from "react";
import type { Node } from "react";
import ReactDOM from "react-dom";

type Props = {
  onClose: () => void,
  children: Node,
  closeOnClick: boolean,
  closeOnType: boolean,
  closeOnResize: boolean,
};

class Portal extends Component<Props, {}> {
  static defaultProps: Props;
  portal: Element;
  onCloseEvent: (e: Event) => void;

  constructor(props: Props) {
    super(props);

    this.onCloseEvent = this.onCloseEvent.bind(this);
  }

  componentDidMount() {
    const { onClose, closeOnClick, closeOnType, closeOnResize } = this.props;

    if (!this.portal) {
      this.portal = document.createElement("div");

      if (document.body) {
        document.body.appendChild(this.portal);
      }

      if (onClose) {
        if (closeOnClick) {
          document.addEventListener("mouseup", this.onCloseEvent);
        }

        if (closeOnType) {
          document.addEventListener("keyup", this.onCloseEvent);
        }

        if (closeOnResize) {
          window.addEventListener("resize", onClose);
        }
      }
    }

    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const { children } = this.props;

    ReactDOM.render(<div>{children}</div>, this.portal);
  }

  componentWillUnmount() {
    const { onClose } = this.props;

    if (document.body) {
      document.body.removeChild(this.portal);
    }

    document.removeEventListener("mouseup", this.onCloseEvent);
    document.removeEventListener("keyup", this.onCloseEvent);
    window.removeEventListener("resize", onClose);
  }

  onCloseEvent(e: Event) {
    const { onClose } = this.props;

    if (!this.portal.contains(e.target)) {
      onClose();
    }
  }

  render() {
    return null;
  }
}

Portal.defaultProps = {
  onClose: () => {},
  children: null,
  closeOnClick: false,
  closeOnType: false,
  closeOnResize: false,
};

export default Portal;
