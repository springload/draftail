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

interface ModalProps {
  onAfterOpen: () => void | Promise<void>;
  onRequestClose: (e: React.SyntheticEvent) => void;
  isOpen: boolean;
  contentLabel: string;
  children: React.ReactNode;
}

const Modal = (props: ModalProps) => (
  <ReactModal
    className={className}
    overlayClassName={overlayClassName}
    bodyOpenClassName="modal__container--open"
    portalClassName="portal"
    ariaHideApp={false}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  />
);

export default Modal;
