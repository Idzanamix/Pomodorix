import React, { useRef, useState } from 'react';
import styles from './menuTodoListDropdown.module.css'
import { IconClear, IconTrash } from '@/app/icons';
import { useModalCloser } from '../../../hooks/useModalCloser';
import { useDispatch } from 'react-redux';
import { createPortal } from 'react-dom';
import { modalRoot } from '../../../utils/modalRoot';
import { DeleteModalList } from './DeleteModalList';
import { clearAllTodos, deleteAllIsFinishedTodos } from '../../../storeRedux/todos/todosSlice';
import { interval } from '../../Timer';
import { setStopScroll } from '../../../utils/setStopScroll';

interface IMenuTodoListDropdown {
  onClose: () => void;
}

export function MenuTodoListDropdown({ onClose }: IMenuTodoListDropdown) {
  const root = modalRoot(true);
  const refList = useRef(null);
  const dispatch = useDispatch();
  const [isToDeleteModalOpen, setIsToDeleteModalOpen] = useState(false);
  const [isToClearModalOpen, setIsToClearModalOpen] = useState(false);
  const refDeleteModal = useRef<HTMLDivElement>(null);
  useModalCloser({ onClose, ref: refList, ref2: refDeleteModal });

  function handleClear() {
    setIsToClearModalOpen(true);
    !isToClearModalOpen && setStopScroll(true);
  }

  function handleDelete() {
    setIsToDeleteModalOpen(true);
    !isToDeleteModalOpen && setStopScroll(true);
  }

  function handleClearOnClose() {
    dispatch(clearAllTodos());
    clearInterval(interval);
  }

  function handleDeleteOnClose() {
    dispatch(deleteAllIsFinishedTodos());
  }

  return (<>
    {root && isToClearModalOpen && createPortal(
      <DeleteModalList
        ref={refDeleteModal}
        props={{
          onClose,
          handleClick: handleClearOnClose,
          text: 'Oчистить всe задачи?',
          buttonText: 'Очистить'
        }}
      />, root)}

    {root && isToDeleteModalOpen && createPortal(
      <DeleteModalList
        ref={refDeleteModal}
        props={{
          onClose,
          handleClick: handleDeleteOnClose,
          text: 'Удалить выполненные задачи?',
          buttonText: 'Удалить'
        }}
      />, root)}

    <ul
      className={styles.list}
      ref={refList}
    >
      <li className={styles.item}>
        <button
          className={styles.button}
          onClick={handleClear}
        >
          <IconClear />
          Очистить всё
        </button>
        <button
          className={styles.button}
          onClick={handleDelete}
        >
          <IconTrash />
          Удалить выполненное
        </button>
      </li>
    </ul>
  </>
  )
}
