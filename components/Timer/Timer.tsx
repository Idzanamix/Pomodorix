'use client'
import styles from './timer.module.css'
import { useDispatch } from 'react-redux';
import { IconBigPlus } from '@/app/icons';
import { useUnmount } from '../../hooks/useUnmount';
import { formatTime } from '../../utils/formatTime';
import { RandomWordsDescr } from '../RandomWordsDescr';
import { setStopScroll } from '../../utils/setStopScroll';
import { setNotification } from '../../utils/setNotification';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { setTimerSettingsModalIsOpen } from '../../storeRedux/page/pageSlice';
import { updateTimerAfterLogout } from '../../storeRedux/todos/mutateTimerMinute';
import {
  selectAddedMinutesCount,
  selectCurrentTimer,
  selectCurrentTodo,
  selectCurrentTomato,
  selectIndex,
  selectIsAnimation,
  selectIsNotFinishedTodo,
  selectIsPause,
  selectIsStarted,
  selectNotificationTime,
  selectNotifications,
  selectSound,
  selectTimer,
  selectTodos,
  useAppSelector
} from '../../storeRedux/storeSelectors';
import {
  addCurrentTomatoNumber,
  resetOneMinutePlus,
  resetSumTime,
  returnTimeAfterPause,
  setCurrentTomatoNumber,
  setIsBreak,
  setIsFinished,
  setIsPause,
  setIsStarted,
  setOneMinutePlus,
  setPauseLogs,
  setStopLogs,
  setTimer,
  setTomatoLogs,
  setWorkLogs,
  setWorldTimePauseStarted,
  timeStepSecond,
} from '../../storeRedux/todos/todosSlice';

export let interval: NodeJS.Timeout;

export function Timer() {
  const [mounted] = useUnmount();
  const dispatch = useDispatch();
  const todos = useAppSelector(selectTodos);
  const isSound = useAppSelector(selectSound);
  const isPause = useAppSelector(selectIsPause);
  const timerMinute = useAppSelector(selectTimer);
  const isStarted = useAppSelector(selectIsStarted);
  const isAnimation = useAppSelector(selectIsAnimation);
  const currentTimer = useAppSelector(selectCurrentTimer);
  const isNotification = useAppSelector(selectNotifications);
  const notificationTime = useAppSelector(selectNotificationTime);
  const isNotFinishedTodo = useAppSelector(selectIsNotFinishedTodo);
  const addedMinutesCount = useAppSelector(selectAddedMinutesCount);
  const { currentNumberTomato, isBreak, shortBreak } = timerMinute;
  const currentTodo = useAppSelector(selectCurrentTodo(currentNumberTomato));
  const currentTodoIndex = useAppSelector(selectIndex(currentTodo?.id || ''));
  const currentTomato = useAppSelector(selectCurrentTomato(currentNumberTomato));
  const initialTimer = isBreak ? currentTomato?.breakTime : currentTomato?.workTime;
  const styledColorIsStarted = isStarted ? isBreak ? 'var(--colorButton)' : 'var(--red)' : '';
  const isShortBreak = currentTomato?.breakTime === shortBreak ? 'Короткий перерыв' : 'Длинный перерыв';
  const [isToggleFirstRightNumber, setIsToggleFirstRightNumber] = useState(false);
  const [isToggleSecondRightNumber, setIsToggleSecondRightNumber] = useState(false);
  const [isToggleFirstLeftNumber, setIsToggleFirstLeftNumber] = useState(false);
  const [isToggleSecondLeftNumber, setIsToggleSecondLeftNumber] = useState(false);
  const formatedTimerString = formatTime(currentTimer);
  const firstRightNumber = formatedTimerString.substring(0, 1);
  const secondRightNumber = formatedTimerString.substring(1, 2);
  const firstLeftNumber = formatedTimerString.substring(3, 4);
  const secondLeftNumber = formatedTimerString.substring(4, 5);
  const loaderWidth = currentTimer / ((initialTimer + (addedMinutesCount || 0) * 60) / 100);
  const notificationText = isBreak
    ? 'Перерыв окончен'
    : currentTodo?.currentSumTomatoCount === currentTomato?.tomatoNumber
      ? `${currentTodo?.text} - Готово!`
      : `Помидор ${currentNumberTomato} выполнен!`;
  const numberAnimation = isAnimation ? isStarted && !isPause ? '' : 'none' : 'none';
  const numberAnimationFirst = isAnimation ? isStarted && !isPause ? ' ' + styles.animationFirst : '' : '';

  const timesUp = useCallback(() => {
    if (!currentTodo || !isNotFinishedTodo) return;

    setNotification(notificationTime, notificationText, isNotification, isSound);
    dispatch(setIsBreak(!isBreak));
    dispatch(setIsStarted(false));
    dispatch(setIsPause(false));
    dispatch(setWorkLogs());
    dispatch(resetOneMinutePlus());
    !isBreak && dispatch(setTomatoLogs());
    isBreak && dispatch(setCurrentTomatoNumber());

    (currentTodo?.currentSumTomatoCount === currentTomato?.tomatoNumber) &&
      dispatch(setIsFinished(currentTodo.id));

    clearInterval(interval);
  }, [currentTodo,
    currentTomato?.tomatoNumber,
    dispatch,
    isBreak,
    isNotFinishedTodo,
    isNotification,
    isSound,
    notificationText,
    notificationTime]);

  const handleClick = useCallback((currentTimer: number) => {
    if (!currentTodo || !isNotFinishedTodo) return;
    !isStarted && Notification.requestPermission();
    let timer = currentTimer;

    dispatch(setWorkLogs());

    isPause && dispatch(returnTimeAfterPause());

    isPause && dispatch(setPauseLogs());
    dispatch(setIsPause(false));
    !isStarted && dispatch(setIsStarted(true));

    interval = setInterval(() => {
      if (timer > 0) {
        --timer;
        dispatch(timeStepSecond());
        dispatch(setWorkLogs());
      }

      if (timer <= 0) {
        timesUp();
      }
    }, 1000);
  }, [currentTodo, dispatch, isNotFinishedTodo, isPause, isStarted, timesUp]);

  useEffect(() => {
    if (!currentTomato) return;

    dispatch(resetSumTime());
    !isStarted && dispatch(setTimer((initialTimer)));
    const timerAfterUpdate = updateTimerAfterLogout(timerMinute, currentTomato);
    const timeDelay = currentTimer - timerAfterUpdate;

    if ((Math.abs(timeDelay) >= 2 || !interval) && isStarted && !isPause) {
      clearInterval(interval);
      dispatch(setTimer((timerAfterUpdate)));
      handleClick(timerAfterUpdate);
    }

    if (isBreak &&
      currentTomato?.breakTime === 0 &&
      todos.length > 0 &&
      !isNotFinishedTodo) {
      dispatch(setIsBreak(false));
      dispatch(addCurrentTomatoNumber());
    }
  }, [isBreak,
    currentTomato,
    currentTimer,
    todos,
    isNotFinishedTodo,
    dispatch,
    isStarted,
    isPause,
    handleClick,
    initialTimer,
    timerMinute]);

  useEffect(() => {
    setIsToggleFirstRightNumber(!isToggleFirstRightNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstRightNumber]);

  useEffect(() => {
    setIsToggleSecondRightNumber(!isToggleSecondRightNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondRightNumber]);

  useEffect(() => {
    setIsToggleFirstLeftNumber(!isToggleFirstLeftNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLeftNumber]);

  useEffect(() => {
    setIsToggleSecondLeftNumber(!isToggleSecondLeftNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondLeftNumber]);

  function handlePause() {
    dispatch(setIsPause(true));
    dispatch(setStopLogs());
    dispatch(setWorkLogs());
    dispatch(setWorldTimePauseStarted());
    clearInterval(interval);
  }

  function handleStop() {
    dispatch(setIsStarted(false));
    dispatch(setIsPause(false));
    dispatch(setTimer((initialTimer)));
    dispatch(resetOneMinutePlus());
    clearInterval(interval);
  }

  function clickOnPlus() {
    isStarted && dispatch(setOneMinutePlus());
  }

  return mounted && (
    <div className={styles.timer}>
      <div className={styles.header}>
        <div
          className={`${styles.loader}${isAnimation && isStarted && !isPause ? ' ' + styles.background : ''}`}
          style={{
            backgroundColor: styledColorIsStarted,
            boxShadow: isStarted ? '' : 'none',
            width: `${loaderWidth + '%'}`,
          }}
        >
          <div className={styles.inner} />
        </div>
        {currentTodo
          ? <h2 className={styles.title}>
            {currentTodo.text}
          </h2>
          : <RandomWordsDescr />}

        {currentTomato && <span className={styles.count}>
          {`Помидор ${currentTomato?.tomatoNumber}`}
        </span>}
      </div>
      <div className={styles.body}>
        <div
          style={{ color: styledColorIsStarted }}
          className={styles.time}
        >
          {isToggleFirstRightNumber &&
            <div
              style={{ animation: numberAnimation }}
              className={`${styles.number}${numberAnimationFirst}`}>
              {firstRightNumber}
            </div>}
          {!isToggleFirstRightNumber &&
            <div
              style={{ animation: numberAnimation }}
              className={`${styles.number}${numberAnimationFirst}`}>
              {firstRightNumber}
            </div>}
          {isToggleSecondRightNumber &&
            <div
              style={{ animation: numberAnimation }}
              className={`${styles.number}${numberAnimationFirst}`}>
              {secondRightNumber}
            </div>}
          {!isToggleSecondRightNumber &&
            <div
              style={{ animation: numberAnimation }}
              className={`${styles.number}${numberAnimationFirst}`}>
              {secondRightNumber}
            </div>}
          <span className={styles.dots} >:</span>
          {isToggleFirstLeftNumber &&
            <div
              style={{ animation: numberAnimation }}
              className={`${styles.number}${numberAnimationFirst}`}>
              {firstLeftNumber}
            </div>}
          {!isToggleFirstLeftNumber &&
            <div
              style={{ animation: numberAnimation }}
              className={`${styles.number}${numberAnimationFirst}`}>
              {firstLeftNumber}
            </div>}
          {isToggleSecondLeftNumber &&
            <div
              className={`${styles.number}${currentTimer < 10 ? ' ' + styles.animation : ''}`}
              style={{ animation: numberAnimation }}
            >
              {secondLeftNumber}
            </div>}
          {!isToggleSecondLeftNumber &&
            <div
              className={`${styles.number}${currentTimer < 10 ? ' ' + styles.animation : ''}`}
              style={{ animation: numberAnimation }}
            >
              {secondLeftNumber}
            </div>}
          <button
            className={styles.button}
            onClick={clickOnPlus}
            disabled={isStarted ? false : true}
          >
            <IconBigPlus />
          </button>
        </div>

        <span className={styles.descr}>
          {todos.length > 0 && !isNotFinishedTodo
            ? 'Все задачи выполнены'
            : currentTodo
              ? `${isBreak ? isShortBreak : 'Задача'} ${isBreak ? '' : currentTodoIndex + 1} ${!isBreak ? ('- ' + currentTodo.text) : ''}`
              : 'Добавьте задачу'}
        </span>
        <div className={styles.buttons}>
          {isStarted && !isPause
            ?
            <button
              className={styles.buttonStart}
              onClick={handlePause}
              disabled={isNotFinishedTodo ? false : true}
            >
              Пауза
            </button>
            :
            <button
              className={styles.buttonStart}
              onClick={() => handleClick(currentTimer)}
              disabled={isNotFinishedTodo ? false : true}
            >
              {isStarted ? 'Продолжить' : 'Старт'}
            </button>}

          {isPause
            ? <button
              className={styles.buttonStop}
              onClick={timesUp}
              disabled={isStarted ? false : true}
            >
              Готово
            </button>
            : <button
              className={styles.buttonStop}
              onClick={handleStop}
              disabled={isStarted ? false : true}
            >
              Стоп
            </button>}
        </div>
      </div>
    </div>
  )
}


