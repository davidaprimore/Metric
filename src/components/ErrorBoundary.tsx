import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-50 text-red-900 overflow-auto">
                    <div className="max-w-xl w-full bg-white p-8 rounded-2xl shadow-xl border border-red-100">
                        <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            🚨 Algo deu errado
                        </h1>
                        <p className="mb-4 text-gray-600">
                            Ocorreu um erro inesperado na aplicação.
                        </p>
                        <div className="bg-red-50 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-red-200">
                            <p className="font-bold text-red-700 mb-2">{this.state.error?.name}: {this.state.error?.message}</p>
                            <div className="text-red-600/70 whitespace-pre-wrap">
                                {this.state.error?.stack}
                            </div>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors w-full"
                        >
                            Recarregar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
