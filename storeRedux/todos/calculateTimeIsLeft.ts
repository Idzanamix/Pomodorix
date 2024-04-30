import { setTimeSecondsNow } from "./mutateTimerMinute";
import { ITodosState, ITimerMinute } from "./todosSlice";

export const calculateTimeIsLeft = (todos: ITodosState[], timerMinute: ITimerMinute) => {
  const { isBreak, worldTimeStarted } = timerMinute;
  const timeNow = setTimeSecondsNow();
  const timeIsGone = worldTimeStarted ? timeNow - worldTimeStarted : 0;
  const isFinishedTodos = todos.filter(todo => todo.isFinished);
  const isLastFinishedTodo = isFinishedTodos[isFinishedTodos.length - 1];
  const isLastFinishedTomato = isLastFinishedTodo?.tomatos[isLastFinishedTodo.tomatos.length - 1];
  const breakTime = isBreak ? (isLastFinishedTomato?.breakTime || 0) : 0;
  const sumTime = todos.filter(todo => !todo.isFinished)
    .reduce((sum, { sumWorkTime, sumBreakTime }) => sum + (sumWorkTime + sumBreakTime), 0) + breakTime;

  return sumTime - timeIsGone
}
