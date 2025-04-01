import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { PopUp } from '@/components/pop-up';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

//! As requisicoes estão funcionando!
//TODO: falta a validacao se pode ou nao alugar na data que o usuário quer

export default function Dashboard() {
    const [rooms, setRooms] = useState<string[]>([]);

    useEffect(() => {
        axios.get<Room[]>('/all-rooms')
        .then(response => {
            // Mapeia os dados retornados da API para o formato desejado
            const allRooms = response.data.map(room => `Quarto ${room.room_number}`);
            setRooms(allRooms);
        })
        .catch(error => {
            console.error("Erro ao pedir os dados: ", error);
        });
    }, []);

    const handleButtonClick = (room: string) => {
        const roomName = room;
        const checkInDate = "2025-01-01"; // Aqui você pode pegar a data de check-in do usuário
        const checkoOutDate = "2025-01-05"; // Aqui você pode pegar a data de check-out do usuário

        console.log({name: roomName, 
                    check_in_date: checkInDate, 
                    check_out_date: checkoOutDate, 
                    room_number: Number(room.replace(/\D/g, ''))
                });

        axios.post("/book-a-room", {
            name: roomName, 
            check_in_date: checkInDate, 
            check_out_date: checkoOutDate, 
            room_number: Number(room.replace(/\D/g, '')),
        })
        .then(response => console.log("Hellooouuu! ",response.data))
        .catch(error => console.log("Erro dos grandes aqui bixo! ", error.response.data));
        
        // Aqui você pode adicionar a lógica para enviar a requisição ao backend
    };


    //! Valores esteticos, valores precisam ser dinamicos de acordo com oque clicar no front

    const handleDelete = () => {
        console.log("Oi");
        axios.post('/delete-book', {
            check_in_date: "2025-01-01",
            check_out_date: "2025-01-05",
            room_number: 103
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-screen flex-1 flex-col gap-4 rounded-xl p-4">
                {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div> */}

                <div className="border-sidebar-border/70 bg-zinc-900 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                   
                        <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border flex flex-col p-4 items-center gap-6">
                            <div className='flex gap-4'>
                                { 
                                rooms.map((room, index) => (
                                    <>
                                        <PopUp 
                                            key={index}
                                            triggerText={room}
                                        />
                                    </>
                                )) }
                            </div>
                        </div>
                    

                </div>
            </div>
        </AppLayout>
    );
}
