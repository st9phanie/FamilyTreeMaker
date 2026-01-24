import Combobox from "@/components/ui/combobox";
import { countriesAndCities } from "@/utils/countriesandcities";
import { useState } from "react";

type Props = {
    country?: string | null;
    city?: string | null;
    setCountry: (value: string | null) => void;
    setCity: (value: string | null) => void;
    label?: string;
};

const CountryPicker = ({
    country,
    city,
    setCountry,
    setCity,
    label
}: Props) => {


    ///mapping
    const countries = countriesAndCities.map((obj, index) => ({
        id: index,
        country: obj,
    }));

    const countryNames = countriesAndCities.map((obj, index) => ({
        id: index,
        label: obj.country,
    }));

    const propCountry = countries.find((item) => item.country.country === country)

    const [selectedCountry, setSelectedCountry] = useState(propCountry || null)

    let cities: {
        id: number;
        label: string;
    }[] = [];

    if (selectedCountry) {
        cities = selectedCountry.country.cities.map((name: string, index: number) => ({
            id: index,
            label: name
        }));
    }

    const propCity = cities.find((item) => item.label === city)

    const [selectedCity, setSelectedCity] = useState(propCity || null)


    const onCountryChange = (id: number | null) => {
        const g = countries.find((item) => String(item.id) === String(id));
        setCountry(g ? g.country.country : null)
        setSelectedCountry(g || null)
        setCity(null);
    };

    const onCityChange = (id: number | null) => {
        const d = cities.find((item) => String(item.id) === String(id));
        setCity(d ? d.label : null);
        setSelectedCity(d || null);
    };


    return (
        <div className="flex flex-col gap-3 w-full text-xs">
            {label && <p className="text-base font-medium text-teal-900 ">Location of {label}</p>}

            {/* Countries */}
            <div className="flex flex-col">
                <label className=" text-gray-500 mb-1 px-1">Country</label>
                <Combobox
                    list={countryNames}
                    value={propCountry?.id}
                    listType="Country"
                    setValue={onCountryChange}
                />
            </div>


            {country !== "Lebanon" && selectedCountry?.country.country !== "Lebanon" &&
                <div className="flex flex-col">
                    <label className=" text-gray-500 mb-1 px-1">City</label>
                    <Combobox
                        list={selectedCountry ? cities : []}
                        listType="City"
                        value={propCity?.id}
                        setValue={onCityChange}
                        disabled={!selectedCountry}
                    />
                </div>
            }
        </div>
    );
};

export default CountryPicker;