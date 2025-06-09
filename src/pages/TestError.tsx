
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TestError = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('This is a test error to demonstrate the Error Boundary functionality!');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Button asChild variant="outline" className="mb-6">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Todos
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-orange-500" />
                <div>
                  <CardTitle>Test Error Boundary</CardTitle>
                  <CardDescription>
                    This page is designed to test the Error Boundary component
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">What is an Error Boundary?</h3>
                <p className="text-sm text-orange-700">
                  Error Boundaries are React components that catch JavaScript errors anywhere in their child 
                  component tree, log those errors, and display a fallback UI instead of the component tree that crashed.
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">Test Instructions:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Click the "Trigger Error" button below</li>
                  <li>Observe how the Error Boundary catches the error</li>
                  <li>See the fallback UI that gets displayed</li>
                  <li>Use the "Try Again" button to recover</li>
                </ol>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => setShouldThrow(true)}
                  variant="destructive"
                  className="w-full"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Trigger Error
                </Button>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  This error is intentional and safe for testing purposes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestError;
