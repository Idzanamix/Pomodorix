import { useDispatch } from 'react-redux';
import { ToggleSwitch } from './ToggleSwitch';
import styles from './settingsDropdown.module.css';
import React, { ChangeEvent, useRef } from 'react';
import { Coords } from '../../../../hooks/useCoords';
import { setStopScroll } from '../../../../utils/setStopScroll';
import {
  IconAnimation,
  IconHide,
  IconNight,
  IconNotification,
  IconTimeGo,
  IconTimer,
  IconVolume
} from '@/app/icons';
import { useModalCloser } from '../../../../hooks/useModalCloser';
import {
  useAppSelector,
  selectNotifications,
  selectSound,
  selectNotificationTime,
  selectIsReadyTodosHidden,
  selectIsAnimation,
  selectIsDarkMode
} from '../../../../storeRedux/storeSelectors';
import {
  setIsAnimation,
  setIsDarkMode,
  setIsReadyTodosHidden,
  setNotificationTime,
  setTimerSettingsModalIsOpen,
  toggleNotification,
  toggleSound
} from '../../../../storeRedux/page/pageSlice';
import { useCustomMatchMedia } from '../../../../hooks/useCustomMatchMedia';
import { useResizeCloser } from '../../../../hooks/useResizeCloser';
import { Cover } from '../../../Cover';

interface ISettingsDropdown {
  coords: Coords | null;
  onClose: () => void;
}

export function SettingsDropdown({ coords, onClose }: ISettingsDropdown) {
  const dispatch = useDispatch();
  const { mobile } = useCustomMatchMedia();
  const isSound = useAppSelector(selectSound);
  const refList = useRef<HTMLUListElement>(null);
  const isDarkMode = useAppSelector(selectIsDarkMode);
  const isAnimation = useAppSelector(selectIsAnimation);
  const inputValue = useAppSelector(selectNotificationTime);
  const isNotification = useAppSelector(selectNotifications);
  const isReadyTodosHidden = useAppSelector(selectIsReadyTodosHidden);
  useModalCloser({ onClose, ref: refList, timeDelay: 100 });
  useResizeCloser(onClose);

  function handleClick() {
    setTimeout(() => {
      dispatch(setTimerSettingsModalIsOpen(true));
      setStopScroll(true);
    }, 50)
  }

  function handleChangeInputValue(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    dispatch(setNotificationTime(e.target.valueAsNumber));
  }

  const onClickSound = () => dispatch(toggleSound(!isSound));
  const onClickOffAnimation = () => dispatch(setIsAnimation(!isAnimation));
  const onClickNotification = () => dispatch(toggleNotification(!isNotification));
  const onClickToHideIsReadyTodos = () => dispatch(setIsReadyTodosHidden(!isReadyTodosHidden));
  const onClickIsDarkMode = () => dispatch(setIsDarkMode(!isDarkMode));

  return (<>
    {mobile && <Cover />}
    <ul
      style={!mobile ? {
        left: coords?.left + 'px',
        top: 15 + (coords ? coords?.top : 0) + 'px'
      } : {}}
      className={styles.dropdownList}
      ref={refList}
    >
      <li className={styles.item}>
        <button className={styles.button} onClick={handleClick}>
          <IconTimer />
          Настройки таймера
        </button>
      </li>
      <li
        className={styles.item}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <label htmlFor="soundRange" className={styles.label}>
          <IconTimeGo />
          Отображение уведомлений /сек
        </label>
        <div className={styles.wrapper}>
          <input
            className={styles.input}
            id='soundRange'
            type="range"
            min={1}
            max={30}
            step={1}
            value={inputValue}
            onChange={handleChangeInputValue}
          />
          <output className={styles.output}>{inputValue}</output>
        </div>
      </li>
      <li className={styles.item}>
        <IconNotification />
        Выключить уведомления
        <ToggleSwitch id='notification' onClick={onClickNotification} isActive={!isNotification} />
      </li>
      <li className={styles.item}>
        <IconVolume />
        Выключить звук уведомлений
        <ToggleSwitch id='sound' onClick={onClickSound} isActive={!isSound} />
      </li>
      <li className={styles.item}>
        <IconHide />
        Скрыть завершённые задачи
        <ToggleSwitch id='hideIsReadyTodos' onClick={onClickToHideIsReadyTodos} isActive={isReadyTodosHidden} />
      </li>
      <li className={styles.item}>
        <IconAnimation />
        Выключить анимацию
        <ToggleSwitch id='offAnimation' onClick={onClickOffAnimation} isActive={!isAnimation} />
      </li>
      <li className={styles.item}>
        <IconNight />
        Тёмная тема
        <ToggleSwitch id='darkMode' onClick={onClickIsDarkMode} isActive={isDarkMode} />
      </li>
    </ul>
  </>
  )
}
