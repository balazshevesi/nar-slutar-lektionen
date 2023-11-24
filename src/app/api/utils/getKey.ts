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
        body: JSON.stringify({}), //* this mfr right here cause took me like 3h to find, it NEEDS an empty body to return a correct key, but it will still return a key even if you don't give it and empty body, but that key will not work bruhhh
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
