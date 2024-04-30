'use client'
import React, { ChangeEvent } from 'react';
import styles from './form.module.css'
import { useDispatch } from 'react-redux';
import { selectFormValue, useAppSelector } from '../../storeRedux/storeSelectors';
import { changeFormValue, resetFormValue } from '../../storeRedux/form/formSlice';
import { addTodo } from '../../storeRedux/todos/todosSlice';
import { MenuTodoListButton } from '../MenuTodoListButton';

export const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => event.preventDefault();

export function Form() {
  const dispatch = useDispatch();
  const formValue = useAppSelector(selectFormValue);

  const handleChangeForm = (event: ChangeEvent<HTMLInputElement>) =>
    dispatch(changeFormValue(event.target.value));

  function handleClick() {
    dispatch(addTodo(formValue));
    dispatch(resetFormValue());
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <input
        placeholder='Название задачи'
        onChange={handleChangeForm}
        className={styles.input}
        value={formValue}
        type="text"
      />
      <div className={styles.buttons}>
        <button
          className={styles.button}
          disabled={formValue ? false : true}
          type='submit'
          onClick={handleClick}
        >
          Добавить
        </button>
        <MenuTodoListButton />
      </div>
    </form>
  )
}
