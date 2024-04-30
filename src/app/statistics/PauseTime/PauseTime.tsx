import React from 'react';
import styles from './pauseTime.module.css'
import { IconPauseTime } from '@/app/icons';
import { toHoursAndMinutes } from '../../../../utils/convertTime';

interface IPauseTime {
  value?: number
}

export function PauseTime({ value }: IPauseTime) {
  const currentValue = value ? toHoursAndMinutes(value / 60) : '0мин';

  return (
    <div
      style={{ backgroundColor: value ? 'var(--pauseColor)' : 'var(--whiteF4)' }}
      className={`${styles.pauseTime}${value ? ' ' + styles.svgColor : ''}`}
    >
      <span className={styles.descr}>
        Время на паузе
        <span
          style={{
            fontSize: value && value > 3600 ? 34 : '',
            fontWeight: value && value > 3600 ? 500 : ''
          }}
          className={styles.value}
        >
          {value && value > 59 ? currentValue : value + 'сек'}
        </span>
      </span>
      <IconPauseTime />
    </div>
  )
}
