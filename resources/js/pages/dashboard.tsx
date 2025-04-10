import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { PopUp } from '@/components/pop-up';
import { CheckTable } from '@/components/checkTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
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

    const handleDelete = (check_in_date: Date[], check_out_date: Date[]) => (room_number: String) =>{
        console.log('teste', check_in_date, check_out_date, room_number);
        check_in_date.forEach((inDate, index) => {
            const outDate = check_out_date[index];
            axios.post('/delete-book', {
                check_in_date: inDate,
                check_out_date: outDate,
                room_number
            });
        });
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
                                            children={<CheckTable //adicionar os dados dinamicos
                                                del={(check_in_date, check_out_date) => handleDelete(check_in_date, check_out_date) (room)}
                                                id="1"
                                                nome="anailsom"
                                                prazo_f={new Date()}
                                                Prazo_i={new Date()}
                                                />}
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
