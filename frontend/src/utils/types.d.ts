declare global {
    type Person = {
        id?: number;
        firstname?: string;
        middlename?: string;
        lastname?: string;
        governorate?: string | null;
        district?: string | null;
        area?: string | null;
        birth?: date;
        pid1?: number | null;
        pid2?: number | null;
        death?: date;
        sex?: "M" | "F" | "U";
        status?: "L" | "D" | "U";
        photo?: any | null;
        country?: string | null;
        country_of_death?: string | null;
        death_governorate?: string | null;
        death_area?: string | null;
        death_district?: string | null;
        partner_id?: number[];
        family_id?: string
    };

    type Family = {
        id: string;
        user_id: string;
        name: string;
    };

    interface Window {
        FamilyTree: any;
    }

    declare var FamilyTree: any;

    interface MemberNode {
        id: number;
        mid?: number | null;
        fid?: number | null;
        pids?: number[];
        name: string;
        gender: string;
        photo?: string;
    };
}

export { };