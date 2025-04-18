import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ErrorAlert } from '@/components/ErrorAlert';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';

const formSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    check_in_date: z.string().min(1, 'Data de entrada é obrigatória'),
    check_out_date: z.string().min(1, 'Data de saída é obrigatória'),
    room_number: z.number(),
}).refine((data) => {
    if (data.check_in_date && data.check_out_date) {
        const checkIn = new Date(data.check_in_date);
        const checkOut = new Date(data.check_out_date);
        return checkOut > checkIn;
    }
    return true;
}, {
    message: "Data de saída deve ser posterior à data de entrada",
    path: ["check_out_date"],
});

type FormValues = z.infer<typeof formSchema>;

interface CreateReservationFormProps {
    roomNumber: number;
    onSuccess?: () => void;
}

export function CreateReservationForm({ roomNumber, onSuccess }: CreateReservationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            room_number: roomNumber,
            check_in_date: '',
            check_out_date: '',
        },
    });

    async function onSubmit(data: FormValues) {
        setIsLoading(true);
        try {
            const formattedData = {
                ...data,
                check_in_date: data.check_in_date,
                check_out_date: data.check_out_date,
            };

            await axios.post('/book-a-room', formattedData);

            toast({
                title: 'Sucesso!',
                description: 'Reserva criada com sucesso.',
            });

            form.reset();
            onSuccess?.();
        } catch (error: any) {
            setErrorMessage(error.response?.data?.[0] || 'Erro ao criar reserva');
            toast({
                title: 'Erro',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome do cliente" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="check_in_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data de Entrada</FormLabel>
                            <FormControl>
                                <Input 
                                    type="date" 
                                    min={format(new Date(), 'yyyy-MM-dd')}
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="check_out_date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data de Saída</FormLabel>
                            <FormControl>
                                <Input 
                                    type="date" 
                                    min={form.watch('check_in_date') || format(new Date(), 'yyyy-MM-dd')}
                                    {...field} 
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Criando...' : 'Criar Reserva'}
                </Button>
            </form>
            {errorMessage && <ErrorAlert message={errorMessage} />}
        </Form>
    );
} 