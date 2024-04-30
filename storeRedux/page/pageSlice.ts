import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IPageSliceState {
  timerSettingsModalIsOpen: Boolean;
  notification: boolean;
  notificationSound: boolean;
  notificationTime: number;
  isReadyTodosHidden: boolean;
  isAnimation: boolean;
  darkMode: boolean;
}

const initialState: IPageSliceState = {
  timerSettingsModalIsOpen: false,
  notification: true,
  notificationSound: true,
  notificationTime: 5,
  isReadyTodosHidden: false,
  isAnimation: true,
  darkMode: false
}

const pageSlice = createSlice({
  name: 'page',
  initialState: initialState,
  reducers: {
    setTimerSettingsModalIsOpen(state, { payload }: PayloadAction<boolean>) {
      state.timerSettingsModalIsOpen = payload;
    },
    toggleNotification(state, { payload }: PayloadAction<boolean>) {
      state.notification = payload;
    },
    toggleSound(state, { payload }: PayloadAction<boolean>) {
      state.notificationSound = payload;
    },
    setNotificationTime(state, { payload }: PayloadAction<number>) {
      state.notificationTime = payload;
    },
    setIsReadyTodosHidden(state, { payload }: PayloadAction<boolean>) {
      state.isReadyTodosHidden = payload;
    },
    setIsAnimation(state, { payload }: PayloadAction<boolean>) {
      state.isAnimation = payload;
    },
    setIsDarkMode(state, { payload }: PayloadAction<boolean>) {
      state.darkMode = payload
    }
  }
});

export default pageSlice.reducer;

export const {
  setTimerSettingsModalIsOpen,
  toggleNotification,
  toggleSound,
  setNotificationTime,
  setIsReadyTodosHidden,
  setIsAnimation,
  setIsDarkMode } = pageSlice.actions;





