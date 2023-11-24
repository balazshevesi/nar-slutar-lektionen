import axios from "axios";

async function getKey() {
  try {
    const response = await fetch(
      "https://web.skola24.se/api/get/timetable/render/key",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",
        },
      }
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

async function getSignature(id) {
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
      }
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

async function fetchTimetable(
  signature,
  key,
  year,
  weekOfTheYear,
  dayOfTheWeek
) {
  try {
    const response = await fetch(
      "https://web.skola24.se/api/render/timetable",
      {
        method: "POST",
        headers: {
          "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",
          "Content-Type": "application/json",
          Cookie:
            "ASP.NET_SessionId=hpjjfzrh1syub4511fiw3hkl; TS01fb1e5e=012f3bf5f98258eecd19932e996cebb932891d23594674c978422d86809c4ef6b504b6b3f37b7111645785f614603d3ac11a1144c32c623c380fb84e27a1d413b6b5af124a",
        },
        body: JSON.stringify({
          renderKey: key,
          selection: signature,
          year: year,
          week: weekOfTheYear,
          scheduleDay: dayOfTheWeek,
          unitGuid: "OTU1MGZkNTktZGYzMi1mMTRkLWJhZDUtYzI4YWI0MDliZGU3",
          host: "almhult.skola24.se",
          startDate: null,
          endDate: null,
          blackAndWhite: false,
          width: 424,
          height: 550,
          selectionType: 4,
          showHeader: false,
          periodText: "",
          privateFreeTextMode: false,
          privateSelectionMode: null,
          customerKey: "",
        }),
      }
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

export default async function getSchedule(req, res) {
  console.log("burhuefhuerf", req.body);
  const schemaId = req.body.scheduleId;
  const year = req.body.year;
  const weekOfTheYear = req.body.weekOfTheYear;
  const dayOfTheWeek = req.body.dayOfTheWeek;

  try {
    const signature = await getSignature(schemaId);
    console.log("Signature:", signature);

    const key = await getKey();
    console.log("Key:", key);

    const schedule = await fetchTimetable(
      signature,
      key,
      year,
      weekOfTheYear,
      dayOfTheWeek
    );
    console.log("Schedule:", schedule);

    res.status(200).json(schedule);
  } catch (error) {
    console.error("Error in getSchedule:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
