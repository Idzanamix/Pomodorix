import React from 'react';
import styles from './statisticsLink.module.css'
import Link from 'next/link';
import { IconStats } from '@/app/icons/IconStats';

export function StatisticsLink() {
  return (
    <Link href='/statistics' className={styles.link}>
      <IconStats />
      Статистика
    </Link>
  )
}
