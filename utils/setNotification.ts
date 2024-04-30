export function setNotification(
  notificationTime: number,
  text?: string,
  noNotification?: boolean,
  noSound?: boolean,
) {
  let notification: Notification;
  const audio = new Audio('/notification.mp3');

  if (noNotification) {
    try {
      notification = new Notification(`${text}`, {
        badge: '/tomatoLogo.png',
        icon: '/tomatoLogo.png',
        tag: 'time is gone',
      });
    } catch (e: any) {
      if (e.name == 'TypeError')
        return false;
    }

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState == "hidden") {
        audio.muted = true;
      }
    })

    noSound && audio.play();

    setInterval(() => notification.close(), notificationTime * 1000);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== "hidden") {
      notification.close()
      audio.muted = false;
    }
  })
};
