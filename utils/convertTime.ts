export function toHoursAndMinutes(totalMinutes: number) {
  const minutes = Math.floor(totalMinutes) % 60;
  const hours = Math.floor(totalMinutes / 60);

  return `${hours > 0 ? hours + ' час' : ''} ${minutes > 0 ? ` ${minutes} мин` : ''}`;
}
