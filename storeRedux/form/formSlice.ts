import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IFormState {
  formValue: string;
}

const initialState: IFormState = {
  formValue: ''
}

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    changeFormValue: (state, action: PayloadAction<string>) => {
      return {
        ...state,
        formValue: action.payload
      }
    },
    resetFormValue: () => {
      return initialState
    }
  }
});

export default formSlice.reducer;

export const { changeFormValue, resetFormValue } = formSlice.actions;

