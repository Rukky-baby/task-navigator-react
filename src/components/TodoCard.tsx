
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { Todo } from '@/services/todoService';
import { useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import EditTodoDialog from './EditTodoDialog';

interface TodoCardProps {
  todo: Todo;
}

const TodoCard: React.FC<TodoCardProps> = ({ todo }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();

  const handleToggleComplete = async (checked: boolean) => {
    updateTodoMutation.mutate({
      id: todo.id,
      updates: { completed: checked }
    });
  };

  const handleDelete = () => {
    deleteTodoMutation.mutate(todo.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="group hover:shadow-md transition-shadow duration-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            {/* Completion Status */}
            <div className="flex items-center pt-0.5">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={handleToggleComplete}
                disabled={updateTodoMutation.isPending}
                aria-label={`Mark todo "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
              />
            </div>

            {/* Todo Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-medium leading-6 ${
                    todo.completed 
                      ? 'line-through text-muted-foreground' 
                      : 'text-foreground'
                  }`}>
                    {todo.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant={todo.completed ? 'default' : 'secondary'}>
                      {todo.completed ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Circle className="mr-1 h-3 w-3" />
                          Pending
                        </>
                      )}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ID: {todo.id} • User: {todo.userId}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="h-8">
                    <Link to={`/todos/${todo.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View todo details</span>
                    </Link>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleComplete(!todo.completed)}
                        disabled={updateTodoMutation.isPending}
                      >
                        {todo.completed ? (
                          <>
                            <Circle className="mr-2 h-4 w-4" />
                            Mark Incomplete
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark Complete
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditTodoDialog
        todo={todo}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{todo.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TodoCard;
