declare global {
    type Person = {
        firstname: string;
        middlename?: string;
        lastname?: string;
        governorate?: string;
        district?: string;
        area?: string;
        dob?: Date;
        dod?: Date;
        sex: "M" | "F" | "U";
        status?: "Living" | "Deceased" | "Unknown";
        photo?: File | null;
        deathGovernorate?: string;
        deathArea?: string;
        deathDistrict?: string;
    };

}

export { };