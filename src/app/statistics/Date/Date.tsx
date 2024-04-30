import React from 'react';
import styles from './date.module.css'
import { toHoursAndMinutes } from '../../../../utils/convertTime';

interface IDate {
  value?: number;
  weekDay?: string;
}

export function Date({ value, weekDay }: IDate) {
  return (
    <div className={styles.date}>
      <span className={styles.weekDay}>
        {weekDay}
      </span>
      {value
        ? <span className={styles.descr}>
          {'Вы работали над задачами в течение '}
          <span className={styles.number}>
            {value > 59 ? toHoursAndMinutes(value / 60) : value + ' сек'}
          </span>
        </span>
        : 'Нет данных'}
    </div>
  )
}
