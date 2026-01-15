declare global {
    type Person = {
        id?: number;
        firstname?: string;
        middlename?: string;
        lastname?: string;
        governorate?: string;
        district?: string;
        area?: string;
        birth?: date;
        pid1?: number | null;
        pid2?: number | null;
        death?: date;
        sex?: "M" | "F" | "U";
        status?: "L" | "D" | "U";
        photo?: string;
        //deathGovernorate?: string;
        //deathArea?: string;
        //deathDistrict?: string;
        partner_id?: number[];
        family_id?: string
        deathplace?: string;
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