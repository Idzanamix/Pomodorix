import React, { HTMLAttributes, useRef, useState } from 'react';
import styles from './todo.module.css'
import { MenuDropdown } from '../../MenuDropdown';
import { todoContext } from '../../../context/todoContext';
import { RedactTodoForm } from './RedactTodoForm';
import { setStopScroll } from '../../../utils/setStopScroll';
import { useAppSelector, selectCurrentTodo, selectTimer, selectIsAnimation } from '../../../storeRedux/storeSelectors';


export interface ITodo extends HTMLAttributes<HTMLLIElement> {
  id: string;
  text: string;
  tomatoCount: number;
  isFinished: boolean;
  onOpenToChangeTodo?: () => void;
  zIndex: number;
}

export function Todo(props: ITodo) {
  const { text, tomatoCount, id, isFinished } = props;
  const [isOpenToChangeTodo, setIsOpenToChangeTodo] = useState(false);
  const isAnimation = useAppSelector(selectIsAnimation);
  const todoProps = { ...props, onOpenToChangeTodo };
  const { currentNumberTomato, isStarted, isBreak } = useAppSelector(selectTimer);
  const currentTodo = useAppSelector(selectCurrentTodo(currentNumberTomato));
  const colorIsFocused = currentTodo?.id === id ? isStarted ? 'var(--todoFocus)' : '' : '';
  const borderColorIsFinished = isFinished ? 'var(--colorButton)' : '';
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isCurrent = currentTodo?.id === id ? true : false;
  const itemRef = useRef<HTMLLIElement>(null);

  function onOpenToChangeTodo() {
    setTimeout(() => {
      setIsOpenToChangeTodo(true);
    }, 30)
  };

  function handleClose() {
    setIsOpenToChangeTodo(false);
    setIsDropdownOpen(false);
    setStopScroll(false);
  }

  return (
    <todoContext.Provider value={todoProps}>
      <li
        className={styles.item}
        style={{
          borderColor: borderColorIsFinished,
          zIndex: props.zIndex,
          animation: isAnimation ? '' : 'none',
          transform: isAnimation ? '' : 'none'
        }}
        ref={itemRef}
      >
        <article
          className={styles.article}
          style={{ background: colorIsFocused }}
        >
          <span className={`${styles.count}${isDropdownOpen ? ' ' + styles.transform : ''}`}>
            <span
              className={styles.number}>
              {tomatoCount}
            </span>
          </span>

          {isOpenToChangeTodo || text}

          {isOpenToChangeTodo
            ? <RedactTodoForm
              ref={itemRef}
              onClose={handleClose}
              value={text}
              id={id}
            />
            : <MenuDropdown
              isOpen={isDropdownOpen}
              onOpen={(isOpen: boolean) => setIsDropdownOpen(isOpen)}
              ref={itemRef}
              isFinished={isFinished}
              isBreak={isBreak}
              isCurrent={isCurrent}
            />}
        </article>
      </li>
    </todoContext.Provider >
  )
}
