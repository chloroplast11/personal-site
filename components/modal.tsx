import React, { Component } from 'react';
import styles from '../styles/modal.module.scss';
import ReactDOM from 'react-dom';

export const Modal = ({children, setVisibleState, onSave}) => {

  const modalWrapper = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        {children}
        <div className={styles.footer}>
          <button onClick={() => setVisibleState(false)}>关闭</button>
          <button onClick={() => onSave()}>确定</button>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalWrapper(), document.getElementById('__next'))
}

export default Modal;

