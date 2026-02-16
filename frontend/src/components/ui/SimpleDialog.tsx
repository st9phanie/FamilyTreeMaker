import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";

type Props = {
    open: boolean;
    onClose: () => void;
    title: string;
    action: () => void;
    description?: string;
}

const SimpleDialog = ({ open, onClose, title, action, description }: Props) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const run = async () => {
        try {
            setIsUpdating(true)
            await action()
            onClose()
        } catch (error) {
            console.log(error);

        } finally {
            setIsUpdating(false)

        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription className="text-primary/60">{description}</DialogDescription>}
                </DialogHeader>
                <div className="flex flex-row gap-x-5 mt-5">

                    <Button variant="secondary" onClick={run} disabled={isUpdating} className="flex-1">
                        Yes
                    </Button>
                    <Button className="flex-1 bg-white text-slate-900 hover:bg-slate-100/50 hover:dark:bg-slate-300" onClick={onClose} disabled={isUpdating}>
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SimpleDialog