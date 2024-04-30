'use client'
import React, { useRef, useState } from 'react';
import styles from './settingsLink.module.css'
import { IconSettings } from '@/app/icons';
import { modalRoot } from '../../../utils/modalRoot';
import { SettingsDropdown } from './SettingsDropdown';
import { createPortal } from 'react-dom';
import { useCoords } from '../../../hooks/useCoords';
import { useUnmount } from '../../../hooks/useUnmount';
import { setStopScroll } from '../../../utils/setStopScroll';
import { useCustomMatchMedia } from '../../../hooks/useCustomMatchMedia';

export function SettingsLink() {
  const [mounted] = useUnmount();
  const root = modalRoot(mounted);
  const { mobile } = useCustomMatchMedia();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [coords] = useCoords(buttonRef, isOpen);

  function handleClick() {
    setIsOpen(!isOpen)
    mobile && setStopScroll(true);
  }

  function handleClose() {
    setIsOpen(false);
    setStopScroll(false);
  }

  return mounted && (
    <>
      <button
        className={styles.button}
        onClick={handleClick}
        ref={buttonRef}
      >
        <IconSettings />
        Настройки
      </button>

      {isOpen && root && createPortal(
        <SettingsDropdown
          coords={coords}
          onClose={handleClose}
        />, root)}
    </>
  )
}
