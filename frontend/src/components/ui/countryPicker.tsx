import Combobox from "@/components/ui/combobox";
import { countriesAndCities } from "@/utils/countriesandcities";

type Props = {
    country?: string | null;
    city?: string | null;
    setCountry: (value: string | null) => void;
    setCity: (value: string | null) => void;
    label?: string;
};

const CountryPicker = ({ country, city, setCountry, setCity, label }: Props) => {

    const countryList = countriesAndCities.map((obj, index) => ({
        id: index,
        label: obj.country,
        cities: obj.cities
    }));

    const currentCountryObj = countryList.find((c) => c.label === country);

    const cities = currentCountryObj 
        ? currentCountryObj.cities.map((name, index) => ({ id: index, label: name }))
        : [];

    const currentCityObj = cities.find((c) => c.label === city);

    const onCountryChange = (id: number | null) => {
        const found = countryList.find((c) => c.id === id);
        setCountry(found ? found.label : null);
        setCity(null); 
    };

    const onCityChange = (id: number | null) => {
        const found = cities.find((c) => c.id === id);
        setCity(found ? found.label : null);
    };

    return (
        <div className="flex flex-col gap-3 w-full text-xs">
            {label && <p className="text-base font-medium">Location of {label}</p>}

            <div className="flex flex-col">
                <label className="text-primary-foreground mb-1 px-1">Country</label>
                <Combobox
                    list={countryList}
                    value={currentCountryObj?.id}
                    listType="Country"
                    setValue={onCountryChange}
                />
            </div>

            {country && country !== "Lebanon" && (
                <div className="flex flex-col">
                    <label className="text-primary-foreground mb-1 px-1">City</label>
                    <Combobox
                        list={cities}
                        listType="City"
                        value={currentCityObj?.id}
                        setValue={onCityChange}
                    />
                </div>
            )}
        </div>
    );
};

export default CountryPicker;