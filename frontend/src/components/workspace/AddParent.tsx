import ImagePicker from '@/components/ui/ImagePicker';
import { Button } from '@/components/ui/button';
import { ArrowLeft} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';
import { addPerson, updatePerson } from '@/lib/functions';

type Props = {
    person: Person;
    name: string | undefined;
    onBack: () => void;
    refresh: () => void;

}
type NameField = {
    id: string;
    label: string;
    required?: boolean;
    value: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
};

const sexFields = [
    { code: "M", label: "Male" },
    { code: "F", label: "Female" },
    { code: "U", label: "Undisclosed" },
];

const AddParent = ({ person, name, onBack, refresh }: Props) => {
    const [photo, setPhoto] = useState<string>("")
    const [firstname, setFirstname] = useState<string>("")
    const [middlename, setMiddlename] = useState<string>("")
    const [lastname, setLastname] = useState<string>("")
    const [sex, setSex] = useState<"M" | "F" | "U" | undefined>("U")

    const nameFields: NameField[] = [
        { id: "firstname", label: "First Name", required: false, value: firstname, onChange: setFirstname },
        { id: "middlename", label: "Middle Name(s)", value: middlename, onChange: setMiddlename },
        { id: "lastname", label: "Last Name", value: lastname, onChange: setLastname },
    ];

    const onSaveClick = async () => {
        if (!(photo || lastname || firstname || middlename || sex !== "U")) return;

        const data = await addPerson({
            photo,
            lastname,
            firstname,
            middlename,
            sex,
            family_id: person?.family_id,
            partner_id: [person.id!]
        });

        if (data?.status !== "success") return;

        const newId = data.person.id;

        const updatedPartners = Array.isArray(person.partner_id)
            ? [...person.partner_id, newId]
            : [newId];

        const res = await updatePerson(person.id!, {
            partner_id: updatedPartners
        });

        if (res?.status === "success") refresh();
    };


    return (
        <div className='w-[360px] h-[calc(100vh-60px)] border border-r-gray-300 px-5 flex flex-col gap-y-5 top-[60px] fixed py-5 justify-between'>
            <div className='flex flex-row justify-between'>
                <button>
                    <ArrowLeft className='cursor-pointer text-teal-900' onClick={onBack} />
                </button>
                <p className='text-center text-md text-teal-900'>Parent of {name}</p>
                <div></div>
            </div>
            <ImagePicker
                setPhoto={setPhoto}
            />
            {/* -------------------------------------------------------------------------------------------------------------------- */}
            <div className='flex flex-col gap-y-2'>
                <div className="flex flex-col justify-between mb-2 gap-y-5 text-teal-950">
                    {nameFields.map(field => (
                        <div key={field.id} className="flex flex-col">
                            <label className="text-sm mb-1 px-1" htmlFor={field.id}>{field.label}</label>
                            <input
                                id={field.id}
                                name={field.id}
                                required={field.required}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="border border-b-2 focus:border-teal-900 border-gray-300 outline-none  bg-white text-teal-900 px-2 py-1"
                            />
                        </div>
                    ))}
                </div>
                {/* -------------------------------------------------------------------------------------------------------------------- */}

                <div className="flex flex-col gap-3">
                    <p className="text-sm px-1">Sex</p>
                    <RadioGroup
                        value={sex}
                        onValueChange={(value) => setSex(value as "M" | "F" | "U")}
                        className="flex flex-row font-normal text-teal-700 justify-between"
                    >
                        {sexFields.map((val, key) => (
                            <div key={key} className="flex items-center space-x-2">
                                <RadioGroupItem value={val.code} id={val.code} />
                                <Label htmlFor={val.code}>{val.label}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
                {/* -------------------------------------------------------------------------------------------------------------------- */}

            </div>

            <div className='flex flex-row gap-x-2 justify-between w-full'>
                <Button className='rounded-none bg-teal-900 flex-1 cursor-pointer hover:bg-emerald-900/20 border-2 border-teal-900 hover:text-teal-900' onClick={onSaveClick}>Save</Button>
                <Button className='border-2 border-red-800 cursor-pointer text-red-800 flex-1 rounded-none bg-white hover:bg-red-100 ' onClick={onBack}>Cancel</Button>
            </div>

        </div>
    )
}

export default AddParent