import { createPortal } from 'react-dom';
import styles from './dropdown.module.css'
import { DeleteModal } from '../../DeleteModal';
import React, { useContext, useRef, useState } from 'react';
import { modalRoot } from '../../../utils/modalRoot';
import { setStopScroll } from '../../../utils/setStopScroll';
import { useModalCloser } from '../../../hooks/useModalCloser';
import { IconMinus, IconPencil, IconPlus, IconTrash } from '@/app/icons';
import { todoContext } from '../../../context/todoContext';
import { useDispatch } from 'react-redux';
import {
  addCurrentTomatoNumber,
  changeTomatoCount,
  setIsBreak,
  setIsPause,
  setIsStarted,
  setTimer
} from '../../../storeRedux/todos/todosSlice';
import { interval } from '../../Timer';
import { useAppSelector, selectTimer, selectCurrentTomato } from '../../../storeRedux/storeSelectors';
import { Coords } from '../../../hooks/useCoords';
import { useResizeCloser } from '../../../hooks/useResizeCloser';
import { useCustomMatchMedia } from '../../../hooks/useCustomMatchMedia';
import { Cover } from '../../Cover';


interface IDropdown {
  onClose: () => void;
  isCurrent: boolean;
  coords: Coords | null;
}

export function Dropdown({ onClose, isCurrent, coords }: IDropdown) {
  const root = modalRoot(true);
  const refList = useRef<HTMLUListElement>(null);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const refDeleteModal = useRef<HTMLDivElement>(null);
  const { id, tomatoCount, onOpenToChangeTodo } = useContext(todoContext);
  const { currentNumberTomato, isBreak } = useAppSelector(selectTimer);
  const currentTomato = useAppSelector(selectCurrentTomato(currentNumberTomato));
  const { mobile } = useCustomMatchMedia();

  useModalCloser({ onClose, ref: refList, ref2: refDeleteModal, timeDelay: 100 });
  useResizeCloser(onClose);

  function handleClick() {
    setTimeout(() => {
      setStopScroll(true);
      setIsModalOpen(true);
    }, 30)
  }

  function resetTimer() {
    if (isCurrent) {
      clearInterval(interval);
      const initialTimer = isBreak ? currentTomato?.breakTime : currentTomato?.workTime;
      dispatch(setTimer((initialTimer)));
      dispatch(setIsStarted(false));
      dispatch(setIsBreak(false));
      dispatch(setIsPause(false));
      dispatch(addCurrentTomatoNumber());
    }
  }

  const handleIncrease = () => dispatch(changeTomatoCount({ id, text: '+' }));

  function handleReduce() {
    if (tomatoCount > 1) {
      dispatch(changeTomatoCount({ id, text: '-' }));
    } else {
      handleClick()
    }
  }

  return (<>
    {mobile && <Cover />}
    <ul
      className={styles.list}
      ref={refList}
      style={!mobile ? {
        top: (coords?.top || 0) - 7,
        left: (coords?.leftWidth || 0) - ((refList.current?.offsetWidth || 0) / 2) - 22
      } : {}}
    >
      <li className={styles.item}>
        <button
          className={styles.button}
          onClick={handleIncrease}
        >
          <IconPlus />
          Увеличить
        </button>
      </li>
      <li className={styles.item}>
        <button
          className={styles.button}
          onClick={handleReduce}
        >
          <IconMinus />
          Уменьшить
        </button>
      </li>
      <li className={styles.item}>
        <button
          className={styles.button}
          onClick={() => {
            onOpenToChangeTodo?.();
            onClose();
          }}
        >
          <IconPencil />
          Редактировать
        </button>
      </li>
      <li className={styles.item}>
        <button
          className={styles.button}
          onClick={handleClick}
        >
          <IconTrash />
          Удалить
        </button>
      </li>
    </ul >

    {root && isModalOpen && createPortal(
      <DeleteModal ref={refDeleteModal} {...{ onClose, onReset: resetTimer }} />, root)
    }
  </>
  )
}
