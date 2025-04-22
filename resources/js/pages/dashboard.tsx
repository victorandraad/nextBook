import { CheckTable } from '@/components/checkTable';
import { CreateRoomForm } from '@/components/CreateRoomForm';
import { EditRoomForm } from '@/components/editRoomForm';
import { PopUp } from '@/components/pop-up';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { BedDouble, Home, Trash, Users, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Painel de Controle',
        href: '/dashboard',
    },
];

type Room = {
    room_number: number;
    living_quarters: number;
    beds: number;
    balcony: boolean;
    created_at: string | null;
    updated_at: string | null;
};
//! As requisicoes estão funcionando!
//TODO: falta a validacao se pode ou nao alugar na data que o usuário quer

export default function Dashboard() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState<number | null>(null);
    const { toast } = useToast();

    const handleSuccess = () => {
        setIsDialogOpen(false);
        // Refresh the rooms list
        axios
            .get<Room[]>('/all-rooms')
            .then((response) => {
                setRooms(response.data);
            })
            .catch((error) => {
                console.error('Erro ao pedir os dados: ', error);
            });
    };

    useEffect(() => {
        axios
            .get<Room[]>('/all-rooms')
            .then((response) => {
                setRooms(response.data);
            })
            .catch((error) => {
                console.error('Erro ao pedir os dados: ', error);
            });
    }, []);

    const handleDeleteRoom = (roomNumber: number) => {
        setRoomToDelete(roomNumber);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!roomToDelete) return;

        axios
            .delete(`/delete-room/${roomToDelete}`)
            .then((response) => {
                console.log('Quarto deletado com sucesso:', response.data);
                setRooms((prevRooms) => prevRooms.filter((room) => room.room_number !== roomToDelete));
                toast({
                    title: 'Sucesso',
                    description: 'Quarto deletado com sucesso',
                });
            })
            .catch((error) => {
                toast({
                    title: 'Erro',
                    description: error.response.data.message,
                    variant: 'destructive',
                });
            })
            .finally(() => {
                setIsDeleteDialogOpen(false);
                setRoomToDelete(null);
            });
    };

    // const handleButtonClick = (room: string) => {
    //     const roomName = room;
    //     const checkInDate = "2025-01-01"; // Aqui você pode pegar a data de check-in do usuário
    //     const checkoOutDate = "2025-01-05"; // Aqui você pode pegar a data de check-out do usuário

    //     console.log({name: roomName,
    //                 check_in_date: checkInDate,
    //                 check_out_date: checkoOutDate,
    //                 room_number: Number(room.replace(/\D/g, ''))
    //             });

    //     axios.post("/book-a-room", {
    //         name: roomName,
    //         check_in_date: checkInDate,
    //         check_out_date: checkoOutDate,
    //         room_number: Number(room.replace(/\D/g, '')),
    //     })
    //     .then(response => console.log("Hellooouuu! ",response.data))
    //     .catch(error => console.log("Erro dos grandes aqui bixo! ", error.response.data));

    //     // Aqui você pode adicionar a lógica para enviar a requisição ao backend
    // };

    //! Valores esteticos, valores precisam ser dinamicos de acordo com oque clicar no front

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Painel de Controle" />
            <div className="flex h-screen flex-1 flex-col gap-4 p-4 bg-slate-800">
                <div className="flex justify-end ">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>Criar Quarto</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Criar Novo Quarto</DialogTitle>
                            </DialogHeader>
                            <CreateRoomForm onSuccess={handleSuccess} />
                        </DialogContent>
                    </Dialog>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
                    {rooms.map((room) => (
                        <Card key={room.room_number} className="hover:shadow-lg transition-shadow bg-slate-950">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="">Quarto {room.room_number}</CardTitle>
                                    <div className="space-x-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant='ghost'><Pencil /></Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                                <DialogHeader>
                                                    <DialogTitle>Editar Quarto</DialogTitle>
                                                </DialogHeader>
                                                <EditRoomForm 
                                                    onSuccess={handleSuccess}
                                                    camas={room.beds}
                                                    numero_quarto={room.room_number}
                                                    varanda={room.balcony}
                                                    pessoas={room.living_quarters}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="ghost" onClick={() => handleDeleteRoom(room.room_number)}>
                                            <Trash />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between ">
                                    <div className="flex items-center gap-2 ">
                                        <Users className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {room.living_quarters} {room.living_quarters === 1 ? 'pessoa' : 'pessoas'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BedDouble className="text-muted-foreground h-5 w-5" />
                                        <span className="text-muted-foreground text-sm">
                                            {room.beds} {room.beds === 1 ? 'cama' : 'camas'}
                                        </span>
                                    </div>
                                </div>
                                {room.balcony ? (
                                    <div className="flex items-center gap-2">
                                        <Home className="text-muted-foreground h-5 w-5" />
                                        <span className="text-muted-foreground text-sm">Com varanda</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Home className="text-muted-foreground h-5 w-5" />
                                        <span className="text-muted-foreground text-sm">Sem varanda</span>
                                    </div>
                                )}
                                <div className="flex w-full justify-end pt-4">
                                    <PopUp
                                        triggerText="Ver Reservas"
                                        roomNumber={room.room_number}
                                        children={<CheckTable room_number={room.room_number} />}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmar Exclusão</DialogTitle>
                            <DialogDescription>
                                Tem certeza que deseja excluir o quarto {roomToDelete}? Esta ação não pode ser desfeita.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete}>
                                Excluir
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
