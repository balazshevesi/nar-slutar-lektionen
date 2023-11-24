export default async function getSignature(id: string) {
  try {
    const response = await fetch(
      "https://web.skola24.se/api/encrypt/signature",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",
        },
        body: JSON.stringify({ signature: id }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    return data.data.signature;
  } catch (error) {
    console.error("Error in getSignature:", error);
  }
}
