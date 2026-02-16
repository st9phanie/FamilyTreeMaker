import { supabase } from "@/lib/supabase";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '../ui/input'
import { Button } from "../ui/button";

const PasswordResetModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
    const [newPassword, setNewPassword] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = async () => {
        setIsUpdating(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setIsUpdating(false);
        if (error) alert(error.message);
        else {
            alert("Password updated!");
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader><DialogTitle>Enter New Password</DialogTitle></DialogHeader>
                <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button onClick={handleUpdate} disabled={isUpdating}>
                    {isUpdating ? "Updating..." : "Update Password"}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default PasswordResetModal