import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

interface PopUpProps {
    triggerText?: string;
    roomNumber?: number;
    caseStyle?: string;
    children: React.ReactNode;
    contentStyle?: string;
}

export function PopUp(props: PopUpProps): React.ReactElement {
    return (
        <Dialog>
            <DialogTrigger className={`cursor-pointer rounded-b-md ${props.caseStyle}`}>{props.triggerText}</DialogTrigger>
            <DialogContent className="sm:max-w-[950px] sm:h-[780px]">
                <DialogHeader>
                    <DialogTitle>Quarto {props.roomNumber}</DialogTitle>
                    <DialogDescription>
                        Detalhes e informações do {props.roomNumber}
                    </DialogDescription>
                    <div>
                        {props.children}
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
