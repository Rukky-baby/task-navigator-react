
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCreateTodo } from '@/hooks/useTodos';
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

interface CreateTodoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateTodoDialog: React.FC<CreateTodoDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [title, setTitle] = useState('');
  const [completed, setCompleted] = useState(false);
  const [userId, setUserId] = useState(1);
  
  const createTodoMutation = useCreateTodo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    try {
      await createTodoMutation.mutateAsync({
        title: title.trim(),
        completed,
        userId,
      });
      
      // Reset form and close dialog
      setTitle('');
      setCompleted(false);
      setUserId(1);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setTitle('');
      setCompleted(false);
      setUserId(1);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Todo</DialogTitle>
          <DialogDescription>
            Add a new task to your todo list. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter todo title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input
              id="userId"
              type="number"
              min="1"
              value={userId}
              onChange={(e) => setUserId(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="completed"
              checked={completed}
              onCheckedChange={setCompleted}
            />
            <Label htmlFor="completed">Mark as completed</Label>
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
              disabled={!title.trim() || createTodoMutation.isPending}
            >
              {createTodoMutation.isPending ? (
                'Creating...'
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Todo
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTodoDialog;
