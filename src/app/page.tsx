'use client'
import React, { Suspense } from "react";
import styles from './main.module.css'
import { Form } from "../../components/Form";
import { TodoList } from "../../components/TodoList";
import { Timer } from "../../components/Timer";
import {
  useAppSelector,
  selectTimer,
  selectTodos,
  selectIsOpenManual,
  selectIsReadyTodosHidden,
  selectCurrentTodo,
} from "../../storeRedux/storeSelectors";
import { SumTimeCount } from "../../components/SumTimeCount";
import { useUnmount } from "../../hooks/useUnmount";
import { ManualList } from "../../ManualList";
import { useDispatch } from "react-redux";
import { setIsOpenManual } from "../../storeRedux/todos/todosSlice";

export default function Main() {
  const dispatch = useDispatch();
  const [mounted] = useUnmount();
  const timer = useAppSelector(selectTimer);
  const todos = useAppSelector(selectTodos);
  const timerMinute = useAppSelector(selectTimer);
  const isOpenManual = useAppSelector(selectIsOpenManual);
  const isNotFinishedTodos = todos.filter(todo => !todo.isFinished);
  const isReadyTodosHidden = useAppSelector(selectIsReadyTodosHidden);
  const handleToggleManual = () => dispatch(setIsOpenManual(!isOpenManual));
  const currentTodo = useAppSelector(selectCurrentTodo(timerMinute.currentNumberTomato));

  const currentIsNotFinishedTodos = currentTodo?.isFinished
    ? [currentTodo, ...isNotFinishedTodos]
    : isNotFinishedTodos;

  return mounted && (
    <div className={styles.container}>
      <div className={styles.left}>
        <button
          className={styles.button}
          onClick={handleToggleManual}
        >
          {isOpenManual ? 'X' : '?'}
        </button>
        {isOpenManual && <ManualList />}
        <Form />
        <TodoList todos={isReadyTodosHidden ? currentIsNotFinishedTodos : todos} />
        <SumTimeCount timer={timer.sumTime} />
      </div>
      <Timer />
    </div>
  )
}

