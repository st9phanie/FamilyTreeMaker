import { useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import PersonForm from "./PersonForm";
import { addSibling } from "@/lib/functions";
import { useWorkspaceStore } from "@/utils/store";

type Props = {
    name: string | undefined;
    onBack: () => void;
}

const AddSibling = ({ name, onBack }: Props) => {
    const [sibling, setSibling] = useState<"F" | "M" | "P">("F");

    const {
        familyMembers,
        refresh,
        selectedPerson
    } = useWorkspaceStore();

    if (!selectedPerson) return;

    const relFields = [
        { value: "F", label: "Full" },
        { value: "M", label: "Half (" + familyMembers.find(m => m.id === selectedPerson.pid1)?.firstname + ")" },
        { value: "P", label: "Half (" + familyMembers.find(m => m.id === selectedPerson.pid2)?.firstname + ")" },
    ];

    const handleSave = async (formData: Partial<Person>) => {
        const mom = selectedPerson.pid1;
        const dad = selectedPerson.pid2;

        const pids = {
            F: { pid1: mom, pid2: dad },
            M: { pid1: mom, pid2: null },
            P: { pid1: null, pid2: dad },
        }[sibling];

        const res = await addSibling(selectedPerson.id!, {
            ...formData,
            ...pids,
            family_id: selectedPerson.family_id,
        });

        if (res?.status === "success") refresh(selectedPerson.family_id!);
    };

    return (
        <PersonForm title={`Sibling of ${name}`} onBack={onBack} onSave={handleSave}>
            {/* ------------------------------------------------------------ FULL OR HALF SIBLING -------------------------------------------------------- */}
            <div className="flex flex-col gap-3">
                <p className="text-sm px-1">Relation</p>
                <RadioGroup
                    value={sibling}
                    onValueChange={(value) => setSibling(value as "F" | "M" | "P")}
                    className="flex flex-row font-normal text-teal-700 justify-around">
                    {relFields.map((val, key) => (
                        <div key={key} className="flex items-center space-x-2">
                            <RadioGroupItem value={val.value} id={val.label} />
                            <Label htmlFor={val.label}>{val.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        </PersonForm >
    );
};

export default AddSibling

