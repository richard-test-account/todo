export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
  dueDate?: Date;
}

export type Category = 'To classify' | 'Today' | 'Later';

export interface CategoryGroup {
  name: Category;
  todos: TodoItem[];
}