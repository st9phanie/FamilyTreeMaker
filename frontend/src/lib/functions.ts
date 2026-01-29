import { supabase } from "./supabase";
import api from "@/api";

// Helper to get the current session token
async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return {};

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function fetchFamilies() {
  try {
    const headers = await getAuthHeader();
    const { data } = await api.get(`/family/all`, { headers });
    return data;
  } catch (err: unknown) {
    console.error("Error fetching families:", err.response?.data || err.message);
    throw err; // Throwing allows the component to catch and show an error UI
  }
}

export async function fetchFamilyMembers(id: string) {
  try {
    const headers = await getAuthHeader();
    const { data } = await api.get(`/family/${id}`, { headers });
    return data;
  } catch (err: unknown) {
    console.error(`Error fetching members for family ${id}:`, err.response?.data || err.message);
    return [];
  }
}

export async function fetchUserFamiliesAndLengths() {
  try {
    const families = await fetchFamilies();

    if (!families || families.length === 0) return [[], []];

    // Fetch all member lists in parallel
    const memberLists = await Promise.all(
      families.map((f: Family) => fetchFamilyMembers(f.id))
    );

    const lengths = memberLists.map(list => list.length);

    return [families, lengths];
  } catch (err: unknown) {
    console.error("Error in combined fetch:", err.message);
    return [[], []];
  }
}

export async function signupuser({ email, password }: { email: string; password: string; }) {
  const { data } = await api.post("/auth/signup", { email, password });
  return data;
}

export async function resendConfirmation(email: string) {
  const { data } = await api.post("/auth/resend-confirmation", { email });
  return data;
}

// --- PERSON & RELATIONSHIP FUNCTIONS  ---

export async function updatePerson(id: number, person: Partial<Person>) {
  const { data } = await api.put(`/person/${id}`, person);
  return data;
}

export async function addPerson(person: Partial<Person>) {
  const headers = await getAuthHeader();

  const { data } = await api.post(`/person`, person, { headers });
  return data;
}

export async function addPartner(id: number, person: Partial<Person>) {
  const { data } = await api.post(`/person/${id}/add_partner`, person);
  return data;
}


export async function addParent(id: number, person: Partial<Person>) {
  const { data } = await api.post(`/person/${id}/add_parent`, person);
  return data;
}

export async function deletePerson(id: number) {
  const { data } = await api.delete(`/person/${id}`);
  return data;
}

export async function updateFamilyCardName(id: string, new_name: string) {
  const headers = await getAuthHeader();

  const { data } = await api.put(`/family/${id}/update_name`, { new_name }, { headers });
  return data;
}

export async function createNewFamily(family: Partial<Family>) {
  const { data } = await api.post(`/family`, family);
  return data;
}

export async function changeImage(id: number, formData: FormData) {

  const { data } = await api.post(`/person/${id}/upload-photo`, formData);
  return data;
}

export async function deleteFamily(family_id: string) {
  const { data } = await api.delete(`/family/${family_id}`);
  return data;
}