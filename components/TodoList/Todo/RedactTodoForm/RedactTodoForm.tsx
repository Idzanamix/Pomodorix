import React, { ChangeEvent, forwardRef, useEffect, useRef, useState } from 'react';
import styles from './redactTodoForm.module.css'
import { useModalCloser } from '../../../../hooks/useModalCloser';
import { useDispatch } from 'react-redux';
import { redactTodo } from '../../../../storeRedux/todos/todosSlice';
import { DeleteModal } from '../../../DeleteModal';
import { createPortal } from 'react-dom';
import { modalRoot } from '../../../../utils/modalRoot';
import { useResizeCloser } from '../../../../hooks/useResizeCloser';

interface IRedactTodoForm {
  id: string;
  value: string;
  onClose: () => void;
}

export const RedactTodoForm = forwardRef(
  function RedactTodoForm({ id, value, onClose }: IRedactTodoForm, ref: any) {
    const root = modalRoot(true);
    const refTextarea = useRef<HTMLTextAreaElement>(null);
    const refSubmitButton = useRef<HTMLButtonElement>(null);
    const [height, setHeight] = useState(0)
    const [formValue, setFormValue] = useState(value);
    const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
    const dispatch = useDispatch();

    useModalCloser({ ref, onClose });

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
      setFormValue(event.target.value)

    const handleFocus = (event: ChangeEvent<HTMLTextAreaElement>) =>
      event.currentTarget.setSelectionRange(
        event.currentTarget.value.length,
        event.currentTarget.value.length
      );

    function handleSubmit(event: ChangeEvent<HTMLFormElement>) {
      event.preventDefault();
      if (formValue.trim()) {
        dispatch(redactTodo({ id, text: formValue }));
        onClose();
      } else {
        setIsOpenDeleteModal(true);
      }
    }

    useEffect(() => {
      if (refTextarea.current) {
        setHeight(refTextarea.current?.scrollHeight)
      }
    }, []);


    return (
      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <textarea
          placeholder='Введите изменения'
          onFocus={handleFocus}
          onChange={handleChange}
          style={{ height: height + 2 }}
          className={styles.input}
          value={formValue}
          ref={refTextarea}
          autoFocus
        />
        <button
          type='submit'
          className={styles.button}
          ref={refSubmitButton}
        >
          Ок
        </button>
        <button
          type='button'
          className={styles.buttonCancel}
          onClick={onClose}
        >
          Отмена
        </button>

        {isOpenDeleteModal && root && createPortal(
          <DeleteModal onClose={onClose} />
          , root)}
      </form>
    )
  });
