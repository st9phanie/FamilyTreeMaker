import axios from "axios";

export async function fetchUserFamilies(userId:number) {
  try {
    const { data } = await axios.get("http://localhost:8000/family/", {
      params: { userid: userId },
    });
    return data;
  } catch (err:any) {
    console.error("Error fetching families:", err.response?.data || err.message);
  }
}
