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
import { changeImage, deletePersonImage } from '@/lib/functions';
import SimpleDialog from '../ui/SimpleDialog';

type PersonFormProps = {
    title: string;
    onBack: () => void;
    onSave: (data: Person) => void;
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
    const { selectedPerson } = useWorkspaceStore();
    const isEdit = title.startsWith("Edit");

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)


    const [formData, setFormData] = useState<Person>({
        photo: null,
        firstname: "",
        middlename: "",
        lastname: "",
        sex: "U",
        status: "U",
        birth: null,
        death: null,
        country: null,
        governorate: null,
        district: null,
        area: null,
        country_of_death: null,
        death_governorate: null,
        death_district: null,
        death_area: null,
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const parseDate = (dateStr: any) => {
        if (!dateStr) return null;
        const [year, month, day] = String(dateStr).split('-').map(Number);
        return new Date(year, month - 1, day);
    };

    useEffect(() => {
        if (isEdit && selectedPerson) {
            setFormData({
                photo: selectedPerson.photo || null,
                firstname: selectedPerson.firstname || "",
                middlename: selectedPerson.middlename || "",
                lastname: selectedPerson.lastname || "",
                sex: selectedPerson.sex || "U",
                status: selectedPerson.death ? "D" : "L",
                birth: parseDate(selectedPerson.birth),
                death: parseDate(selectedPerson.death),
                country: selectedPerson.country || null,
                governorate: selectedPerson.governorate || null,
                district: selectedPerson.district || null,
                area: selectedPerson.area || null,
                country_of_death: selectedPerson.country_of_death || null,
                death_governorate: selectedPerson.death_governorate || null,
                death_district: selectedPerson.death_district || null,
                death_area: selectedPerson.death_area || null,
            });
        }
    }, [selectedPerson, isEdit]);

    useEffect(() => {
        if (formData.death) handleChange("status", "D");
    }, [formData.death]);

    const handleSubmit = async () => {
        try {
            setIsLoading(true)
            const formatDate = (d: Date | null) => {
                if (!d) return null;
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`; // Returns "YYYY-MM-DD" in local time
            };
            const personData = {
                ...formData,
                firstname: formData.firstname?.trim(),
                middlename: formData.middlename?.trim(),
                lastname: formData.lastname?.trim(),
                birth: formatDate(formData.birth),
                death: formatDate(formData.death),
                photo: formData.photo instanceof File ? (selectedPerson?.photo || null) : formData.photo
            };

            const response = onSave(personData);

            const personId = selectedPerson?.id || response;

            if (personId && formData.photo instanceof File) {
                const imagePayload = new FormData();
                imagePayload.append("photo", formData.photo);
                console.log("FormData built. Ready to upload...");
                await changeImage(personId, imagePayload);
            }

        } catch (error) {
            console.error("Failed to save person", error);
        } finally {
            setIsLoading(false)
        }
    };

    const removePhoto = async () => {
        try {
            if (selectedPerson?.id) {
                const response = await deletePersonImage(selectedPerson?.photo, selectedPerson?.id)
                if (response.status == "success") {
                    handleChange("photo", null);
                    useWorkspaceStore.setState((state) => ({
                        selectedPerson: state.selectedPerson ? { ...state.selectedPerson, photo: "" } : null
                    }));
                }
            }
        } catch (error) {
            console.error("Failed to remove person photo", error);
        }
    }

    return (
        <div className='w-[360px] h-[calc(100vh-40px)] border-r 
        border-sidebar-border
        bg-secondary
        text-primary
        px-5 flex flex-col gap-y-5 top-[40px] fixed py-5 justify-between  overflow-y-scroll'>
            <div className='flex flex-col gap-y-5'>
                <div className='flex flex-row justify-between items-center'>
                    <ArrowLeft className='cursor-pointer text-primary' onClick={onBack} />
                    <p className='text-center font-medium text-primary'>{title}</p>
                    <div className='w-6' />
                </div>

                <ImagePicker
                    currentPhoto={formData.photo}
                    setPhoto={(value) => handleChange("photo", value)}
                    onRemove={() => setIsDeleteDialogOpen(true)}
                />

                <div className='flex flex-col gap-y-4'>
                    {[
                        { id: "firstname", label: "First Name", val: formData.firstname },
                        { id: "middlename", label: "Middle Name", val: formData.middlename },
                        { id: "lastname", label: "Last Name", val: formData.lastname },
                    ].map((f) => (
                        <div key={f.id} className="flex flex-col">
                            <label className="text-xs text-primary-foreground mb-1 px-1">{f.label}</label>
                            <input
                                value={f.val}
                                onChange={(e) => handleChange(f.id, e.target.value)}
                                className="rounded-lg border border-sidebar-border outline-none focus:border-primary px-2 py-1.5 text-sm"
                            />
                        </div>
                    ))}

                    <div className="flex flex-col gap-2">
                        <p className="text-xs px-1 text-primary-foreground">Sex</p>
                        <RadioGroup value={formData.sex} onValueChange={(v) => handleChange("sex", v)} className="flex flex-row justify-between">
                            {sexFields.map((s) => (
                                <div key={s.code} className="flex items-center space-x-2 ">
                                    <RadioGroupItem value={s.code} id={s.code} className='cursor-pointer' />
                                    <Label htmlFor={s.code} className="text-sm text-primary">{s.label}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    {children}
                    <hr className='mt-1' />

                    <div className="flex flex-col gap-2">
                        <p className="text-xs px-1 text-primary-foreground">Status</p>
                        <RadioGroup value={formData.status} onValueChange={(v) => handleChange("status", v)} className="flex flex-row justify-between">
                            {statusFields.map((s) => (
                                <div key={s.code} className="flex items-center space-x-2">
                                    <RadioGroupItem value={s.code} id={s.code} className='cursor-pointer' />
                                    <Label htmlFor={s.code} className="text-sm text-primary">{s.label}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Calendar22 label="Birth" date={formData.birth || undefined} setDate={(date) => handleChange("birth", date)} />
                        <Calendar22 label="Death" date={formData.death || undefined} setDate={(date) => handleChange("death", date)} />
                    </div>

                    <hr className='mt-1' />

                    <CountryPicker
                        country={formData.country}
                        setCountry={(v) => handleChange("country", v)}
                        city={formData.area}
                        setCity={(v) => handleChange("area", v)}
                        label="Birth"
                    />

                    {formData.country === "Lebanon" && (
                        <LebanonLocations
                            governorate={formData.governorate}
                            district={formData.district}
                            area={formData.area}
                            setGovernorate={(v) => handleChange("governorate", v)}
                            setDistrict={(v) => handleChange("district", v)}
                            setArea={(v) => handleChange("area", v)}
                        />
                    )}

                    <hr className='mt-1' />

                    {formData.status === "D" && (
                        <CountryPicker
                            country={formData.country_of_death}
                            setCountry={(v) => handleChange("country_of_death", v)}
                            city={formData.death_area}
                            setCity={(v) => handleChange("death_area", v)}
                            label="Death"
                        />
                    )}

                    {formData.status === "D" && formData.country_of_death === "Lebanon" && (
                        <LebanonLocations
                            governorate={formData.death_governorate}
                            district={formData.death_district}
                            area={formData.death_area}
                            setGovernorate={(v) => handleChange("death_governorate", v)}
                            setArea={(v) => handleChange("death_area", v)}
                            setDistrict={(v) => handleChange("death_district", v)}
                        />
                    )}

                    {formData.status === "D" && <hr className='mt-1' />}
                </div>
            </div>

            <div className='flex flex-row gap-x-2 w-full'>
                <Button className='flex-1' disabled={isLoading} onClick={handleSubmit}>Save</Button>
                <Button variant="outline" className='flex-1' disabled={isLoading} onClick={onBack}>Cancel</Button>
            </div>

            <SimpleDialog
                open={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                title="Delete Picture?"
                description="This action cannot be undone."
                action={removePhoto}
            />
        </div>
    );
};

export default PersonForm;