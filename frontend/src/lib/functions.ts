import axios from "axios";

export async function fetchUserFamilies(userId: number) {
  try {
    const { data } = await axios.get("http://localhost:8000/family", {
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

  try {
    console.log("Sending payload:", person);

    const { data } = await axios.put(
      `http://localhost:8000/person/${id}`,
      person
    );

    return data;
  } catch (err: any) {
    console.error("Error updating user:", err.response?.data || err.message);
  }
}

export async function addPerson(person: Partial<Person>) {
  try {
    const { data } = await axios.post(
      `http://localhost:8000/person`,
      person
    );
    return data;
  } catch (err: any) {
    console.error("Error adding person:", err.response?.data || err.message);

  }
}

export async function addPartner(id:number, person: Partial<Person>) {
  try {
    const { data } = await axios.post(
      `http://localhost:8000/person/${id}/add_partner`,
      person
    );
    return data;
  } catch (err: any) {
    console.error("Error adding person:", err.response?.data || err.message);

  }
}

export async function addParent(id:number, person: Partial<Person>) {
  try {
    const { data } = await axios.post(
      `http://localhost:8000/person/${id}/add_parent`,
      person
    );
    return data;
  } catch (err: any) {
    console.error("Error adding person:", err.response?.data || err.message);

  }
}

export async function deletePerson(id: number) {
  try {
    const { data } = await axios.delete(
      `http://localhost:8000/person/${id}`
    );
    return data;
  } catch (err: any) {
    console.error("Error deleting person:", err.response?.data || err.message);
    throw err; // <-- IMPORTANT so UI knows it failed
  }
}
