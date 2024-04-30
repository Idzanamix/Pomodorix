import { IconX } from '@/app/icons';
import { useDispatch } from 'react-redux';
import styles from './deleteModal.module.css'
import { todoContext } from '../../context/todoContext';
import { useModalCloser } from '../../hooks/useModalCloser';
import React, { forwardRef, useContext, useRef } from 'react';
import { removeTodo } from '../../storeRedux/todos/todosSlice';

interface IDeleteModalProps {
  onClose: () => void;
  onReset?: () => void;
}

export const DeleteModal = forwardRef(
  function DeleteModal({ onClose, onReset }: IDeleteModalProps, ref: any) {
    const refBody = useRef(null)
    const dispatch = useDispatch();
    const { id } = useContext(todoContext);
    useModalCloser({ onClose, ref: refBody });

    function handleClick() {
      dispatch(removeTodo(id));
      onReset?.();
      onClose();
    }

    return (
      <div className={styles.modal} ref={ref}>
        <div className={styles.body} ref={refBody}>
          <span className={styles.descr}>
            Удалить задачу?
          </span>
          <button
            className={styles.deleteButton}
            onClick={handleClick}
          >
            Удалить
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
