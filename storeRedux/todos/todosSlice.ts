import { recalculation } from "./recalculation";
import { calculateTimeIsLeft } from "./calculateTimeIsLeft";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { generateRandomString } from "../../utils/generateRandomIndex";
import { mutateTimerMinute, setDaysNow, setTimeSecondsNow } from "./mutateTimerMinute";

export interface ITomato {
  tomatoNumber: number;
  workTime: number;
  breakTime: number;
}

export interface ITodosState {
  id: string;
  tomatoCount: number;
  text: string;
  currentSumTomatoCount: number
  sumWorkTime: number;
  sumBreakTime: number;
  isFinished: boolean;
  tomatos: ITomato[];
}

export interface IStatistics {
  [k: number]: {
    weekDay: number;
    sumPauseTime: number;
    sumWorkTime: number;
    sumTomatoCount: number;
    stops: number;
    lastTimer: number;
  }
}

export interface ITimerMinute {
  workTime: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  sumTime: number;
  currentNumberTomato: number;
  isBreak: boolean;
  currentTimer: number;
  isPause: boolean;
  isStarted: boolean;
  worldTimeStarted: number;
  isOpenManual: boolean;
  wotldTimePauseStarted: number;
  currentWeek: number;
  currentWeekDay: number;
  statistics: any;
  logs: IStatistics;
  addedMinutesCount: number;
}

export interface ITodoState {
  timerMinute: ITimerMinute;
  todos: ITodosState[];
}

interface IRedactAction {
  id: string,
  text: string
}

const initialState: ITodoState = {
  timerMinute: {
    workTime: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
    longBreakInterval: 4,
    sumTime: 0,
    worldTimeStarted: 0,
    currentNumberTomato: 1,
    currentTimer: 0,
    isBreak: false,
    isPause: false,
    isStarted: false,
    isOpenManual: true,
    wotldTimePauseStarted: 0,
    currentWeek: 1,
    currentWeekDay: 1,
    statistics: [],
    logs: [],
    addedMinutesCount: 0
  },
  todos: [],
}

export interface IActionSettings {
  workTimeValue: number;
  shortBreakValue: number;
  longBreakValue: number;
}

export function resetInitialState(state: ITodoState) {
  const { sumTime,
    isBreak,
    isPause,
    isStarted,
    worldTimeStarted,
    wotldTimePauseStarted,
    addedMinutesCount } = initialState.timerMinute;
  state.timerMinute.sumTime = sumTime;
  state.timerMinute.isBreak = isBreak;
  state.timerMinute.isPause = isPause;
  state.timerMinute.isStarted = isStarted;
  state.timerMinute.worldTimeStarted = worldTimeStarted;
  state.timerMinute.wotldTimePauseStarted = wotldTimePauseStarted;
  state.timerMinute.addedMinutesCount = addedMinutesCount;
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const todos = [
        ...state.todos,
        {
          id: generateRandomString(),
          tomatoCount: 1,
          text: action.payload,
          currentSumTomatoCount: 0,
          sumWorkTime: 0,
          sumBreakTime: 0,
          isFinished: false,
          tomatos: []
        }
      ]

      return recalculation(todos, state.timerMinute);
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      const filteredTodos = state.todos.filter((todo) => todo.id !== action.payload);

      return recalculation(filteredTodos, state.timerMinute);
    },
    redactTodo: (state, action: PayloadAction<IRedactAction>) => {
      const redacedByIdTodo = state.todos.map((todo) => {
        return {
          ...todo,
          text: todo.id === action.payload.id ? action.payload.text : todo.text
        }
      });

      return {
        ...state,
        todos: redacedByIdTodo
      };
    },
    changeTomatoCount: (state, action: PayloadAction<IRedactAction>) => {
      const redacedByIdTodos = state.todos.map((todo) => {
        const reduсeCount = todo.tomatoCount - 1;
        const increaseСount = todo.tomatoCount + 1;
        const toChangeTomatoCount = action.payload.text === "+" ? increaseСount : reduсeCount;
        const tomatoCount = todo.id === action.payload.id ? toChangeTomatoCount : todo.tomatoCount;

        return {
          ...todo,
          tomatoCount: tomatoCount
        }
      });

      return recalculation(redacedByIdTodos, state.timerMinute);
    },
    timeStepSecond: ({ timerMinute }) => {
      --timerMinute.currentTimer;
    },
    setIsBreak(state, action: PayloadAction<boolean>) {
      state.timerMinute.isBreak = action.payload;
    },
    setTimer(state, action: PayloadAction<number>) {
      state.timerMinute.currentTimer = action.payload;
    },
    setCurrentTomatoNumber({ timerMinute }) {
      ++timerMinute.currentNumberTomato;
    },
    resetCurrentTomatoNumber({ timerMinute }) {
      timerMinute.currentNumberTomato = 1;
    },
    addCurrentTomatoNumber(state) {
      const filteredIsFinishedTodos = state.todos.filter(todo => todo.isFinished);
      const LastItemTomatos = filteredIsFinishedTodos[filteredIsFinishedTodos.length - 1]?.tomatos;
      const LastTomatoNumber = LastItemTomatos?.[LastItemTomatos?.length - 1]?.tomatoNumber || 0;
      state.timerMinute.currentNumberTomato = LastTomatoNumber + 1;
    },
    setIsFinished(state, action: PayloadAction<string>) {
      const mapedTodos = state.todos.map(todo => {
        return {
          ...todo,
          isFinished: todo.id === action.payload ? true : todo.isFinished
        }
      });

      return {
        ...state,
        todos: mapedTodos
      }
    },
    setIsPause({ timerMinute }, action: PayloadAction<boolean>) {
      timerMinute.isPause = action.payload
    },
    setIsStarted({ timerMinute }, action: PayloadAction<boolean>) {
      timerMinute.isStarted = action.payload;
      timerMinute.worldTimeStarted = action.payload ? setTimeSecondsNow() : NaN;
    },
    setDefaultSettings(state, action: PayloadAction<IActionSettings>) {
      return recalculation(state.todos, mutateTimerMinute(state, action.payload));
    },
    resetDefaultSettings(state) {
      const { workTime, longBreak, shortBreak } = initialState.timerMinute;
      const initialTimerSettings = {
        workTimeValue: workTime / 60,
        longBreakValue: longBreak / 60,
        shortBreakValue: shortBreak / 60
      }

      return recalculation(state.todos, mutateTimerMinute(state, initialTimerSettings));
    },
    setIsOpenManual({ timerMinute }, action: PayloadAction<boolean>) {
      timerMinute.isOpenManual = action.payload
    },
    resetSumTime({ todos, timerMinute }) {
      timerMinute.sumTime = calculateTimeIsLeft(todos, timerMinute);
    },
    setWorldTimePauseStarted({ timerMinute }) {
      timerMinute.wotldTimePauseStarted = setTimeSecondsNow();
    },
    returnTimeAfterPause({ timerMinute }) {
      const { wotldTimePauseStarted } = timerMinute;
      const pauseTimeReturned = wotldTimePauseStarted !== 0 ? setTimeSecondsNow() - wotldTimePauseStarted : 0;

      timerMinute.worldTimeStarted = timerMinute.worldTimeStarted + pauseTimeReturned;
    },
    clearAllTodos(state) {
      resetInitialState(state);
      state.timerMinute.currentTimer = initialState.timerMinute.currentTimer;
      state.timerMinute.currentNumberTomato = initialState.timerMinute.currentNumberTomato;
      state.todos = initialState.todos;
    },
    deleteAllIsFinishedTodos(state) {
      const { currentNumberTomato } = state.timerMinute;

      const currentTodo = state.todos
        .find(todo => todo.tomatos
          .find(tomato => tomato.tomatoNumber === currentNumberTomato));
      const firstNumberTomato = currentTodo?.tomatos[0].tomatoNumber || 1;
      const changedTomatoNumber = currentNumberTomato - (firstNumberTomato - 1);
      const filteredIsFinishedTodos = state.todos.filter(todo => todo.isFinished);
      const isLastFinishedTodo = filteredIsFinishedTodos[filteredIsFinishedTodos.length - 1];

      const isNotFinishedTodos = state.todos.filter(todo => !todo.isFinished);
      const addIsBreakByFinishedTodos = isLastFinishedTodo?.id === currentTodo?.id
        ? [currentTodo, ...isNotFinishedTodos]
        : isNotFinishedTodos

      return recalculation(addIsBreakByFinishedTodos,
        {
          ...state.timerMinute,
          currentNumberTomato: changedTomatoNumber,
        }
      );
    },
    setStatistics({ timerMinute }) {
      const weekDayNow = new Date().getDay();
      const lastDayOfTheWeek = setDaysNow() + (7 - weekDayNow);
      const lastDay = lastDayOfTheWeek - 20;
      const logs = timerMinute?.logs
      const length = 21;
      let dayNow = lastDayOfTheWeek;
      let weekDay = 1;

      const statistics = [...new Array(length)].map(() => {
        const currentDay = dayNow--;
        weekDay === 0 ? weekDay = 6 : weekDay--;

        return {
          [currentDay]:
            (logs?.[currentDay] || {
              weekDay: weekDay,
              sumPauseTime: 0,
              sumWorkTime: 0,
              sumTomatoCount: 0,
              stops: 0,
              lastTimer: 0,
            })
        }
      });

      const clearedLogs = Object.keys(logs)
        .filter(obj => Number(obj) >= lastDay)
        .reduce((newObj: any, key: any) => {
          newObj[key] = logs[key];

          return newObj;
        }, {});

      timerMinute.statistics = statistics;
      timerMinute.logs = clearedLogs;
    },
    setPauseLogs({ timerMinute }) {
      const dayNow = setDaysNow();

      const { wotldTimePauseStarted } = timerMinute;
      const pauseTimeReturned = wotldTimePauseStarted !== 0 ? setTimeSecondsNow() - wotldTimePauseStarted : 0;

      const currentLog: IStatistics = {
        ...timerMinute.logs,
        [dayNow]: {
          ...timerMinute.logs?.[dayNow],
          sumPauseTime: (timerMinute.logs?.[dayNow]?.sumPauseTime || 0) + pauseTimeReturned || 0,
        }
      }

      timerMinute.logs = currentLog;
    },
    setStopLogs({ timerMinute }) {
      const dayNow = setDaysNow();

      const currentLog: IStatistics = {
        ...timerMinute.logs,
        [dayNow]: {
          ...timerMinute.logs?.[dayNow],
          stops: (timerMinute.logs?.[dayNow]?.stops || 0) + 1 || 0
        }
      }

      timerMinute.logs = currentLog;
    },
    setWorkLogs({ timerMinute }) {
      const weekDayNow = new Date().getDay();
      const dayNow = setDaysNow();
      const { currentTimer, isStarted, isBreak, isPause } = timerMinute
      const lastTimer = timerMinute.logs?.[dayNow]?.lastTimer;
      const timeReturned = isStarted && !isBreak && !isPause && lastTimer
        ? lastTimer - currentTimer : 0;

      const currentLog: IStatistics = {
        ...timerMinute.logs,
        [dayNow]: {
          ...timerMinute.logs?.[dayNow],
          weekDay: timerMinute.logs?.[dayNow]?.weekDay || weekDayNow,
          sumWorkTime: (timerMinute.logs?.[dayNow]?.sumWorkTime || 0) + timeReturned,
          lastTimer: currentTimer
        }
      }

      timerMinute.logs = currentLog;
    },
    setTomatoLogs({ timerMinute }) {
      const dayNow = setDaysNow();

      const currentLog: IStatistics = {
        ...timerMinute.logs,
        [dayNow]: {
          ...timerMinute.logs?.[dayNow],
          sumTomatoCount: (timerMinute.logs?.[dayNow]?.sumTomatoCount || 0) + 1,
        }
      }

      timerMinute.logs = currentLog;
    },
    setCurrentWeek({ timerMinute }, action: PayloadAction<number>) {
      timerMinute.currentWeek = action.payload;
    },
    setWeekDay({ timerMinute }, action: PayloadAction<number>) {
      timerMinute.currentWeekDay = action.payload;
    },
    setOneMinutePlus({ timerMinute }) {
      timerMinute.worldTimeStarted = timerMinute.worldTimeStarted + 60;
      timerMinute.currentTimer = timerMinute.currentTimer + 60;
      timerMinute.addedMinutesCount = timerMinute.addedMinutesCount + 1;
    },
    resetOneMinutePlus({ timerMinute }) {
      timerMinute.addedMinutesCount = initialState.timerMinute.addedMinutesCount;
    }
  }
});

export default todosSlice.reducer;

export const {
  addTodo,
  removeTodo,
  redactTodo,
  changeTomatoCount,
  timeStepSecond,
  setIsBreak,
  setTimer,
  setCurrentTomatoNumber,
  setIsFinished,
  resetCurrentTomatoNumber,
  addCurrentTomatoNumber,
  setIsPause,
  setIsStarted,
  setDefaultSettings,
  resetDefaultSettings,
  setIsOpenManual,
  resetSumTime,
  setWorldTimePauseStarted,
  returnTimeAfterPause,
  clearAllTodos,
  deleteAllIsFinishedTodos,
  setStatistics,
  setPauseLogs,
  setStopLogs,
  setWorkLogs,
  setTomatoLogs,
  setCurrentWeek,
  setWeekDay,
  setOneMinutePlus,
  resetOneMinutePlus } = todosSlice.actions;

