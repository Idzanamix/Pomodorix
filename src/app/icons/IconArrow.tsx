import React from "react";

interface IIconArrow {
  isOpen: boolean;
}

export function IconArrow({ isOpen }: IIconArrow) {
  return (
    <svg
      style={{
        transform: isOpen
          ? 'rotate3d(1, 0, 0, 0)'
          : 'rotate3d(1, 0, 0, 180deg)'
      }}
      width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 9L8 2L15 9" stroke="var(--red)" strokeWidth="2" />
    </svg>
  )
}
