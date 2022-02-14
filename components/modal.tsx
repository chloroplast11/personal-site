import React, { Component } from 'react';
import styles from '../styles/modal.module.scss';
import ReactDOM from 'react-dom';

export const Modal = ({children}) => {

  const modalWrapper = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {children}
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalWrapper, document.getElementById('__next'))
}

export default Modal;

