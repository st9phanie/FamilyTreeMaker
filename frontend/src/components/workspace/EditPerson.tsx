import ImagePicker from '@/components/ui/ImagePicker';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { updatePerson } from '@/lib/functions';
import SidebarLayout from './SidebarLayout';

type Props = {
    person: Person;
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

const EditPerson = ({ person, onBack, refresh }: Props) => {
    const [photo, setPhoto] = useState<string>("")
    const [firstname, setFirstname] = useState<string>(person.firstname || "")
    const [middlename, setMiddlename] = useState<string>(person.middlename || "")
    const [lastname, setLastname] = useState<string>(person.lastname || "")
    const [sex, setSex] = useState<"M" | "F" | "U" | undefined>(person?.sex)
    const [update, setUpdate] = useState<boolean>(false)

    const nameFields: NameField[] = [
        { id: "firstname", label: "First Name", required: false, value: firstname, onChange: setFirstname },
        { id: "middlename", label: "Middle Name(s)", value: middlename, onChange: setMiddlename },
        { id: "lastname", label: "Last Name", value: lastname, onChange: setLastname },
    ];

    const onSaveClick = async () => {
        const data = await updatePerson(person.id!, { photo, lastname, firstname, middlename, sex })
        console.log(data);
        if (data.status == "success") setUpdate(true)
    }

    useEffect(() => {
        if (update) {
            refresh();
            setUpdate(false);
        }
    }, [update])

    return (
        <SidebarLayout>
            <div className='flex flex-row justify-between'>
                <button>
                    <ArrowLeft className='cursor-pointer text-teal-900' onClick={onBack} />
                </button>
                <p className='text-center text-base text-teal-900'>Edit {firstname}</p>
                <div></div>
            </div>
            <ImagePicker
                setPhoto={() => { }}
            />
            {/* ---------------------------------------- NAMES ------------------------------------------------------------- */}
            <div className="flex flex-col justify-between mb-2 gap-y-5 text-teal-950">
                {nameFields.map(field => (
                    <div key={field.id} className="flex text-sm flex-col">
                        <label className="mb-1 px-1" htmlFor={field.id}>{field.label}</label>
                        <input
                            id={field.id}
                            name={field.id}
                            required={field.required}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="border border-b-2 focus:border-teal-900 border-gray-300 outline-none rounded-lg bg-white text-teal-900 px-2 py-2"
                        />
                    </div>
                ))}
            </div>

            {/* ---------------------------------------- SEX ------------------------------------------------------------- */}
            <div className="flex flex-col gap-3">
                <p className="text-sm px-1 text-teal-950">Sex:</p>
                <RadioGroup
                    value={sex}
                    onValueChange={(value) => setSex(value as "M" | "F" | "U")}
                    className="flex flex-row font-normal text-teal-700 justify-between"
                >
                    {sexFields.map((val, key) => (
                        <div key={key} className="flex items-center space-x-2">
                            <RadioGroupItem className='cursor-pointer' value={val.code} id={val.code} />
                            <Label htmlFor={val.code}>{val.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>


            <div className='flex flex-row gap-x-2 justify-between w-full'>
                <Button className=' flex-1 active:border-b cursor-pointer ' onClick={onSaveClick}>Save</Button>
                <Button className='border-2 border-red-800 cursor-pointer text-red-800 flex-1  bg-white hover:bg-red-100 ' onClick={onBack}>Cancel</Button>
            </div>
        </SidebarLayout>
    )
}

export default EditPerson

