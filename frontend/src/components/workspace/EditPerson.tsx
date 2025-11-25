import ImagePicker from '@/components/ui/ImagePicker';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Pen, Sidebar, Text } from 'lucide-react';
import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { updatePerson } from '@/lib/functions';

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
    const [update,setUpdate] = useState<boolean>(false)

    const nameFields: NameField[] = [
        { id: "firstname", label: "First Name", required: false, value: firstname, onChange: setFirstname },
        { id: "middlename", label: "Middle Name(s)", value: middlename, onChange: setMiddlename },
        { id: "lastname", label: "Last Name", value: lastname, onChange: setLastname },
    ];

    const onSaveClick = () => {
        const data = updatePerson(person.id!, { photo, lastname, firstname, middlename, sex })
        console.log(data);
        setUpdate(true)
    }

    useEffect(() => {
        if(update) {refresh();setUpdate(false);}
    },[update])

    return (
        <div className='w-[360px] h-[calc(100vh-60px)]
 border-r-2 border-r-emerald-900 px-5 flex flex-col gap-y-5 top-[60px] fixed bg-emerald-100/20 overflow-y-scroll py-5'>
            <div className='flex flex-row justify-between'>
                <ArrowLeft className='text-emerald-900' onClick={onBack} />
                <p className='text-center text-lg text-emerald-900'>Edit {firstname}</p>
                <Sidebar className='text-emerald-900' />

            </div>
            <ImagePicker
                setPhoto={() => { }}
            />
            {/* ---------------------------------------- NAMES ------------------------------------------------------------- */}
            <div className='flex flex-col gap-y-2'>
                <div className="flex flex-col justify-between mb-2 gap-y-2 text-emerald-950">
                    {nameFields.map(field => (
                        <div key={field.id} className="flex flex-col">
                            <label className="text-sm mb-1 px-1" htmlFor={field.id}>{field.label}</label>
                            <input
                                id={field.id}
                                name={field.id}
                                required={field.required}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="border border-b-2 focus:border-emerald-900 border-emerald-900 outline-none bg-white rounded px-2 py-1"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* ---------------------------------------- SEX ------------------------------------------------------------- */}
            <div className="flex flex-col gap-3">
                <p className="text-sm px-1">Sex</p>
                <RadioGroup
                    value={sex}
                    onValueChange={(value) => setSex(value as "M" | "F" | "U")}
                    className="flex flex-row font-normal"
                >
                    {sexFields.map((val, key) => (
                        <div key={key} className="flex items-center space-x-2">
                            <RadioGroupItem value={val.code} id={val.code} />
                            <Label htmlFor={val.code}>{val.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>


            <hr className='border-slate-300 ' />
            <div className='flex flex-row gap-x-2 justify-between w-full'>
                <Button className='border border-b-3 bg-emerald-600 border-emerald-950 flex-1 active:border-b cursor-pointer hover:bg-emerald-500' onClick={onSaveClick}>Save</Button>
                <Button variant="destructive" className='border border-b-3 border-amber-950 hover:bg-red-700 cursor-pointer flex-1 active:border-b' onClick={onBack}>Cancel</Button>
            </div>        </div>
    )
}

export default EditPerson 