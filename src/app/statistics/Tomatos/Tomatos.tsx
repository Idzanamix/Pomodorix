import React from 'react';
import styles from './tomatos.module.css'
import { IconLogo, IconTomato } from '@/app/icons';

interface ITomatos {
  value?: number;
}

export function Tomatos({ value }: ITomatos) {
  return (
    <div className={styles.tomatos}>
      {value
        ?
        <>
          <div className={styles.count}>
            <IconLogo />
            {'x ' + value}
          </div>
          <div className={styles.descr}>
            {value + `${' помидор' + (value === 1
              ? ''
              : (value > 1 && value < 5 || value > 21 && value < 25)
                ? 'а'
                : (value === 21)
                  ? ''
                  : (value > 6)
                    ? 'ов'
                    : 'ов')}`}
          </div>
        </>
        :
        <IconTomato />}
    </div>
  )
}
