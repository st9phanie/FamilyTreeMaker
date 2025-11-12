import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Calendar22 } from "@/components/ui/datepicker";
import ImagePicker from "@/components/ImagePicker";
import Locations from "@/components/Locations";

type Props = {
  person: Person;
  onChange: (updated: Person) => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  isEditMode?: boolean;
};

export const PersonForm = ({
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="flex flex-col items-center gap-y-10 w-full  px-5 py-10"
    >
      {/* ---------- PHOTO ---------- */}
      <section className="text-center space-y-4">
        <h3 className="font-medium text-lg">Photo</h3>
        <ImagePicker
          setPhoto={(file) => onChange({ ...person, photo: file })}
        />
      </section>

      <hr className="border-t border-gray-200 w-full" />

      {/* ---------- NAME FIELDS ---------- */}
      <section className="flex flex-col w-full text-start text-sm">
        <p className="text-red-600 italic mb-5">* required</p>
        <div className="flex flex-col justify-between gap-6">
          {nameFields.map((field) => (
            <div key={field.id} className="flex flex-col w-[260px]">
              <label className="text-sm mb-2 px-1" htmlFor={field.id}>
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                required={field.required}
                className="border border-gray-200 bg-gray-200/10 rounded px-2 py-1"
                value={person[field.id as keyof Person] as string}
                onChange={(e) =>
                  onChange({ ...person, [field.id]: e.target.value })
                }
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
              onChange({ ...person, sex: value as Person["sex"] })
            }
            className="flex flex-row font-normal"
          >
            {["Male", "Female", "Undisclosed"].map((val) => (
              <div key={val} className="flex items-center space-x-2">
                <RadioGroupItem value={val} id={val} />
                <Label htmlFor={val}>{val}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Calendar22
          setDate={(date) => onChange({ ...person, dob: date })}
          label="Approximate Date of Birth"
        />

        <div className="flex flex-col gap-3">
          <p className="text-sm px-1">Status</p>
          <RadioGroup
            value={person.status}
            onValueChange={(value) =>
              onChange({ ...person, status: value as Person["status"] })
            }
            className="flex flex-row font-normal"
          >
            {["Living", "Deceased", "Unknown"].map((val) => (
              <div key={val} className="flex items-center space-x-2">
                <RadioGroupItem value={val} id={val} />
                <Label htmlFor={val}>{val}</Label>
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
      {person.status === "Deceased" && (
        <section className="w-full">
          <hr className="border-t border-gray-200 my-4" />
          <h3 className="font-medium text-lg mb-3">Death Information</h3>
          <Locations person={person} setPerson={onChange} prefix="death" />
          <div className="pt-5">
            <Calendar22
              setDate={(date) => onChange({ ...person, dod: date })}
              label="Approximate Date of Death"
            />
          </div>
        </section>
      )}

      {/* ---------- BUTTONS ---------- */}
      <section className="flex flex-row justify-between w-full mt-6">
        {onCancel && (
          <Button variant="destructive" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{"Save Changes"}</Button>
      </section>
    </form>
  );
};
