import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught runtime error caught by boundary:", error, errorInfo); 
    }

    public handleReload = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-4">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                <p className="text-sm text-muted-foreground max-w-sm mb-6">
                    An unexpected error occurred in the application layer layout. The action interface crashed safely.
                </p>
                {this.state.error && (
                    <pre className="text-xs bg-red-50 text-red-700 p-3 rounded-md max-w-lg overflow-auto font-mono mb-6 border border-red-100">
                    {this.state.error.message}
                    </pre>
                )}
                <Button onClick={this.handleReload} variant="default">
                    Reload Interface
                </Button>
                </div>
            );
        }
        return this.props.children;
    }
}