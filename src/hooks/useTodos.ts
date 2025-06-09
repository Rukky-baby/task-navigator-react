
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService, Todo, CreateTodoRequest, UpdateTodoRequest } from '@/services/todoService';
import { useToast } from '@/hooks/use-toast';

export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: todoService.getTodos,
  });
};

export const useTodo = (id: number) => {
  return useQuery({
    queryKey: ['todo', id],
    queryFn: () => todoService.getTodo(id),
    enabled: !!id,
  });
};

export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: todoService.createTodo,
    onSuccess: (newTodo) => {
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] | undefined) => {
        return oldTodos ? [newTodo, ...oldTodos] : [newTodo];
      });
      toast({
        title: "Success",
        description: "Todo created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create todo",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: UpdateTodoRequest }) =>
      todoService.updateTodo(id, updates),
    onSuccess: (updatedTodo) => {
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] | undefined) => {
        return oldTodos?.map(todo => 
          todo.id === updatedTodo.id ? updatedTodo : todo
        );
      });
      queryClient.setQueryData(['todo', updatedTodo.id], updatedTodo);
      toast({
        title: "Success",
        description: "Todo updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: todoService.deleteTodo,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['todos'], (oldTodos: Todo[] | undefined) => {
        return oldTodos?.filter(todo => todo.id !== deletedId);
      });
      toast({
        title: "Success",
        description: "Todo deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    },
  });
};
