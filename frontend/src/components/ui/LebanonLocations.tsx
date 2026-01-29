import Combobox from "@/components/ui/combobox";
import { locations } from "@/utils/lebanonGDAInfo"
import { useState } from "react";

type Props = {
  governorate?: string | null;
  district?: string | null;
  area?: string | null;
  setGovernorate: (value: string | null) => void;
  setDistrict: (value: string | null) => void;
  setArea: (value: string | null) => void;
};

const LebanonLocations = ({
  governorate,
  district,
  area,
  setArea,
  setGovernorate,
  setDistrict,
}: Props) => {


  ///mapping
  const govs = locations.governorates.map((name, index) => ({
    id: index,
    label: name
  }));

  const propGov = govs.find((item) => item.label === governorate)

  const [selectedGov, setSelectedGov] = useState(propGov || null)

  let districts: {
    id: number;
    label: string;
  }[] = [];

  if (selectedGov) {
    districts = locations.districts[selectedGov.label].map((name: string, index: number) => ({
      id: index,
      label: name
    }));
  }

  const propDis = districts.find((item) => item.label === district)

  const [selectedDis, setSelectedDis] = useState(propDis || null)

  let areas: {
    id: number;
    label: string;
  }[] = [];

  if (selectedDis) {
    areas = locations.areas[selectedDis.label].map((name: string, index: number) => ({
      id: index,
      label: name
    }));
  }

  const propArea = areas.find((item) => item.label === area)

//   const [selectedArea, setSelectedArea] = useState(propArea || null)


  const onGovChange = (id: number | null) => {
    const g = govs.find((item) => String(item.id) === String(id));
    setGovernorate(g ? g.label : null)
    setSelectedGov(g || null)
    setDistrict(null);
    setArea(null);
  };

  const onDistrictChange = (id: number | null) => {
    const d = districts.find((item) => String(item.id) === String(id));
    setDistrict(d ? d.label : null);
    setSelectedDis(d || null);
    setArea(null);
  };

  const onAreaChange = (id: number | null) => {
    const a = areas.find((item) => String(item.id) === String(id));
    setArea(a ? a.label : null);
    // setSelectedArea(a || null);
  };


  return (
    <div className="flex flex-col gap-3 w-full text-xs">

      {/* Governorate */}
      <div className="flex flex-col">
        <label className=" text-primary-foreground mb-1 px-1">Governorate</label>
        <Combobox
          list={govs}
          value={propGov?.id}
          listType="Governorate"
          setValue={onGovChange}
        />
      </div>

      <div className="flex flex-col">
        <label className=" text-primary-foreground mb-1 px-1">District</label>
        <Combobox
          list={selectedGov ? districts : []}
          listType="District"
          value={propDis?.id}
          setValue={onDistrictChange}
          disabled={!selectedGov}
        />
      </div>

      <div className="flex flex-col">
        <label className=" text-primary-foreground mb-1 px-1">Area</label>
        <Combobox
          list={selectedDis ? areas : []}
          listType="Area"
          value={propArea?.id}
          setValue={onAreaChange}
          disabled={!selectedDis}
        />
      </div>
    </div>
  );
};

export default LebanonLocations;