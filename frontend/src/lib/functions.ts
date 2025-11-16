import axios from "axios";

export async function fetchUserFamilies(userId: number) {
  try {
    const { data } = await axios.get("http://localhost:8000/family/", {
      params: { userid: userId },
    });
    return data;
  } catch (err:any) {
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
