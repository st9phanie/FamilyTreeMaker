declare global {
    type Person = {
        id: number;
        firstname: string;
        middlename?: string;
        lastname?: string;
        governorate?: string;
        district?: string;
        area?: string;
        birth?: date;
        pid1?: number;
        pid2?: number;
        death?: date;
        sex: "M" | "F" | "U";
        status?: "L" | "D" | "U";
        photo?: File | null;
        deathGovernorate?: string;
        deathArea?: string;
        deathDistrict?: string;
        partner_id?: number[];
        family_id?: number[]
    };

    type Family = {
        id: number;
        user_id: number;
        lastname: string;
    };

}

export { };