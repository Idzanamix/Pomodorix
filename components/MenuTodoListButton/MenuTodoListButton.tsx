import React, { useState } from 'react';
import styles from './menuTodoListButton.module.css'
import { IconMenu } from '@/app/icons';
import { MenuTodoListDropdown } from './MenuTodoListDropdown';
import { setStopScroll } from '../../utils/setStopScroll';
import { useAppSelector, selectTodos } from '../../storeRedux/storeSelectors';

export function MenuTodoListButton() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const todos = useAppSelector(selectTodos);

  function handleClose() {
    setStopScroll(false);
    setIsDropdownOpen(false);
  }

  function handleClick() {
    setIsDropdownOpen(!isDropdownOpen);
  }

  return (
    <>
      {<button
        className={styles.button}
        onClick={handleClick}
        disabled={todos.length > 0 ? false : true}
      >
        <IconMenu />
      </button>}

      {isDropdownOpen && <MenuTodoListDropdown onClose={handleClose} />}
    </>
  )
}
