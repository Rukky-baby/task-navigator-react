
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, CheckCircle2, Circle, Clock } from 'lucide-react';
import { useTodos } from '@/hooks/useTodos';
import { Todo } from '@/services/todoService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TodoCard from '@/components/TodoCard';
import CreateTodoDialog from '@/components/CreateTodoDialog';
import Pagination from '@/components/Pagination';

const Index = () => {
  const { data: todos, isLoading, error } = useTodos();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const itemsPerPage = 10;

  const filteredTodos = useMemo(() => {
    if (!todos) return [];
    
    return todos.filter((todo: Todo) => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filter === 'all' || 
        (filter === 'completed' && todo.completed) ||
        (filter === 'incomplete' && !todo.completed);
      
      return matchesSearch && matchesFilter;
    });
  }, [todos, searchTerm, filter]);

  const paginatedTodos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredTodos.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredTodos, currentPage]);

  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const completedCount = todos?.filter(todo => todo.completed).length || 0;
  const totalCount = todos?.length || 0;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Error Loading Todos</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : 'Failed to load todos'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Todo Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Manage your tasks efficiently and stay organized
              </p>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="self-start md:self-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Todo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Circle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-2xl font-bold">{totalCount}</p>
                    <p className="text-xs text-muted-foreground">Total Tasks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{completedCount}</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalCount - completedCount}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search todos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={(value: any) => {
            setFilter(value);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="incomplete">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedTodos.length} of {filteredTodos.length} todos
          </p>
          {filteredTodos.length > 0 && (
            <Badge variant="outline">
              Page {currentPage} of {totalPages}
            </Badge>
          )}
        </div>

        {/* Todo List */}
        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTodos.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="py-8">
                <Circle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No todos found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Get started by creating your first todo'
                  }
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Todo
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paginatedTodos.map((todo: Todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Create Todo Dialog */}
        <CreateTodoDialog 
          open={isCreateDialogOpen} 
          onOpenChange={setIsCreateDialogOpen}
        />

        {/* Test Error Link */}
        <div className="mt-8 text-center">
          <Link 
            to="/test-error" 
            className="text-sm text-muted-foreground hover:text-foreground underline"
          >
            Test Error Boundary
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
