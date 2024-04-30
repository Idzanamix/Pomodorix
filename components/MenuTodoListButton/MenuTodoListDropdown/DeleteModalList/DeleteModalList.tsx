import React, { forwardRef, useRef } from 'react';
import styles from './deleteModalList.module.css'
import { IconX } from '@/app/icons';
import { useModalCloser } from '../../../../hooks/useModalCloser';

interface IDeleteModalProps {
  props: {
    onClose: () => void;
    text?: string;
    buttonText?: string;
    handleClick: () => void;
  }
}

export const DeleteModalList = forwardRef(
  function DeleteModal({ props }: IDeleteModalProps, ref: any) {
    const { onClose, text, buttonText, handleClick } = props;
    const refBody = useRef(null)
    useModalCloser({ onClose, ref: refBody });

    function handleClickToClose() {
      handleClick();
      onClose();
    }

    return (
      <div className={styles.modal} ref={ref}>
        <div className={styles.body} ref={refBody}>
          <span className={styles.descr}>
            {text || 'Вы действительно хотите удалить задачу?'}
          </span>
          <button
            className={styles.deleteButton}
            onClick={handleClickToClose}
          >
            {buttonText || 'Удалить'}
          </button>
          <button
            className={styles.cancelButton}
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className={styles.closeButton}
            onClick={onClose}
          >
            <IconX />
          </button>
        </div>
      </div>
    )
  })
