export default async function getTimetable(
  signature: string,
  key: string,
  year: number,
  weekOfTheYear: number,
  dayOfTheWeek: number,
) {
  try {
    const response = await fetch(
      "https://web.skola24.se/api/render/timetable",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip, deflate, br, zstd", // Note: Fetch API may not allow setting this header
          "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
          "Content-Type": "application/json",
          Cookie:
            "ASP.NET_SessionId=fqiczjyuohxaws2jkcr4zf3w; TS01fb1e5e=012f3bf5f965a5b0bec44cdaa56bd2cab1434af997645f4eca50be0bdeb98936d3f6f070b32f1a032261eb0c343fb1ada3d50d0da2bf10cdb6a89d65ddd4c7a104b285185d",
          Host: "web.skola24.se", // Note: Fetch API may not allow setting this header
          Origin: "https://web.skola24.se",
          Referer:
            "https://web.skola24.se/timetable/timetable-viewer/almhult.skola24.se/Hagan%C3%A4sskolan/",
          "Sec-Fetch-Dest": "empty",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Site": "same-origin",
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36", // Note: Fetch API may not allow setting this header
          "X-Requested-With": "XMLHttpRequest",
          "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",
        },
        body: JSON.stringify({
          renderKey: key,
          host: "almhult.skola24.se",
          unitGuid: "OTU1MGZkNTktZGYzMi1mMTRkLWJhZDUtYzI4YWI0MDliZGU3",
          schoolYear: "bb76aa4b-03d4-4c97-83ca-5dc08bd00b1c",
          startDate: null,
          endDate: null,
          scheduleDay: dayOfTheWeek,
          blackAndWhite: false,
          width: 146,
          height: 550,
          selectionType: 4,
          selection: signature,
          showHeader: false,
          periodText: "",
          week: weekOfTheYear,
          year: year,
          privateFreeTextMode: false,
          privateSelectionMode: null,
          customerKey: "",
        }),
      },
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}
