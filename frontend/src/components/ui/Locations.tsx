import { locations } from "../utils/utils.js";
import Combobox from "@/components/ui/combobox.js"; // Assuming this is the fixed version


type Props = {
    person: Person;
    setPerson: (updater: (prev: Person) => Person) => void;
    prefix: string; 
    label?: string;
};

const Locations = ({ person, setPerson, prefix = "", label }: Props) => {

    const govKey = `${prefix ? prefix + "Governorate" : "governorate"}`;
    const distKey = `${prefix ? prefix + "District" : "district"}`;
    const areaKey = `${prefix ? prefix + "Area" : "area"}`;

    // 1. READ: Get current values from the prop
    const governorate = person[govKey] || "";
    const district = person[distKey] || "";
    const area = person[areaKey] || "";

    return (
        <div className="flex flex-col gap-6 w-full">
            {label && <h3 className="text-base font-semibold mb-2">{label}</h3>}

            {/* Governorate */}
            <div className="flex flex-col justify-between items-start flex-1">
                <p className="text-sm mb-2 px-1">Governorate</p>
                <Combobox
                    list={locations.governorates}
                    listType="Governorate"
                    // 2. DISPLAY: Pass the current value to Combobox.
                    // The Combobox will display this string.
                    value={governorate} // <-- THIS CONTROLS THE UI DISPLAY
                    setValue={(value) => {
                        // 3. UPDATE: When a new value is selected...
                        setPerson((p) => ({ // ...update the parent state
                            ...p,
                            [govKey]: value,
                            [distKey]: "", 
                            [areaKey]: "", 
                        })); console.log(person.governorate);

                    }}
                />
            </div>

            {/* District */}
            <div className="flex flex-col justify-between items-start flex-1">
                <p className="text-sm mb-2 px-1">District</p>
                <Combobox
                    list={locations.districts[governorate] || []}
                    listType="District"
                    // 2. DISPLAY: Show the current district
                    value={district} 
                    setValue={(value) => {
                        setPerson((p) => ({
                            ...p,
                            [distKey]: value,
                            [areaKey]: "", 
                        }));
                    }}
                    disabled={!governorate}
                />
            </div>

            {/* Area */}
            <div className="flex flex-col justify-between items-start flex-1">
                <p className="text-sm mb-2 px-1">Area</p>
                <Combobox
                    list={locations.areas[district] || []}
                    listType="Area"
                    // 2. DISPLAY: Show the current area
                    value={area} // <-- THIS CONTROLS THE UI DISPLAY
                    setValue={(value) => {
                        // 3. UPDATE: Update the parent state
                        setPerson((p) => ({
                            ...p,
                            [areaKey]: value,
                        }));
                    }}
                    disabled={!district}
                />
            </div>
        </div>
    );
};

export default Locations;