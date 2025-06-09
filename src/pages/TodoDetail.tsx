
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, CheckCircle2, Circle, User, Calendar, Hash } from 'lucide-react';
import { useTodo, useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
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
import EditTodoDialog from '@/components/EditTodoDialog';

const TodoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const todoId = parseInt(id || '0');
  
  const { data: todo, isLoading, error } = useTodo(todoId);
  const updateTodoMutation = useUpdateTodo();
  const deleteTodoMutation = useDeleteTodo();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleToggleComplete = () => {
    if (todo) {
      updateTodoMutation.mutate({
        id: todo.id,
        updates: { completed: !todo.completed }
      });
    }
  };

  const handleDelete = () => {
    if (todo) {
      deleteTodoMutation.mutate(todo.id, {
        onSuccess: () => {
          navigate('/');
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Skeleton className="h-10 w-32 mb-4" />
              <Skeleton className="h-8 w-64" />
            </div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error || !todo) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <Button asChild variant="outline" className="mb-6">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Todos
              </Link>
            </Button>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Todo Not Found</CardTitle>
                <CardDescription>
                  The todo with ID {id} could not be found or failed to load.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to="/">Return to Todo List</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Navigation */}
            <Button asChild variant="outline" className="mb-6">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Todos
              </Link>
            </Button>

            {/* Main Content */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className={`text-2xl leading-8 ${
                      todo.completed 
                        ? 'line-through text-muted-foreground' 
                        : 'text-foreground'
                    }`}>
                      {todo.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      Todo ID: {todo.id}
                    </CardDescription>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsDeleteDialogOpen(true)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Status Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Status</h3>
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={todo.completed ? 'default' : 'secondary'}
                      className="text-sm"
                    >
                      {todo.completed ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Circle className="mr-2 h-4 w-4" />
                          Pending
                        </>
                      )}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleComplete}
                      disabled={updateTodoMutation.isPending}
                    >
                      {todo.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Details Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Hash className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Todo ID</p>
                        <p className="text-sm text-muted-foreground">{todo.id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">User ID</p>
                        <p className="text-sm text-muted-foreground">{todo.userId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Description Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-foreground leading-relaxed">
                      {todo.title}
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="pt-4">
                  <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleComplete}
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
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Todo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

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
              Are you sure you want to delete "{todo.title}"? This action cannot be undone and you will be redirected to the main todo list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Todo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TodoDetail;
