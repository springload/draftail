import React from "react";
import type { Node } from "react";
import ReactModal from "react-modal";
const className = {
  base: "modal",
  afterOpen: "modal--open",
  beforeClose: "modal--before-close",
};
const overlayClassName = {
  base: "modal__overlay",
  afterOpen: "modal__overlay--open",
  beforeClose: "modal__overlay--before-close",
};
type Props = {
  onAfterOpen: () => void | Promise<void>;
  onRequestClose: (arg0: React.SyntheticEvent) => void;
  isOpen: boolean;
  contentLabel: string;
  children: Node;
};

const Modal = (props: Props) => (
  <ReactModal
    className={className}
    overlayClassName={overlayClassName}
    bodyOpenClassName="modal__container--open"
    portalClassName="portal"
    ariaHideApp={false}
    {...props}
  />
);

export default Modal;