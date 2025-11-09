import { locations } from "../utils/utils.js";
import Combobox from "@/components/combobox.js";

type Props = {
    person: Person;
    setPerson: (p: any) => void;
    prefix: string;
    label?: string;
};

const Locations = ({ person, setPerson, prefix = "", label }: Props) => {

    const govKey = `${prefix ? prefix + "Governorate" : "governorate"}`;
    const distKey = `${prefix ? prefix + "District" : "district"}`;
    const areaKey = `${prefix ? prefix + "Area" : "area"}`;

    const governorate = (person as any)[govKey];
    const district = (person as any)[distKey];

    return (
        <div className="flex flex-col lg:flex-row justify-between gap-6 w-full">
            {label && <h3 className="text-base font-semibold mb-2">{label}</h3>}

            {/* Governorate */}
            <div className="flex flex-col justify-between items-start flex-1">
                <p className="text-sm mb-2 px-1">Governorate</p>
                <Combobox
                    list={locations.governorates}
                    listType="Governorate"
                    setValue={(value) =>
                        setPerson((p: any) => ({
                            ...p,
                            [govKey]: value,
                            [distKey]: "",
                            [areaKey]: "",
                        }))
                    }
                />
            </div>

            {/* District */}
            <div className="flex flex-col justify-between items-start flex-1">
                <p className="text-sm mb-2 px-1">District</p>
                <Combobox
                    list={locations.districts[governorate] || []}
                    listType="District"
                    setValue={(value) =>
                        setPerson((p: any) => ({
                            ...p,
                            [distKey]: value,
                            [areaKey]: "",
                        }))
                    }
                    disabled={!governorate}
                />
            </div>

            {/* Area */}
            <div className="flex flex-col justify-between items-start flex-1">
                <p className="text-sm mb-2 px-1">Area</p>
                <Combobox
                    list={locations.areas[district] || []}
                    listType="Area"
                    setValue={(value) =>
                        setPerson((p: any) => ({
                            ...p,
                            [areaKey]: value,
                        }))
                    }
                    disabled={!district}
                />
            </div>
        </div>
    );
};

export default Locations;
