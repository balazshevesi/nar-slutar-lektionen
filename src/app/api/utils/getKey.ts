export default async function getKey() {
  try {
    const response = await fetch(
      "https://web.skola24.se/api/get/timetable/render/key",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    return data.data.key;
  } catch (error) {
    console.error("Error in getKey:", error);
  }
}
