
export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface CreateTodoRequest {
  title: string;
  completed: boolean;
  userId: number;
}

export interface UpdateTodoRequest {
  title?: string;
  completed?: boolean;
  userId?: number;
}

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const todoService = {
  // Fetch all todos
  async getTodos(): Promise<Todo[]> {
    const response = await fetch(`${BASE_URL}/todos`);
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    return response.json();
  },

  // Fetch single todo
  async getTodo(id: number): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/todos/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch todo with id ${id}`);
    }
    return response.json();
  },

  // Create new todo
  async createTodo(todo: CreateTodoRequest): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error('Failed to create todo');
    }
    return response.json();
  },

  // Update todo
  async updateTodo(id: number, updates: UpdateTodoRequest): Promise<Todo> {
    const response = await fetch(`${BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error(`Failed to update todo with id ${id}`);
    }
    return response.json();
  },

  // Delete todo
  async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/todos/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete todo with id ${id}`);
    }
  },
};
