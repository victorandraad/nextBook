import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { format } from 'date-fns';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const formSchema = z
    .object({
        name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
        check_in_date: z.string().min(1, 'Data de entrada é obrigatória'),
        check_out_date: z.string().min(1, 'Data de saída é obrigatória'),
        room_number: z.number(),
    })
    .refine(
        (data) => {
            if (data.check_in_date && data.check_out_date) {
                const checkIn = new Date(data.check_in_date);
                const checkOut = new Date(data.check_out_date);
                return checkOut > checkIn;
            }
            return true;
        },
        {
            message: 'Data de saída deve ser posterior à data de entrada',
            path: ['check_out_date'],
        },
    );

type FormValues = z.infer<typeof formSchema>;

export interface EditReservationFormProps {
    roomNumber: number;
    check_in_date: Date;
    check_out_date: Date;
    name: string;
    onSuccess: () => void;
}

export function EditReservationForm({ roomNumber, check_in_date, check_out_date, name, onSuccess }: EditReservationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: name,
            room_number: roomNumber,
            check_in_date: check_in_date.toString().split('T')[0],
            check_out_date: check_out_date.toString().split('T')[0],
        },
    });

    async function onSubmit(data: FormValues) {
        setIsLoading(true);
        try {
            const formattedData = {
                ...data,
                room_number: roomNumber, // Ensure the room number is included
            };
            // console.log('Dados do formulário:', formattedData);
            await axios.put('/update-reservation', formattedData);

            toast({
                title: 'Sucesso!',
                description: 'Reserva atualizada com sucesso.',
            });

            form.reset();
            onSuccess?.();
        } catch (error: any) {
            const errorMessage = error.response?.data?.[0] || 'Erro ao atualizar reserva';
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
                            <FormLabel>nome</FormLabel>
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
                                <Input type="date" min={format(new Date(), 'yyyy-MM-dd')} {...field} />
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
                                <Input type="date" min={form.watch('check_in_date') || format(new Date(), 'yyyy-MM-dd')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Atualizando...' : 'Atualizar Reserva'}
                </Button>
            </form>
        </Form>
    );
}
