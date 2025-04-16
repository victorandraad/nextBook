import { CheckTable } from '@/components/checkTable';
import { PopUp } from '@/components/pop-up';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateRoomForm } from '@/components/CreateRoomForm';
import { BedDouble, Users, Home } from 'lucide-react';

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
            <div className="flex h-screen flex-1 flex-col gap-4 p-4">
                <div className="flex justify-end">
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {rooms.map((room) => (
                        <Card key={room.room_number} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-center">Quarto {room.room_number}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {room.living_quarters} {room.living_quarters === 1 ? 'pessoa' : 'pessoas'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BedDouble className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">
                                            {room.beds} {room.beds === 1 ? 'cama' : 'camas'}
                                        </span>
                                    </div>
                                </div>
                                {room.balcony ? (
                                    <div className="flex items-center gap-2">
                                        <Home className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Com varanda</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Home className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Sem varanda</span>
                                    </div>
                                )}
                                <div className="pt-4">
                                    <PopUp
                                        triggerText="Ver Reservas"
                                        roomNumber={room.room_number}
                                        children={
                                            <CheckTable
                                                room_number={room.room_number}
                                            />
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
