// @/components/workspace/PersonForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import ImagePicker from '@/components/ui/ImagePicker';
import { Calendar22 } from '../ui/datepicker';
import { useWorkspaceStore } from '@/utils/store';

type PersonFormProps = {
    title: string;
    onBack: () => void;
    onSave: (data: Partial<Person>) => void;
    children?: React.ReactNode;
};

const sexFields = [
    { code: "M", label: "Male" },
    { code: "F", label: "Female" },
    { code: "U", label: "Undisclosed" },
];

const PersonForm = ({ title, onBack, onSave, children }: PersonFormProps) => {

    const { selectedPerson } = useWorkspaceStore()

    const [photo, setPhoto] = useState(selectedPerson?.photo || "");
    const [firstname, setFirstname] = useState(selectedPerson?.firstname || "");
    const [middlename, setMiddlename] = useState(selectedPerson?.middlename || "");
    const [lastname, setLastname] = useState(selectedPerson?.lastname || "");
    const [sex, setSex] = useState<"M" | "F" | "U">(selectedPerson?.sex || "U");
    const [birth, setBirth] = useState<Date | null>(selectedPerson?.birth || null);

    const handleSubmit = () => {
        onSave({ photo, firstname, middlename, lastname, sex, birth });
    };

    return (
        <div className='w-[360px] h-[calc(100vh-40px)] border-r border-gray-300 px-5 flex flex-col gap-y-5 top-[40px] fixed py-5 justify-between bg-white'>
            <div className='flex flex-col gap-y-5'>
                <div className='flex flex-row justify-between items-center'>
                    <ArrowLeft className='cursor-pointer text-teal-900' onClick={onBack} />
                    <p className='text-center font-medium text-teal-900'>{title}</p>
                    <div className='w-6' />
                </div>

                <ImagePicker setPhoto={setPhoto} />

                <div className='flex flex-col gap-y-4'>
                    {[
                        { id: "fn", label: "First Name", val: firstname, set: setFirstname },
                        { id: "mn", label: "Middle Name", val: middlename, set: setMiddlename },
                        { id: "ln", label: "Last Name", val: lastname, set: setLastname },
                    ].map((f) => (
                        <div key={f.id} className="flex flex-col">
                            <label className="text-xs text-gray-500 mb-1 px-1">{f.label}</label>
                            <input
                                value={f.val}
                                onChange={(e) => f.set(e.target.value)}
                                className="rounded-lg border border-gray-300 outline-none focus:border-teal-900 px-2 py-1.5 text-sm"
                            />
                        </div>
                    ))}

                    {/* SEX */}
                    <div className="flex flex-col gap-2">
                        <p className="text-xs text-gray-500 px-1">Sex</p>
                        <RadioGroup value={sex} onValueChange={(v) => setSex(v as any)} className="flex flex-row justify-between">
                            {sexFields.map((s) => (
                                <div key={s.code} className="flex items-center space-x-2">
                                    <RadioGroupItem value={s.code} id={s.code} />
                                    <Label htmlFor={s.code} className="text-sm">{s.label}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {/* BIRTHDAY */}
                    <div className="flex flex-col gap-2">
                        <Calendar22 label="Birth" existingDate="" setDate={() => setBirth} />
                    </div>


                    {children}
                </div>
            </div>

            <div className='flex flex-row gap-x-2 w-full'>
                <Button className='bg-teal-900 flex-1' onClick={handleSubmit}>Save</Button>
                <Button variant="outline" className='flex-1' onClick={onBack}>Cancel</Button>
            </div>
        </div>
    );
};

export default PersonForm;