import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Todo = {
  data: any;
} | null;

type TodoState = {
  selectedTodo: Todo;
};

const initialState: TodoState = {
  selectedTodo: null,
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setSelectedTodo: (state, action: PayloadAction<string>) => {
      state.selectedTodo = null;
      state.selectedTodo = { data: action.payload };
    },
    clearSelectedTodo: (state) => {
      state.selectedTodo = null;
    },
  },
});

export const { setSelectedTodo, clearSelectedTodo } = todoSlice.actions;
export default todoSlice.reducer;
