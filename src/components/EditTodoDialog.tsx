
import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { Todo } from '@/services/todoService';
import { useUpdateTodo } from '@/hooks/useTodos';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface EditTodoDialogProps {
  todo: Todo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditTodoDialog: React.FC<EditTodoDialogProps> = ({
  todo,
  open,
  onOpenChange,
}) => {
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState(todo.completed);
  const [userId, setUserId] = useState(todo.userId);
  
  const updateTodoMutation = useUpdateTodo();

  // Update form when todo changes
  useEffect(() => {
    setTitle(todo.title);
    setCompleted(todo.completed);
    setUserId(todo.userId);
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    try {
      await updateTodoMutation.mutateAsync({
        id: todo.id,
        updates: {
          title: title.trim(),
          completed,
          userId,
        },
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form to original values when closing
      setTitle(todo.title);
      setCompleted(todo.completed);
      setUserId(todo.userId);
    }
    onOpenChange(newOpen);
  };

  const hasChanges = 
    title !== todo.title || 
    completed !== todo.completed || 
    userId !== todo.userId;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>
            Update the details for this todo item.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              placeholder="Enter todo title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-userId">User ID</Label>
            <Input
              id="edit-userId"
              type="number"
              min="1"
              value={userId}
              onChange={(e) => setUserId(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-completed"
              checked={completed}
              onCheckedChange={setCompleted}
            />
            <Label htmlFor="edit-completed">Mark as completed</Label>
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!title.trim() || !hasChanges || updateTodoMutation.isPending}
            >
              {updateTodoMutation.isPending ? (
                'Updating...'
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Update Todo
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTodoDialog;
