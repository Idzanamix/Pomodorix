'use client'
import { Dropdown } from './Dropdown';
import { IconBreak, IconCheck, IconMenu } from '@/app/icons';
import React, { forwardRef, useRef } from 'react';
import styles from './menuDropdown.module.css'
import { setStopScroll } from '../../utils/setStopScroll';
import { useCoords } from '../../hooks/useCoords';
import { modalRoot } from '../../utils/modalRoot';
import { createPortal } from 'react-dom';
import { useCustomMatchMedia } from '../../hooks/useCustomMatchMedia';

interface IMenuDropdown {
  isFinished: boolean;
  isBreak: boolean;
  isCurrent: boolean;
  isOpen: boolean;
  onOpen: (isOpen: boolean) => void;
}

export const MenuDropdown = forwardRef(
  function MenuDropdown({ isFinished, isBreak, isCurrent, isOpen, onOpen }: IMenuDropdown, ref: any) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { mobile } = useCustomMatchMedia();
    const [coords] = useCoords(ref, isOpen);
    const root = modalRoot(true);

    function handleClose() {
      setStopScroll(false);
      onOpen(false);
    }

    function handleOpen() {
      onOpen(true);
      mobile && setStopScroll(true);
    }

    return (
      <>
        {isFinished && isBreak && isCurrent ?
          <IconBreak />
          :
          isFinished && !isCurrent
            ?
            <IconCheck />
            :
            <button
              className={styles.button}
              disabled={isFinished && isBreak ? true : false}
              onClick={handleOpen}
              ref={buttonRef}
            >
              <IconMenu />
            </button>}

        {isOpen && root && createPortal(
          <Dropdown
            onClose={handleClose}
            isCurrent={isCurrent}
            coords={coords}
          />, root)
        }
      </>
    )
  });
