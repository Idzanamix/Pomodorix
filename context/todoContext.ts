import { createContext } from "react";
import { ITodo } from "../components/TodoList/Todo";

export const todoContext = createContext<ITodo>({
  id: '',
  text: '',
  tomatoCount: 0,
  onOpenToChangeTodo: () => { }
});
