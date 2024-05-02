'use client'
import React, { useRef, useState } from 'react';
import styles from './selectWeek.module.css'
import { IconArrow } from '@/app/icons';
import { modalRoot } from '../../utils/modalRoot';
import { createPortal } from 'react-dom';
import { useCoords } from '../../hooks/useCoords';
import { useUnmount } from '../../hooks/useUnmount';
import { useDispatch } from 'react-redux';
import { setCurrentWeek } from '../../storeRedux/todos/todosSlice';
import { useModalCloser } from '../../hooks/useModalCloser';
import { useResizeCloser } from '../../hooks/useResizeCloser';

interface ISelectWeek {
  weekNumber: number;
}

export function SelectWeek({ weekNumber }: ISelectWeek) {
  const dispatch = useDispatch();
  const [mounted] = useUnmount()
  const root = modalRoot(mounted);
  const [isOpen, setIsOpen] = useState(false);
  const refDropdown = useRef<HTMLDivElement>(null);
  const refSelectButton = useRef<HTMLButtonElement>(null);
  const [coords] = useCoords(refSelectButton, isOpen);
  useModalCloser({ ref: refSelectButton, onClose: handleClose, ref2: refDropdown });
  useResizeCloser(() => setIsOpen(false));

  function handleClick() {
    setIsOpen(!isOpen);
  }

  function handleClose() {
    setIsOpen(false);
  }

  function handleClickCurrent() {
    dispatch(setCurrentWeek(1));
    setIsOpen(false);
  }

  function handleClickPrewWeek() {
    dispatch(setCurrentWeek(2));
    setIsOpen(false);
  }

  function handleClickPrewTwoWeeks() {
    setIsOpen(false);
    dispatch(setCurrentWeek(3));
  }

  const weeks = [
    { weekNumber: 'Текущая неделя' },
    { weekNumber: 'Предыдущая неделя' },
    { weekNumber: '2 недели назад' }
  ]

  return mounted && (<>
    <button
      className={styles.selectButton}
      onClick={handleClick}
      ref={refSelectButton}
    >
      {weeks[weekNumber - 1].weekNumber}
      <IconArrow isOpen={isOpen} />
    </button>
    {isOpen && root && createPortal(
      <div
        style={{
          top: coords?.top,
          left: coords?.left,
          width: refSelectButton.current?.scrollWidth
        }}
        ref={refDropdown}
        className={styles.dropdown}
      >
        {weekNumber !== 1 &&
          <button
            className={styles.button}
            onClick={handleClickCurrent}
          >
            Текущая неделя
          </button>}
        {weekNumber !== 2 &&
          <button
            className={styles.button}
            onClick={handleClickPrewWeek}
          >
            Предыдущая неделя
          </button>}
        {weekNumber !== 3 &&
          <button
            className={styles.button}
            onClick={handleClickPrewTwoWeeks}
          >
            2 недели назад
          </button>}
      </div>, root)}
  </>)
}
