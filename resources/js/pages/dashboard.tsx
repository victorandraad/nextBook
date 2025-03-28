import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Vai vim da API esses valores, nao só eles mas aparentemente todos as outras informacoes vao vim juntas
var allRooms: any[] = [];

axios.get('/all-rooms')
    .then(response => {
        // console.log("Server response: ", response.data);
        var rooms = response.data;
        for (let i = 0; i < rooms.length; i++) {
            allRooms.push("Quarto " + rooms[i].room_number);
        }
    }) 
    .catch(error => {
        console.error("Erro ao pedir os dados: ", error);
    }
);



const rooms = ["Quarto 101", "Quarto 102", "Quarto 103", "Quarto 104", "Quarto 105", "Quarto 106", ];


export default function Dashboard() {
    const handleButtonClick = (room: string) => {
        let roomName = window.prompt("Digite o nome de quem alugou o quarto: ");
        console.log(`Botão do quarto ${room} reservado para ${roomName}!`);
        console.log(rooms);
        console.log(allRooms);
        
        // Aqui você pode adicionar a lógica para enviar a requisição ao backend
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
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

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />

                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border flex items-center justify-center">

                        { 
                        rooms.map((room, index) => (
                            <>
                                <PlaceholderPattern  className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                <button 
                                    key={index}
                                    onClick={() => handleButtonClick(room)} 
                                    className="relative z-10 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                                    {room}
                                </button>
                            </>
                        )) }
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}
