import { CheckTable } from '@/components/checkTable';
import { PopUp } from '@/components/pop-up';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Painel de Controle',
        href: '/dashboard',
    },
];

type Room = {
    room_number: number;
    // Add other properties of Room if needed
};
//! As requisicoes estão funcionando!
//TODO: falta a validacao se pode ou nao alugar na data que o usuário quer

export default function Dashboard() {
    const [rooms, setRooms] = useState<number[]>([]);

    useEffect(() => {
        axios
            .get<Room[]>('/all-rooms')
            .then((response) => {
                // Mapeia os dados retornados da API para o formato desejado
                const allRooms = response.data.map((room) => room.room_number);
                setRooms(allRooms);
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {rooms.map((room, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-center">Quarto {room}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <PopUp
                                    triggerText="Ver Reservas"
                                    children={
                                        <CheckTable
                                            room_number={room}
                                        />
                                    }
                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
