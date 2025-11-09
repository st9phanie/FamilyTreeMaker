declare global {
    type Person = {
        firstname: string,
        middlename: string | null,
        lastname: string | null,
        governorate: string | null,
        district: string | null,
        area: string | null,
        dob: Date | undefined,
        dod: Date | undefined,
        sex: "Undisclosed" | "Male" | "Female",
        status: "Unknown" | 'Deceased' | "Living",
        photo: File | null,
        deathGovernorate: string | null,
        deathArea: string | null,
        deathDistrict: string | null
    };

}

export { };