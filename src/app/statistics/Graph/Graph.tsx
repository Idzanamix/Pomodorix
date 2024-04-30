import React, { useCallback, useEffect, useState } from 'react';
import styles from './graph.module.css'
import { toHoursAndMinutes } from '../../../../utils/convertTime';
import { IStatistics, setWeekDay } from '../../../../storeRedux/todos/todosSlice';
import { useDispatch } from 'react-redux';
import { getCurrentWeekDay } from '../page';

interface IGraph {
  currentWeekData?: IStatistics[];
  currentWeekDay: number;
  mounted: boolean;
}

export function Graph({ currentWeekData, currentWeekDay, mounted }: IGraph) {
  const dispatch = useDispatch();
  const [scale, setScale] = useState(1);

  const getWorkTime = useCallback((weekNumber: number) => {
    const workTime = ((getCurrentWeekDay(weekNumber, mounted, currentWeekData)?.sumWorkTime || 0) / 60) * 4

    return workTime < (5 * scale) ? (5 * scale) : workTime;
  }, [currentWeekData, mounted, scale]);

  useEffect(() => {
    let changedScale = scale;

    for (let i = 1; i < 7; i++) {
      const currentScale = Math.ceil((getWorkTime(i) / 4) / 100);
      changedScale = changedScale <= currentScale ? currentScale : changedScale;
    }

    setScale(changedScale);

  }, [getWorkTime, scale]);

  return (
    <div className={styles.graph}>
      <div className={styles.line}>{toHoursAndMinutes(100 * scale)}</div>
      <div className={styles.line}>{toHoursAndMinutes(75 * scale)}</div>
      <div className={styles.line}>{toHoursAndMinutes(50 * scale)}</div>
      <div className={styles.line}>{toHoursAndMinutes(25 * scale)}</div>
      <button
        style={{
          paddingTop: getWorkTime(1) / scale,
          color: currentWeekDay === 1 ? 'var(--red)' : ''
        }}
        className={`${styles.button}${getWorkTime(1) < 6 * scale ? '' : ' ' + styles.color}`}
        onClick={() => dispatch(setWeekDay(1))}
      >Пн</button>
      <button
        style={{
          paddingTop: getWorkTime(2) / scale,
          color: currentWeekDay === 2 ? 'var(--red)' : ''
        }}
        className={`${styles.button}${getWorkTime(2) < 6 * scale ? '' : ' ' + styles.color}`}
        onClick={() => dispatch(setWeekDay(2))}
      >Вт</button>
      <button
        style={{
          paddingTop: getWorkTime(3) / scale,
          color: currentWeekDay === 3 ? 'var(--red)' : ''
        }}
        className={`${styles.button}${getWorkTime(3) < 6 * scale ? '' : ' ' + styles.color}`}
        onClick={() => dispatch(setWeekDay(3))}
      >Ср</button>
      <button
        style={{
          paddingTop: getWorkTime(4) / scale,
          color: currentWeekDay === 4 ? 'var(--red)' : ''
        }}
        className={`${styles.button}${getWorkTime(4) < 6 * scale ? '' : ' ' + styles.color}`}
        onClick={() => dispatch(setWeekDay(4))}
      >Чт</button>
      <button
        style={{
          paddingTop: getWorkTime(5) / scale,
          color: currentWeekDay === 5 ? 'var(--red)' : ''
        }}
        className={`${styles.button}${getWorkTime(5) < 6 * scale ? '' : ' ' + styles.color}`}
        onClick={() => dispatch(setWeekDay(5))}
      >Пт</button>
      <button
        style={{
          paddingTop: getWorkTime(6) / scale,
          color: currentWeekDay === 6 ? 'var(--red)' : ''
        }}
        className={`${styles.button}${getWorkTime(6) < 6 * scale ? '' : ' ' + styles.color}`}
        onClick={() => dispatch(setWeekDay(6))}
      >Сб</button>
      <button
        style={{
          paddingTop: getWorkTime(7) / scale,
          color: currentWeekDay === 7 ? 'var(--red)' : ''
        }}
        className={`${styles.button}${getWorkTime(7) < 6 * scale ? '' : ' ' + styles.color}`}
        onClick={() => dispatch(setWeekDay(7))}
      >Вс</button>
    </div>
  )
}
