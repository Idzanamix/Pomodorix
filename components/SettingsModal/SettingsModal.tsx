import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import styles from './settingsModal.module.css'
import { IconX } from '@/app/icons';
import { useDispatch } from 'react-redux';
import { useModalCloser } from '../../hooks/useModalCloser';
import { resetDefaultSettings, setDefaultSettings } from '../../storeRedux/todos/todosSlice';
import { setTimerSettingsModalIsOpen } from '../../storeRedux/page/pageSlice';
import { setStopScroll } from '../../utils/setStopScroll';

interface ISettingsModal {
  longBreak: number;
  workTime: number;
  shortBreak: number;
}

export function SettingsModal(props: ISettingsModal) {
  const { longBreak, shortBreak, workTime } = props;
  const refBody = useRef(null)
  const dispatch = useDispatch();
  const [workTimeValue, setWorkTimeValue] = useState(workTime / 60);
  const [shortBreakValue, setShortBreakValue] = useState(shortBreak / 60);
  const [longBreakValue, setLongBreakValue] = useState(longBreak / 60);
  const [isValidateWorkTimeValue, setIsValidateWorkTimeValue] = useState(false);
  const [isValidateShortBreakValue, setIsValidateShortBreakValue] = useState(false);
  const [isValidateLongBreakValue, setIsValidateLongBreakValue] = useState(false);
  const handleChangeWorkTimeValue = (event: ChangeEvent<HTMLInputElement>) =>
    setWorkTimeValue(event.target.valueAsNumber || 0);
  const handleChangeShortBreakValue = (event: ChangeEvent<HTMLInputElement>) =>
    setShortBreakValue(event.target.valueAsNumber || 0);
  const handleChangeLongBreakValue = (event: ChangeEvent<HTMLInputElement>) =>
    setLongBreakValue(event.target.valueAsNumber || 0);

  function onClose() {
    dispatch(setTimerSettingsModalIsOpen(false));
    setStopScroll(false);
  }

  useModalCloser({ onClose, ref: refBody, timeDelay: 50 });

  useEffect(() => {
    if (workTimeValue > 40 || workTimeValue < 20 || !workTimeValue) {
      setIsValidateWorkTimeValue(true);
    } else {
      setIsValidateWorkTimeValue(false);
    }

    if (shortBreakValue > 5 || shortBreakValue < 3 || !shortBreakValue) {
      setIsValidateShortBreakValue(true);
    } else {
      setIsValidateShortBreakValue(false);
    }

    if (longBreakValue > 30 || longBreakValue < 15 || !longBreakValue) {
      setIsValidateLongBreakValue(true);
    } else {
      setIsValidateLongBreakValue(false);
    }

  }, [longBreakValue, shortBreakValue, workTimeValue])

  function handleSubmit(event: ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
    onClose();
  }

  const handleSaveSettings = () =>
    dispatch(setDefaultSettings({ workTimeValue, shortBreakValue, longBreakValue }));

  function handleSettingsDefault() {
    dispatch(resetDefaultSettings())
  }

  return (
    <div className={styles.modal}>
      <div className={styles.body} ref={refBody}>
        <span className={styles.descr}>
          Настройки таймера
        </span>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >
          <label
            className={styles.label}
            htmlFor="workTime"
            style={{ color: isValidateWorkTimeValue ? 'var(--red)' : 'var(--gray)' }}
          >
            {isValidateWorkTimeValue
              ? 'Введите время от 20 до 40 мин:'
              : 'Время одного помидора:'}
          </label>
          <input
            type="number"
            id='workTime'
            className={styles.input}
            onChange={handleChangeWorkTimeValue}
            value={workTimeValue}
            min={20}
            max={40}
          />
          <label
            className={styles.label}
            htmlFor="shortBreakTime"
            style={{ color: isValidateShortBreakValue ? 'var(--red)' : 'var(--gray)' }}
          >
            {isValidateShortBreakValue
              ? 'Введите перерыв от 3 до 5 мин:'
              : 'Короткий перерыв:'}
          </label>
          <input
            type="number"
            id='shortBreakTime'
            className={styles.input}
            value={shortBreakValue}
            onChange={handleChangeShortBreakValue}
            min={3}
            max={5}
          />
          <label
            className={styles.label}
            htmlFor="longBreakTime"
            style={{ color: isValidateLongBreakValue ? 'var(--red)' : 'var(--gray)' }}
          >
            {isValidateLongBreakValue
              ? 'Введите перерыв от 15 до 30 мин:'
              : 'Длинный перерыв:'}
          </label>
          <input
            type="number"
            id='longBreakTime'
            className={styles.input}
            value={longBreakValue}
            onChange={handleChangeLongBreakValue}
            min={15}
            max={30}
          />

          <div className={styles.buttons}>
            <button
              className={styles.saveButton}
              disabled={(isValidateWorkTimeValue ||
                isValidateShortBreakValue ||
                isValidateLongBreakValue) ? true : false}
              onClick={handleSaveSettings}
              type='submit'
            >
              Сохранить
            </button>
            <button
              className={styles.defaultButton}
              onClick={handleSettingsDefault}
            >
              По умолчанию
            </button>
          </div>
        </form>
        <button
          className={styles.cancelButton}
          onClick={onClose}
        >
          Отмена
        </button>
        <button
          className={styles.closeButton}
          onClick={onClose}
        >
          <IconX />
        </button>
      </div>
    </div>
  )
}
