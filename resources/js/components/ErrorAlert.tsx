import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type ErrorAlertProps = {
    message: string;
    onClose?: () => void;
};


export function ErrorAlert({ message }: ErrorAlertProps) {
    if (!message) return null;

    if (message === 'reserved') {
        message = 'Quarto já reservado para as datas selecionadas.';
    }

    return (
        <div className="w-full right-0 bottom-6 z-[9999] max-w-sm">
            <Alert variant="destructive" className="border border-red-500 shadow-lg">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-red-700">Erro</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        </div>
    );
}
