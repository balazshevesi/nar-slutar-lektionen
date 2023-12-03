import axios from "axios";

export default async function getKey() {
  try {
    const response = await axios.post(
      "https://web.skola24.se/api/get/timetable/render/key",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",
        },
      },
    );
    return response.data.data.key;
  } catch (error) {
    console.error("Error in getKey:", error);
    throw error; // Rethrow the error for further handling if necessary
  }
}
