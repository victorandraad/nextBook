import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface PopUpProps {
    triggerText: string;
}

export function PopUp(props: PopUpProps): React.ReactElement {
    return (
        <Dialog className="w-full max-w-md">
            <DialogTrigger className="w-20 cursor-pointer rounded-md bg-gray-500">{props.triggerText}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{props.triggerText}</DialogTitle>
                    <DialogDescription>
                        blah blah blah conteudo
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-4 flex justify-between">
                    <DialogClose asChild>
                        <button className="btn cursor-pointer">fechar</button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
