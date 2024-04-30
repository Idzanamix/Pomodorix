import React from 'react';
import styles from './stops.module.css'
import { IconStops } from '@/app/icons';

interface IStops {
  value?: number;
}

export function Stops({ value }: IStops) {
  return (
    <div
      style={{ backgroundColor: value ? 'var(--stopColor)' : 'var(--whiteF4)' }}
      className={`${styles.stops}${value ? ' ' + styles.svgColor : ''}`}
    >
      <span className={styles.descr}>
        Остановки
        <span className={styles.value}>
          {value}
        </span>
      </span>
      <IconStops />
    </div>
  )
}
