import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';

interface PopUpProps {
    triggerText?: string;
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
                    <DialogTitle>{props.triggerText}</DialogTitle>
                    <DialogDescription>
                        Detalhes e informações do {props.triggerText}
                    </DialogDescription>
                    <div>
                        {props.children}
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
