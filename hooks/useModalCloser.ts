import { RefObject, useEffect } from "react";

interface IUseModalCloser {
  onClose: () => void;
  ref?: RefObject<refType>;
  ref2?: RefObject<refType>;
  timeDelay?: number;
  noTouch?: boolean;
}

type refType = HTMLDivElement | HTMLUListElement | HTMLButtonElement | HTMLSpanElement;

export function useModalCloser({ onClose, ref, ref2, timeDelay, noTouch }: IUseModalCloser) {

  useEffect(() => {
    let isUnmount = false;

    function handleClick(event: any) {
      if (!isUnmount &&
        event.target instanceof Node &&
        !ref?.current?.contains(event.target) &&
        !ref2?.current?.contains(event.target)) {

        setTimeout(() => {
          onClose?.();

        }, timeDelay);

      }
    }

    document.addEventListener('click', handleClick);
    !noTouch && document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      !noTouch && document.removeEventListener('touchstart', handleClick);
      isUnmount = true;
    }

  }, [onClose, ref, ref2, timeDelay, noTouch]);
}

