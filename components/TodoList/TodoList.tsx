'use client'
import React from 'react';
import { Todo } from './Todo';
import styles from './todoList.module.css'
import { ITodosState } from '../../storeRedux/todos/todosSlice';

interface ITodoList {
  todos: ITodosState[]
}

export function TodoList({ todos }: ITodoList) {
  return todos[0] && (
    <>
      <ul className={styles.list}>
        {todos.map((todo, index) => <Todo zIndex={todos.length - index} key={todo.id} {...todo} />)}
      </ul>
    </>
  )
}
