import React from 'react';
import styles from './logoLink.module.css'
import { IconLogo } from '@/app/icons';
import Link from 'next/link';

export function LogoLink() {
  return (
    <Link href='/' className={styles.link}>
      <IconLogo />
      POMODORIX
    </Link>
  )
}
