
export function toMemberNode(familyMembers: Person[]) {
    const members = familyMembers.map((m) => ({
        id: m.id!,
        pids: Array.isArray(m.partner_id)
            ? m.partner_id
            : m.partner_id
                ? [m.partner_id]
                : [],
        name: [m.firstname, m.middlename, m.lastname].filter(Boolean).join(" "),
        gender: m.sex === "F" ? "female" : m.sex === "M" ? "male" : "U",
        mid: m.pid1,
        fid: m.pid2,
    }))

    return members
}

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const handlePdfExport = (FamilyTree: any, family:any) => {
    FamilyTree.pdfPrevUI.show(family, {
        format: "A4",
        header: 'My Header',
        footer: 'My Footer. Page {current-page} of {total-pages}',
    });
}