import { useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import PersonForm from "./PersonForm";
import { addSibling } from "@/lib/functions";

type Props = {
    person: Person;
    name: string | undefined;
    onBack: () => void;
    refresh: () => void;
    family: Person[];
}

const AddSibling = ({ person, name, onBack, refresh, family }: Props) => {
    const [sibling, setSibling] = useState<"F" | "M" | "P">("F");

    const relFields = [
        { value: "F", label: "Full" },
        { value: "M", label: "Half (" + family.find(m => m.id === person.pid1)?.firstname + ")" },
        { value: "P", label: "Half (" + family.find(m => m.id === person.pid2)?.firstname + ")" },
    ];

    const handleSave = async (formData: Partial<Person>) => {
        const mom = person.pid1;
        const dad = person.pid2;

        const pids = {
            F: { pid1: mom, pid2: dad },
            M: { pid1: mom, pid2: null },
            P: { pid1: null, pid2: dad },
        }[sibling];

        const res = await addSibling(person.id!, {
            ...formData,
            ...pids,
            family_id: person.family_id,
        });

        if (res?.status === "success") refresh();
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

