import React, { Component } from "react";
import ReactDOM from "react-dom";

interface DefaultProps {
  children?: React.ReactNode;
  closeOnClick: boolean;
  closeOnType: boolean;
  closeOnResize: boolean;
}

export interface PortalProps extends DefaultProps {
  onClose: () => void;
}

class Portal extends Component<PortalProps> {
  portal?: HTMLDivElement;

  // eslint-disable-next-line react/static-property-placement
  static defaultProps: DefaultProps;

  constructor(props: PortalProps) {
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

    if (!this.portal) {
      return;
    }

    ReactDOM.render(<div>{children}</div>, this.portal);
  }

  componentWillUnmount() {
    const { onClose } = this.props;

    if (document.body && this.portal) {
      document.body.removeChild(this.portal);
    }

    document.removeEventListener("mouseup", this.onCloseEvent);
    document.removeEventListener("keyup", this.onCloseEvent);
    window.removeEventListener("resize", onClose);
  }

  onCloseEvent(e: KeyboardEvent | MouseEvent) {
    const { onClose } = this.props;

    if (e.target instanceof Element && !this.portal!.contains(e.target)) {
      onClose();
    }
  }

  render() {
    return null;
  }
}

Portal.defaultProps = {
  children: null,
  closeOnClick: false,
  closeOnType: false,
  closeOnResize: false,
};

export default Portal;
