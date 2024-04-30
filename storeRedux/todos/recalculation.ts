import { calculateTimeIsLeft } from "./calculateTimeIsLeft";
import { ITodosState, ITimerMinute } from "./todosSlice";

export function recalculation(todos: ITodosState[], timerMinute: ITimerMinute) {
  const { shortBreak, workTime, longBreak, longBreakInterval } = timerMinute;
  let currentSumTomatoCount = 0;

  const mapedTodos = todos.map((todo, index) => {
    const todoTomatoCount = todos.length - 1 === index ? todo.tomatoCount - 1 : todo.tomatoCount;
    const prevSummTomatoCount = currentSumTomatoCount;
    currentSumTomatoCount = currentSumTomatoCount + todo.tomatoCount;

    const isBreak = (currentSumTomatoCount: number) =>
      Number.isInteger((currentSumTomatoCount || 1) / longBreakInterval) ? longBreak : shortBreak;

    const sumBreakTime = (tomatoCount: number, prevSummTomatoCount: number) => {
      let time = 0;

      for (let i = 1; i <= tomatoCount; i++) {
        const count = prevSummTomatoCount + i;
        time = time + isBreak(count);
      }

      return time;
    }

    const tomatos = (tomatoCount: number, prevSummTomatoCount: number) => {
      let tomatos = [];

      for (let i = 1; i <= tomatoCount; i++) {
        const currentCount = prevSummTomatoCount + i;
        const lastTomatoNumber = prevSummTomatoCount + tomatoCount

        tomatos.push({
          tomatoNumber: currentCount,
          workTime: timerMinute.workTime,
          breakTime: todos.length - 1 === index
            ? currentCount === lastTomatoNumber
              ? 0
              : isBreak(currentCount)
            : isBreak(currentCount)
        })
      }
      
      return tomatos;
    }

    return {
      ...todo,
      currentSumTomatoCount: currentSumTomatoCount,
      sumWorkTime: workTime * todo.tomatoCount,
      sumBreakTime: sumBreakTime(todoTomatoCount, prevSummTomatoCount),
      tomatos: tomatos(todo.tomatoCount, prevSummTomatoCount)
    }
  });

  return {
    timerMinute: {
      ...timerMinute,
      sumTime: calculateTimeIsLeft(mapedTodos, timerMinute),
    },
    todos: mapedTodos
  }
};
