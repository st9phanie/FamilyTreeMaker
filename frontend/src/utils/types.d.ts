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
        pid1?: number;
        pid2?: number;
        death?: date;
        sex?: "M" | "F" | "U";
        status?: "L" | "D" | "U";
        photo?: string;
        //deathGovernorate?: string;
        //deathArea?: string;
        //deathDistrict?: string;
        partner_id?: number[];
        family_id?: number
        deathplace?: string;
    };

    type Family = {
        id: number;
        user_id: number;
        lastname: string;
    };

    interface Window {
        FamilyTree: any;
    }

    declare var FamilyTree: any;

    interface MemberNode {
        id: number;
        mid?: number;
        fid?: number;
        pids?: number[];
        name: string;
        gender: string;
        photo?: string;
    };
}

export { };