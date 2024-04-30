import styles from './toggleSwitch.module.css';
import { useDispatch } from 'react-redux';
import React, { useEffect, useRef } from 'react';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

interface IToggleSwitch {
  id: string;
  onClick: any;
  isActive: boolean;
}

export function ToggleSwitch({ id, onClick, isActive }: IToggleSwitch) {
  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (refInput.current) {
      refInput.current.checked = isActive;
    }
  }, [isActive]);

  return (
    <>
      <input
        onClick={onClick}
        className={styles.input}
        ref={refInput}
        type="checkbox"
        id={id}
      />
      <label
        className={styles.label}
        htmlFor={id}
      >
        Toggle
      </label>
    </>
  )
}
