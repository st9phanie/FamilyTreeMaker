import axios from "axios";

export async function fetchUserFamilies(userId: number) {
  try {
    const { data } = await axios.get("http://localhost:8000/family/", {
      params: { userid: userId },
    });
    return data;
  } catch (err: any) {
    console.error("Error fetching families:", err.response?.data || err.message);
  }
}

export async function fetchFamilyMembers(id: number) {
  try {
    const { data } = await axios.get(`http://localhost:8000/family/${id}`);
    return data;
  } catch (err: any) {
    console.error("Error fetching families:", err.response?.data || err.message);
  }
}

export async function fetchUserFamiliesAndLengths(userId: number) {
  try {
    const families = await fetchUserFamilies(userId);

    const memberLists = await Promise.all(
      families.map((f: Family) => fetchFamilyMembers(f.id))
    );

    const lengths = memberLists.map(list => list.length);

    console.log(lengths);

    return [families, lengths];

  } catch (err: any) {
    console.error("Error fetching families:", err.response?.data || err.message);
  }
}

export async function updatePerson(id: number, person: Partial<Person>) {
  const payload: any = { ...person };

  // Convert Date → "YYYY-MM-DD"
  if (payload.birth instanceof Date) {
    payload.birth = payload.birth.toISOString().slice(0, 10);
  }
  if (payload.death instanceof Date) {
    payload.death = payload.death.toISOString().slice(0, 10);
  }
  // Arrays must be arrays of numbers
  if (Array.isArray(payload.partner_id)) {
    payload.partner_id = payload.partner_id.map(Number);
  }

  if (Array.isArray(payload.family_id)) {
    payload.family_id = payload.family_id.map(Number);
  }

  // Remove undefined fields
  Object.keys(payload).forEach((key) => {
    if (payload[key] === undefined) delete payload[key];
  });

  try {
    console.log("Sending payload:", payload);

    const { data } = await axios.put(
      `http://localhost:8000/person/${id}`,
      payload
    );

    return data;
  } catch (err: any) {
    console.error("Error updating user:", err.response?.data || err.message);
  }
}

export async function addPerson(person: Partial<Person>) {
  try {
    const { data } = await axios.post(
      `http://localhost:8000/person/`,
      person
    );
    return data;
  } catch (err: any) {
    console.error("Error adding person:", err.response?.data || err.message);

  }
}