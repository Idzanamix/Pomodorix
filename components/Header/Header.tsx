'use client'
import React, { useEffect } from 'react';
import styles from './header.module.css';
import { LogoLink } from './LogoLink';
import { StatisticsLink } from './StatisticsLink';
import { SettingsLink } from './SettingsLink';
import { createPortal } from 'react-dom';
import { SettingsModal } from '../SettingsModal';
import { useUnmount } from '../../hooks/useUnmount';
import { modalRoot } from '../../utils/modalRoot';
import { useAppSelector, selectIsOpenTimerSettingsModal, selectTimer, selectIsDarkMode } from '../../storeRedux/storeSelectors';

export function Header() {
  const [mounted] = useUnmount();
  const root = modalRoot(mounted);
  const isOpenTimerSettingsModal = useAppSelector(selectIsOpenTimerSettingsModal);
  const timerMinute = useAppSelector(selectTimer);
  const { workTime, shortBreak, longBreak } = timerMinute;
  const modalProps = { longBreak, shortBreak, workTime };
  const isDarkMode = useAppSelector(selectIsDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('isDarkMode')
    } else {
      document.body.classList.remove('isDarkMode')
    }
  }, [isDarkMode])

  return (<>
    {root && isOpenTimerSettingsModal &&
      createPortal(
        <SettingsModal {...modalProps} />, root)}
    <header className={styles.header}>
      <nav className={styles.nav}>
        <LogoLink />
        <SettingsLink />
        <StatisticsLink />
      </nav>
    </header>
  </>
  )
}
