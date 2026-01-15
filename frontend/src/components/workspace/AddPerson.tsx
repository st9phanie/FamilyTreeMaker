import ImagePicker from '@/components/ui/ImagePicker';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { addPerson } from '@/lib/functions';
import { useParams } from 'react-router-dom';

type Props = {
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

const AddPerson = ({ onBack, refresh }: Props) => {
    const [photo, setPhoto] = useState<string>("")
    const [firstname, setFirstname] = useState<string>("")
    const [middlename, setMiddlename] = useState<string>("")
    const [lastname, setLastname] = useState<string>("")
    const [sex, setSex] = useState<"M" | "F" | "U" | undefined>("U")
    const [update, setUpdate] = useState<boolean>(false)
    const { id: familyId } = useParams();

    const nameFields: NameField[] = [
        { id: "firstname", label: "First Name", required: false, value: firstname, onChange: setFirstname },
        { id: "middlename", label: "Middle Name(s)", value: middlename, onChange: setMiddlename },
        { id: "lastname", label: "Last Name", value: lastname, onChange: setLastname },
    ];

    const onSaveClick = async () => {
        const data = await addPerson({ photo, lastname, firstname, middlename, sex, family_id: familyId })
        console.log(data);
        if (data.status == "success") setUpdate(true)
    }

    useEffect(() => {
        if (update) { refresh(); setUpdate(false); }
    }, [update])

    return (
        <div className='w-[360px] h-[calc(100vh-40px)] border-r border-r-gray-300 px-5 flex flex-col gap-y-5 top-[40px] fixed  py-5 justify-between'>
            <div className='flex flex-col gap-y-5'>
                <p className='text-center text-md text-teal-900'>Add Member</p>
                <ImagePicker
                    setPhoto={setPhoto}
                />

            </div>

            {/* ---------------------------------------- NAMES ------------------------------------------------------------- */}
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
                            className="border border-b-2 focus:border-teal-900 border-gray-300 outline-none rounded-lg  bg-white text-teal-900 px-2 py-1"
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
                            <RadioGroupItem value={val.code} id={val.code} />
                            <Label htmlFor={val.code}>{val.label}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>


            <div className='flex flex-row gap-x-2 justify-between w-full'>
                <Button className=' bg-teal-900 flex-1 active:border-b cursor-pointer hover:bg-emerald-900/20 hover:border hover:border-teal-900 hover:text-teal-900' onClick={onSaveClick}>Save</Button>
                <Button variant="outline" className='cursor-pointer flex-1  bg-white ' onClick={onBack}>Cancel</Button>
            </div>        </div>
    )
}

export default AddPerson

