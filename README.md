<h1 align="center">
    <a href="https://www.xn--nr-slutar-lektionen-gwb.net/">när-slutar-lektionen.net ⏳</a>
</h1>
<h3 align="center">
  "När slutar lektionen?" är den vanligaste frågan man ställer i skolan. Detta är ett svar
</h3>

<a align="center" href="https://www.xn--nr-slutar-lektionen-gwb.net">
  <img src=https://raw.githubusercontent.com/Balazs-topg/nar-slutar-lektionen/main/imgs/showcase.gif>
</a>

<div align="center">
  <a href="https://react.dev/">
      <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
  </a>
  <a href="https://nextjs.org/">
      <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white">
  </a>
  <a href="https://tailwindcss.com/">
      <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white">
  </a>
  <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
  </a>
</div>

---

OBS att inte alla scheman fungerar korrekt eftersom att vissa skolor väljer att inte använda skola24s tjänster trots att de har köpt in de.

# Innehåll

- [Tech Stack](#-tech-stack)

- [Server Komponenter](#-server-komponenter)

- [Hosting](#-hosting)

- [Skola24s API](#-skola24as-api)

- [Projektplan och rapport](#-projektplan-och-rapport)

- [Framtid](#-projektplan-och-rapport)

# 🧑‍💻 Tech Stack

## Production

- **Framework:** [React.js](https://react.dev/)
- **Meta Framework:** [Next.js](https://nextjs.org/), med app router och server komponenter
- **Styling:** [TailwindCSS](https://tailwindcss.com/)

## Development

- **Code Formating:** [Prettier](https://prettier.io/), med [import-sort-plugin](https://www.npmjs.com/package/@trivago/prettier-plugin-sort-imports) och [tailwind-plugin](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- **Linting:** [ESlint](https://eslint.org/), med inställningarna som Next.js kommer med
- **Språk:** [Typescript](https://www.typescriptlang.org/)

# 🖥 Server komponenter

Appen utnyttjar server komponenterna i next.js 14s app router. All data fetching sker med hjälp av de. Det är bara de interaktiva grejerna som är [klient komponenter](https://react.dev/reference/react/use-client)

# 👾 Skola24as API

Skola24as API är odkumenterad så jag var tvungen att "reverse-engeneer"a delar av den. Detta gjorde jag med Chrome Dev Tools.

Här är min implementation av API anropen:

[Mapp med util funktioner för att hämta pussel bitarna](src/utils/scheduleFetching)

[Fil som sätter ihop pussel bitarna](src/app/[kommun]/[skola]/[schema-id]/fetchSchedule.ts)

## [1. Först behöver man hämta en "signatur"](src/utils/scheduleFetching/getSignature.ts)

### Endpoint

```http
POST https://web.skola24.se/api/encrypt/signature
```

### Headers

| key            | value                                  |
| -------------- | -------------------------------------- |
| `Content-Type` | `application/json`                     |
| `X-Scope`      | `8a22163c-8662-4535-9050-bc5e1923df48` |

### Body

```js
{
  signature: "[schemaID]";
}
```

## [2. Sedan behöver man hämta en "key"](src/utils/scheduleFetching/getKey.ts)

### Endpoint

```http
POST https://web.skola24.se/api/get/timetable/render/key
```

### Headers

| key            | value                                  |
| -------------- | -------------------------------------- |
| `Content-Type` | `application/json`                     |
| `X-Scope`      | `8a22163c-8662-4535-9050-bc5e1923df48` |

### Body

```js
{
}
```

Bodyn _måste_ inkluderas trots att den ska vara tom

### OBS

Denna request fungerar _inte_ med en javascripts fetch, man behöver axios eller något annat. Jag vet inte exakt varför, men jag misstänker att det har med headers att göra.

## [3. Sedan behöver man hämta "schoolyear"](/src/utils/scheduleFetching/getSchoolYear.ts)

### Endpoint

```http
POST https://web.skola24.se/api/get/active/school/years
```

### Headers

| key            | value                                  |
| -------------- | -------------------------------------- |
| `Content-Type` | `application/json`                     |
| `X-Scope`      | `8a22163c-8662-4535-9050-bc5e1923df48` |

### Body

```js
{
  getTimetableViewerUnitsRequest: {
    hostName: "[komun - namn]".skola24.se;
  }
  checkSchoolYearsFeatures: false;
}
```

## [4. Sedan behöver man hämta "unitGuid"](/src/utils/scheduleFetching/getUnitGuidFromSkola.ts)

### Endpoint

```http
POST https://web.skola24.se/api/services/skola24/get/timetable/viewer/units
```

### Headers

| key            | value                                  |
| -------------- | -------------------------------------- |
| `Content-Type` | `application/json`                     |
| `X-Scope`      | `8a22163c-8662-4535-9050-bc5e1923df48` |

### Body

```js
{
  getTimetableViewerUnitsRequest: {
    hostName: [komun - namn].skola24.se;
  }
}
```

## [5. Sedan är det dags att hämta schemat](src/app/[kommun]/[skola]/[schema-id]/fetchSchedule.ts)

### Endpoint

```http
POST https://web.skola24.se/api/render/timetable
```

### Headers

| key            | value                                  |
| -------------- | -------------------------------------- |
| `Content-Type` | `application/json`                     |
| `X-Scope`      | `8a22163c-8662-4535-9050-bc5e1923df48` |

### Body

```js
{
  renderKey: "[key ifrån steg 2]",
  selection: "[signatur ifrån steg 1]",
  scheduleDay: "[vecko dag, representerad av en siffra]",
  week: "[vecka]",
  year: "[år]",
  host: "[komun namn]".skola24.se,
  unitGuid: "[unitGuid, ifrån steg 4]",
  schoolYear: "[schoolYear, ifrån steg 3]",
  startDate: null,
  endDate: null,
  blackAndWhite: false,
  width: 125,
  height: 550,
  selectionType: 4,
  showHeader: false,
  periodText: "",
  privateFreeTextMode: false,
  privateSelectionMode: null,
  customerKey: "",
}
```

# 🛜 Hosting

För hosting använder jag [AWS amplify](https://aws.amazon.com/amplify/), med _nästan_ default inställningarna för next.js, jag har bara bytt build imagen till "Amazon Linux:2023 image" och laggt till " - nvm use 18" i build commands. Jag har gjort de ändringarna eftersom den inte ville bygga annars.

# 📚 Projektplan och rapport

Jag valde att bygga detta som ett projekt till kursen "teknik specialisering" (TEKTEK00S) [länk till skolverkets hemsida](https://www.skolverket.se/undervisning/gymnasieskolan/laroplan-program-och-amnen-i-gymnasieskolan/gymnasieprogrammen/program/gymnasieingenjor---vidareutbildning-i-form-av-ett-fjarde-tekniskt-ar;jsessionid=532015DC21C3C52A0D018832804C8BA9?url=-996270488%2Fsyllabuscw%2Fjsp%2Fsubject.htm%3FsubjectCode%3DTEK%26courseCode%3DTEKTEK00S%26lang%3D%26tos%3Dgy&sv.url=12.189c87ae1623366ff3738d9#anchor_TEKTEK00S)

[Läs projektplanen](https://docs.google.com/document/d/1rBdQZsH2nr4DTf1uHy5NT9x7SsOZKTwEdwRVmA8y-Uo/edit?usp=sharing)

[Läs rapporten](https://docs.google.com/document/d/1pqbqXavDd5imzPtROEYdAQcy4M8G9sKpvyfnodd--x8/edit?usp=sharing)

OBS att jag försökte skriva rapporten med lite enklare språk så att även de som inte är insatta i programmering ska fatta.

# 🔮 Framtid

- [ ] Kanske kötta upp reklamer om sidan blir mer populär

- [ ] Kanske bygga ut mitt eget schema vy grej

- [ ] Kanske göra källkoden lite finare, t.ex. lägga till types där det är any
