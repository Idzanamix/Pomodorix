import React from 'react';
import styles from './focus.module.css'
import { IconFocus } from '@/app/icons';

interface IFocus {
  value?: number;
}

export function Focus({ value }: IFocus) {
  return (
    <div
      style={{ backgroundColor: value ? 'var(--focusColor)' : 'var(--whiteF4)' }}
      className={`${styles.focus}${value ? ' ' + styles.svgColor : ''}`}
    >
      <span className={styles.descr}>
        Фокус
        <span className={styles.value}>
          {(value || 0) + '%'}
        </span>
      </span>
      <IconFocus />
    </div>
  )
}
