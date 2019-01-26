// @flow
import React from "react";
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

type Props = {|
  onAfterOpen: () => void | Promise<void>,
  onRequestClose: (SyntheticEvent<>) => void,
  isOpen: boolean,
  contentLabel: string,
|};

const Modal = (props: Props) => (
  <ReactModal
    className={className}
    overlayClassName={overlayClassName}
    bodyOpenClassName="modal__container--open"
    portalClassName="portal"
    {...props}
  />
);

export default Modal;
