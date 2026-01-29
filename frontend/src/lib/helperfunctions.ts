
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

export async function retryFetch(fn: () => Promise<any>, retries = 3, delay = 500) {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise(res => setTimeout(res, delay));
    return retryFetch(fn, retries - 1, delay);
  }
}
