// @/components/workspace/PersonForm.tsx
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import ImagePicker from '@/components/ui/ImagePicker';
import { Calendar22 } from '../ui/datepicker';
import { useWorkspaceStore } from '@/utils/store';
import LebanonLocations from '../ui/LebanonLocations';
import CountryPicker from '../ui/countryPicker';

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

const statusFields = [
    { code: "L", label: "Living" },
    { code: "D", label: "Deceased" },
    { code: "U", label: "Unknown" },
];

const PersonForm = ({ title, onBack, onSave, children }: PersonFormProps) => {

    const { selectedPerson, loading } = useWorkspaceStore()

    const [photo, setPhoto] = useState(selectedPerson?.photo || "");
    const [firstname, setFirstname] = useState(selectedPerson?.firstname || "");
    const [middlename, setMiddlename] = useState(selectedPerson?.middlename || "");
    const [lastname, setLastname] = useState(selectedPerson?.lastname || "");
    const [sex, setSex] = useState<"M" | "F" | "U">(selectedPerson?.sex || "U");
    const [birth, setBirth] = useState<Date | null>(selectedPerson?.birth || null);
    const [death, setDeath] = useState<Date | null>(selectedPerson?.death || null);
    const [status, setStatus] = useState<"L" | "D" | "U">(selectedPerson?.status || death ? "D" : "U");

    //birth location details
    const [country, setCountry] = useState(selectedPerson?.country || null)
    const [birthGov, setBirthGov] = useState(selectedPerson?.governorate || null);
    const [birthDis, setBirthDis] = useState(selectedPerson?.district || null);
    const [birthLoc, setBirthLoc] = useState(selectedPerson?.area || null);

    //death location details
    const [countryOfDeath, setCountryOfDeath] = useState(selectedPerson?.country_of_death || null)
    const [deathGov, setDeathGov] = useState(selectedPerson?.death_governorate || null);
    const [deathDis, setDeathDis] = useState(selectedPerson?.death_district || null);
    const [deathLoc, setDeathLoc] = useState(selectedPerson?.death_area || null);


    useEffect(() => {
        setPhoto(selectedPerson?.photo || "");
        setFirstname(selectedPerson?.firstname || "");
        setMiddlename(selectedPerson?.middlename || "");
        setLastname(selectedPerson?.lastname || "");
        setSex(selectedPerson?.sex || "U");
        if (selectedPerson?.birth) {
            const [year, month, day] = (selectedPerson.birth as string).split('-').map(Number);
            setBirth(new Date(year, month - 1, day));
        } else {
            setBirth(null);
        }
        if (selectedPerson?.death) {
            const [year, month, day] = (selectedPerson.death as string).split('-').map(Number);
            setDeath(new Date(year, month - 1, day));
            setStatus("D")
        } else {
            setDeath(null);
            setStatus("U")
        }
        setCountry(selectedPerson?.country || null)
        setCountryOfDeath(selectedPerson?.country_of_death || null)
        setBirthGov(selectedPerson?.governorate || null);
        setBirthDis(selectedPerson?.district || null);
        setBirthLoc(selectedPerson?.area || null);
        setDeathGov(selectedPerson?.death_governorate || null);
        setDeathDis(selectedPerson?.death_district || null);
        setDeathLoc(selectedPerson?.death_area || null);
    }, [selectedPerson]);

    useEffect(() => {
        if (death) setStatus("D")
    }, [death])

    const handleSubmit = () => {
        const formatDate = (d: Date | null) => {
            if (!d) return null;
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        onSave({
            photo, firstname, middlename, lastname, sex,
            birth: formatDate(birth) as any,
            death: formatDate(death) as any,
            status,
            governorate: birthGov,
            district: birthDis,
            area: birthLoc,
            country: country,
            death_governorate: deathGov,
            death_district: deathDis,
            death_area: deathLoc,
            country_of_death: countryOfDeath,
        });
    };

    return (
        <div className='w-[360px] h-[calc(100vh-40px)] border-r border-gray-300 px-5 flex flex-col gap-y-5 top-[40px] fixed py-5 justify-between bg-white overflow-y-scroll'>
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
                                <div key={s.code} className="flex items-center space-x-2 ">
                                    <RadioGroupItem value={s.code} id={s.code} className='cursor-pointer' />
                                    <Label htmlFor={s.code} className="text-sm">{s.label}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {children}

                    <hr className='mt-1' />

                    {/* STATUS */}
                    <div className="flex flex-col gap-2">
                        <p className="text-xs text-gray-500 px-1">Status</p>
                        <RadioGroup value={status} onValueChange={(v) => setStatus(v as any)} className="flex flex-row justify-between">
                            {statusFields.map((s) => (
                                <div key={s.code} className="flex items-center space-x-2">
                                    <RadioGroupItem value={s.code} id={s.code} className='cursor-pointer' />
                                    <Label htmlFor={s.code} className="text-sm">{s.label}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {/* BIRTH DATE and DEATH DATE */}
                    <div className="flex flex-col gap-2">
                        <Calendar22 label="Birth" date={birth || undefined} setDate={setBirth} />
                        <Calendar22 label="Death" date={death || undefined} setDate={setDeath} />
                    </div>

                    <hr className='mt-1' />

                    {/* BIRTH LOCATION */}
                    <CountryPicker country={country} setCountry={setCountry} city={birthLoc} setCity={setBirthLoc} label="Birth" />

                    {country === "Lebanon" &&
                        <LebanonLocations governorate={birthGov} district={birthDis} area={birthLoc} setGovernorate={setBirthGov} setArea={setBirthLoc} setDistrict={setBirthDis} />
                    }
                    <hr className='mt-1' />


                    {/* DEATH LOCATION */}
                    {status === "D" &&
                        <CountryPicker country={countryOfDeath} setCountry={setCountryOfDeath} city={deathLoc} setCity={setDeathLoc} label="Death" />}

                    {status === "D" && countryOfDeath === "Lebanon" &&
                        <LebanonLocations governorate={deathGov} district={deathDis} area={deathLoc} setGovernorate={setDeathGov} setArea={setDeathLoc} setDistrict={setDeathDis} />

                    }

                    {status === "D" && <hr className='mt-1' />}

                </div>
            </div>

            <div className='flex flex-row gap-x-2 w-full'>

                <Button className='bg-teal-900 flex-1' disabled={loading} onClick={handleSubmit}>Save</Button>
                <Button variant="outline" className='flex-1' disabled={loading} onClick={onBack}>Cancel</Button>
            </div>
        </div>
    );
};

export default PersonForm;