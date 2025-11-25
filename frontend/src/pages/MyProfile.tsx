import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Calendar22 } from "@/components/ui/datepicker";
import ImagePicker from "@/components/ui/ImagePicker";
import Locations from "@/components/Locations";

type Props = {
    person: Person;
    onChange: (updater: (prev: Person) => Person) => void;
    onSubmit?: () => void;
    onCancel?: () => void;
    isEditMode?: boolean;
};


export const MyProfile = ({
    person,
    onChange,
    onSubmit,
    onCancel,
}: Props) => {
    const nameFields = [
        { id: "firstname", label: "First Name *", required: true },
        { id: "middlename", label: "Middle Name" },
        { id: "lastname", label: "Last Name" },
    ];

    const sexFields = [
        { code: "M", label: "Male" },
        { code: "F", label: "Female" },
        { code: "U", label: "Undisclosed" }]

    const statusFields = [
        { code: "L", label: "Living" },
        { code: "D", label: "Deceased" },
        { code: "U", label: "Unknown" }]
    
    // Helper to extract value safely from Person for input fields
    const getPersonValue = (id: string) => {
        const val = person[id as keyof Person];
        return (val === null || val === undefined) ? '' : String(val);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit?.();
            }}
            className="flex flex-col items-center gap-y-5 w-full"
        >
            {/* ---------- PHOTO ---------- */}
            <section className="text-center space-y-4">
                <h3 className="font-medium text-lg">Photo</h3>
                <ImagePicker
                    setPhoto={(file) => onChange((prev) => ({ ...prev, photo: file }))}
                />
            </section>

            <hr className="border-t border-gray-200 w-full" />

            {/* ---------- NAME FIELDS ---------- */}
            <section className="flex flex-col w-full text-start text-sm">
                <p className="text-red-600 italic mb-5">* required</p>
                <div className="flex flex-col justify-between gap-6">
                    {nameFields.map((field) => (
                        <div key={field.id} className="flex flex-col ">
                            <label className="text-sm mb-2 px-1" htmlFor={field.id}>
                                {field.label}
                            </label>
                            <input
                                id={field.id}
                                name={field.id}
                                required={field.required}
                                className="border border-gray-200 bg-gray-200/10 rounded px-2 py-1"
                                // Use helper to handle type assertion and defaults
                                value={getPersonValue(field.id)}
                                onChange={(e) => {
                                    const { id, value } = e.target;
                                    // --- FIX 4: FUNCTIONAL UPDATE ---
                                    onChange((prev) => ({ ...prev, [id]: value }));
                                }}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- SEX, DOB, STATUS ---------- */}
            <section className="flex flex-col gap-6 w-full justify-between">
                <div className="flex flex-col gap-3">
                    <p className="text-sm px-1">Sex *</p>
                    <RadioGroup
                        value={person.sex}
                        onValueChange={(value) =>
                            onChange((prev) => ({ ...prev, sex: value as Person["sex"] }))
                        }
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

                <Calendar22
                    setDate={(date) => {
                        onChange((prev) => ({ ...prev, birth: date }));
                    }}
                    existingDate={person.birth}
                    label="Approximate Date of Birth"
                />

                <div className="flex flex-col gap-3">
                    <p className="text-sm px-1">Status</p>
                    <RadioGroup
                        value={person.status}
                        onValueChange={(value) =>
                            onChange((prev) => ({ ...prev, status: value as Person["status"] }))
                        }
                        className="flex flex-row font-normal"
                    >
                        {statusFields.map((val,key) => (
                            <div key={key} className="flex items-center space-x-2">
                                <RadioGroupItem value={val.code} id={val.code} />
                                <Label htmlFor={val.code}>{val.label}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </section>

            {/* ---------- BIRTHPLACE ---------- */}
            <section className="w-full">
                <h3 className="font-medium text-lg mb-3">
                    Approximate Location of Birth
                </h3>
                <Locations person={person} setPerson={onChange} prefix="" />
            </section>

            {/* ---------- DEATH INFO ---------- */}
            {person.status === "D" && (
                <section className="w-full">
                    <hr className="border-t border-gray-200 my-4" />
                    <h3 className="font-medium text-lg mb-3">Death Information</h3>
                    <Locations person={person} setPerson={onChange} prefix="death" />
                    <div className="pt-5">
                        <Calendar22
                            setDate={(date) => 
                                // --- FIX 10: FUNCTIONAL UPDATE ---
                                onChange((prev) => ({ ...prev, death: date! }))
                            }
                            existingDate={person.death} // Added existingDate for completeness
                            label="Approximate Date of Death"
                        />
                    </div>
                </section>
            )}

            {/* ---------- BUTTONS ---------- */}
            <section className="flex flex-row justify-between w-full mt-6">
                {onCancel && (
                    <Button variant="destructive" type="button" onClick={(onCancel)}>
                        Cancel
                    </Button>
                )}
                <Button type="submit">{"Save Changes"}</Button>
            </section>
        </form>
    );
};

export default MyProfile;