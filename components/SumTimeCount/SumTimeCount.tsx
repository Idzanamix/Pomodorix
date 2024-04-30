import React from 'react';
import styles from './sumTimeCount.module.css'
import { toHoursAndMinutes } from '../../utils/convertTime';

export function SumTimeCount({ timer }: { timer: number }) {
  return (
    <span className={styles.timer}>{toHoursAndMinutes(timer / 60)}</span>
  )
}
