import ImagePicker from '@/components/ui/ImagePicker';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';
import { addParent, addSibling } from '@/lib/functions';

type Props = {
    person: Person;
    name: string | undefined;
    onBack: () => void;
    refresh: () => void;
    family: Person[];

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



const AddSibling = ({ person, name, onBack, refresh, family }: Props) => {
    const [photo, setPhoto] = useState<string>("")
    const [firstname, setFirstname] = useState<string>("")
    const [middlename, setMiddlename] = useState<string>("")
    const [lastname, setLastname] = useState<string>("")
    const [sex, setSex] = useState<"M" | "F" | "U" | undefined>("U")
    const [sibling, setSibling] = useState<"F" | "M" | "P">("F")

    const nameFields: NameField[] = [
        { id: "firstname", label: "First Name", required: false, value: firstname, onChange: setFirstname },
        { id: "middlename", label: "Middle Name(s)", value: middlename, onChange: setMiddlename },
        { id: "lastname", label: "Last Name", value: lastname, onChange: setLastname },
    ];

    const relFields = [
        { value: "F", label: "Full" },
        { value: "M", label: "Half (" + family.find(m => m.id === person.pid1)?.firstname + ")" },
        { value: "P", label: "Half (" + family.find(m => m.id === person.pid2)?.firstname + ")" },
    ];

    const onSaveClick = async () => {
        if (!(photo || lastname || firstname || middlename || sex !== "U")) return;

        // parents of the current person
        const mom = person.pid1;
        const dad = person.pid2;

        let newSibling;
        let createdParent;

        console.log(mom);
        
        if (sibling === "F") {
            // full sibling: same mom + dad
            newSibling = await addSibling(person.id!, {
                photo, lastname, firstname, middlename, sex,
                family_id: person.family_id,
                pid1: mom,
                pid2: dad
            });

        } else if (sibling === "M") {
            // maternal half sibling: share mom only
            newSibling = await addSibling(person.id!, {
                photo, lastname, firstname, middlename, sex,
                family_id: person.family_id,
                pid1: mom,
                pid2: null
            });

            // // If mom doesn't exist → create her
            // if (!mom && newSibling?.status === "success") {
            //     createdParent = await addParent(newSibling.sibling_id, {
            //         firstname: `Mother of ${firstname}`,
            //         family_id: person.family_id,
            //         sex: "F"
            //     });
            // }

        } else if (sibling === "P") {
            // paternal half sibling: share dad only
            newSibling = await addSibling(person.id!, {
                photo, lastname, firstname, middlename, sex,
                family_id: person.family_id,
                pid1: null,
                pid2: dad
            });

            // If dad doesn't exist → create him
            if (!dad && newSibling?.status === "success") {
                createdParent = await addParent(newSibling.sibling_id, {
                    firstname: `Father of ${firstname}`,
                    family_id: person.family_id,
                    sex: "M"
                });
            }
        }

        if (newSibling?.status === "success") {
            refresh();
        }
    };



    return (
        <div className='w-[360px] h-[calc(100vh-40px)] border border-r-gray-300 px-5 flex flex-col gap-y-5 top-[40px] fixed py-5 justify-between'>
            <div className='flex flex-row justify-between'>
                <button>
                    <ArrowLeft className='cursor-pointer text-teal-900' onClick={onBack} />
                </button>
                <p className='text-center text-md text-teal-900'>Sibling of {name}</p>
                <div></div>
            </div>
            <ImagePicker
                setPhoto={setPhoto}
            />
            {/* --------------------------------------------------- NAMES ----------------------------------------------------------------- */}
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
                                className="rounded-lg border border-b-2 focus:border-teal-900 border-gray-300 outline-none  bg-white text-teal-900 px-2 py-1"
                            />
                        </div>
                    ))}
                </div>
                {/* ---------------------------------------------------------- SEX ---------------------------------------------------------- */}

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
                {/* ------------------------------------------------------------ FULL OR HALF SIBLING -------------------------------------------------------- */}

                <div className="flex flex-col gap-3">
                    <p className="text-sm px-1">Relation</p>
                    <RadioGroup
                        value={sibling}
                        onValueChange={(value) => setSibling(value as "F" | "M" | "P")}
                        className="flex flex-row font-normal text-teal-700 justify-around"
                    >
                        {relFields.map((val, key) => (
                            <div key={key} className="flex items-center space-x-2">
                                <RadioGroupItem value={val.value} id={val.label} />
                                <Label htmlFor={val.label}>{val.label}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </div>

            {/* ------------------------------------------------- BUTTONS ------------------------------------------------------------------- */}

            <div className='flex flex-row gap-x-2 justify-between w-full'>
                <Button className=' bg-teal-900 flex-1 cursor-pointer hover:bg-emerald-900/20 border-2 border-teal-900 hover:text-teal-900' onClick={onSaveClick}>Save</Button>
                <Button className='border-2 border-red-800 cursor-pointer text-red-800 flex-1  bg-white hover:bg-red-100 ' onClick={onBack}>Cancel</Button>
            </div>

        </div>
    )
}

export default AddSibling