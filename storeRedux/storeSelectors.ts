import { rootStateType } from "./storeRedux";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { findCurrentTomato } from "./todos/mutateTimerMinute";
import { IStatistics } from "./todos/todosSlice";

export const useAppSelector: TypedUseSelectorHook<rootStateType> = useSelector;

export const selectFormValue = ({ form }: rootStateType) => form.formValue;

export const selectTodos = ({ todos }: rootStateType) => todos.todos;

export const selectTimer = ({ todos }: rootStateType) => todos.timerMinute;

export const selectCurrentTodo = (tomatoNumber: number) => ({ todos }: rootStateType) =>
  todos.todos.find(todo => todo.tomatos.find(tomato => tomato.tomatoNumber === tomatoNumber))

export const selectIndex = (id: string) => ({ todos }: rootStateType) =>
  todos.todos.findIndex(todo => todo.id === id);

export const selectCurrentTomato = (tomatoNumber: number) => (state: rootStateType) => {
  return findCurrentTomato(state.todos, tomatoNumber)
}

export const selectCurrentTimer = (({ todos }: rootStateType) => todos.timerMinute.currentTimer);

export const selectIsNotFinishedTodo = (({ todos }: rootStateType) => todos.todos.find(todo => !todo.isFinished));

export const selectTodoById = (id: string) => (({ todos }: rootStateType) => todos.todos.find(todo => todo.id === id));

export const selectIsPause = (({ todos }: rootStateType) => todos.timerMinute.isPause);

export const selectIsStarted = (({ todos }: rootStateType) => todos.timerMinute.isStarted);

export const selectIsOpenManual = (({ todos }: rootStateType) => todos.timerMinute.isOpenManual);

export const selectIsOpenTimerSettingsModal = (({ page }: rootStateType) => page.timerSettingsModalIsOpen);

export const selectNotifications = (({ page }: rootStateType) => page.notification);

export const selectSound = (({ page }: rootStateType) => page.notificationSound);

export const selectNotificationTime = (({ page }: rootStateType) => page.notificationTime);

export const selectIsReadyTodosHidden = (({ page }: rootStateType) => page.isReadyTodosHidden);

export const selectIsAnimation = (({ page }: rootStateType) => page.isAnimation);

export const selectIsDarkMode = (({ page }: rootStateType) => page.darkMode);

export const findWeek = (weekNumber: number, statistics: IStatistics[]) => {
  switch (weekNumber) {
    case 1: return statistics.slice(0, 7).reverse();
    case 2: return statistics.slice(-14, -7).reverse();
    case 3: return statistics.slice(-7).reverse();
  }
}

export const selectStatistics = (({ todos: { timerMinute: { statistics } } }: rootStateType) => statistics);

export const selectWeek = (({ todos: { timerMinute: { currentWeek } } }: rootStateType) => currentWeek);

export const selectWeekDay = (({ todos: { timerMinute: { currentWeekDay } } }: rootStateType) => currentWeekDay);





