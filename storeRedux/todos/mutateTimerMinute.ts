import { IActionSettings, ITimerMinute, ITodoState, ITomato } from "./todosSlice";

export const setTimeSecondsNow = () => Math.round(new Date().getTime() / 1000);

export const setDaysNow = () => Math.floor(new Date().getTime() / 86400000);

export function findCurrentTomato(state: ITodoState, currentTomatoNumber: number) {
  let currentTomato: any;

  state.todos.find(todo => {
    todo.tomatos.find(tomato => {
      if (tomato.tomatoNumber === currentTomatoNumber) {
        currentTomato = tomato
      }
    })
  });

  return currentTomato;
}

export function mutateTimerMinute(state: ITodoState, action: IActionSettings) {
  const { workTime, currentTimer, currentNumberTomato, shortBreak, isBreak } = state.timerMinute;
  const { shortBreakValue, longBreakValue, workTimeValue } = action;
  const currentTomato = findCurrentTomato(state, currentNumberTomato);
  const currentBreak = (currentTomato.breakTime === shortBreak ? shortBreakValue : longBreakValue) * 60;
  const currentBreakTime = currentBreak - (currentTomato.breakTime - currentTimer);
  const currentWorkTime = workTimeValue * 60 - (workTime - currentTimer);

  const timer = isBreak
    ? currentBreakTime
    : currentWorkTime

  return {
    ...state.timerMinute,
    workTime: workTimeValue * 60,
    shortBreak: shortBreakValue * 60,
    longBreak: longBreakValue * 60,
    currentTimer: timer < 0 ? 0 : timer
  }
}

export function updateTimerAfterLogout(timerMinute: ITimerMinute, currentTomato: ITomato) {
  const { workTime, isBreak, worldTimeStarted } = timerMinute
  const workTimeGone = setTimeSecondsNow() - worldTimeStarted;
  const timer = (isBreak ? (currentTomato.breakTime - workTimeGone) : (workTime - workTimeGone));

  return timer < 0 ? 0 : timer;
}
