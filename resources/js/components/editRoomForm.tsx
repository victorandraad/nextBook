import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
    room_number: z.number().min(1, 'O número do quarto deve ser maior que 0'),
    living_quarters: z.number().min(1, 'O número de pessoas deve ser maior que 0'),
    beds: z.number().min(1, 'O número de camas deve ser maior que 0'),
    balcony: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditRoomFormProps {
    onSuccess?: () => void;
    numero_quarto: number;
    camas: number;
    pessoas: number;
    varanda: boolean;
}

export function EditRoomForm({ onSuccess, numero_quarto, camas, varanda, pessoas }: EditRoomFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            room_number: numero_quarto,
            living_quarters: pessoas,
            beds: camas,
            balcony: varanda || false,
        },
    });

    async function onSubmit(data: FormValues) {
        setIsLoading(true);
        try {
            // console.log('Dados do formulário:', data);
            await axios.put(`/edit-room/${numero_quarto}`, data).then(() => {
                toast({
                    title: 'Sucesso!',
                    description: 'Quarto atualizado com sucesso.',
                });
            }).catch((error) => {
                toast({
                    title: 'Erro!',
                    description: error.response.data.message,
                    variant: 'destructive',
                });
            }); // Atualiza o quarto

            onSuccess?.();
        } catch (error: unknown) {
            const errorMessage = (error as AxiosError<{ message: string }>)?.response?.data?.message || 'Erro ao atualizar quarto';
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
                    name="room_number"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Número do Quarto</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number" 
                                    min="1"
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value === '' ? '' : Number(value));
                                    }}
                                    disabled
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="living_quarters"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Número de Pessoas</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number" 
                                    min="1"
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value === '' ? '' : Number(value));
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="beds"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Número de Camas</FormLabel>
                            <FormControl>
                                <Input 
                                    type="number" 
                                    min="1"
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value === '' ? '' : Number(value));
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="balcony"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Possui Varanda</FormLabel>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Atualizando...' : 'Atualizar Quarto'}
                </Button>
            </form>
        </Form>
    );
}
