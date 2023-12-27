# När slutar lektionen?

"När slutar lektionen?" Är bland de vanligaste frågorna man ställer i skolan. Detta projekt ska besvara frågan. Det är en relativt enkel webb-app byggd med React och Next.js.

OBS: Inte alla scheman fungerar korrekt eftersom att vissa skolor väljer att inte använda skola24s tjänster trots att de har köpt in de.

## Hur man använder appen

### Välj din kommun

![hemskärm](/imgs/readme/pages/homescreen.png "hemskärm")

### Välj din skola

![välj din skola](/imgs/readme/pages/väljskola.png "välj din skola")

### Ange ditt schema id

![ange ditt schema id](/imgs/readme/pages/angeschemaid.png "ange ditt schema id")

### Räkna ner

![count down](/imgs/readme/pages/countdown.png "räkna ner")

### Använd dark mode

![count down i dark mode](/imgs/readme/pages/countdowndark.png "använd dark mode")

### Spara schema i genvägar

![genvägar tomt](/imgs/readme/widgets/genvägar/genvägartomt.png "svara schema i genvägar")

![genvägar te21 tillagt](/imgs/readme/widgets/genvägar/genvägarte21.png "svara schema i genvägar")

## Tech-Stack

### Production dependencies

- **Meta Framework:** Next.js, med app router och server komponenter
- **Styling:** TailwindCSS

### Development dependencies

- **Code Formating:** Prettier, med import-sort-plugin och tailwind-plugin
- **Linting:** ESlint, med inställningarna som Next.js kommer med
- **Språk:** Typescript

## Design Val

### Server komponenter

Appen utnyttjar next.js 14s app router. All data fetching sker med hjälp av de. Det är bara de interaktiva grejerna som är klient komponenter

### Routingen

#### Gammal

Eftersom att backenden och frontend-koden är coupled i nextjs så blir det lite konstigt med dynamiska routes.

**Frontend routen är** "[Komun]/[Skola]/[ShemaID]"

**Backend routen är** "/api/[Komun]/[Skola]/[ShemaID]"

```
bild (genererad med chatGPT) för att illustrera:
+----------------------+   +-------------------------+
|                      |   |                         |
|   [Komun]            |   |   api                   |
|     |                |   |    |                    |
|   [Skola]            |   |   [Komun]               |
|     |                |   |    |                    |
|   [ShemaID]          |   |   [Skola]               |
|                      |   |    |                    |
|   (Frontend logic)   |   |   [ShemaID]             |
|                      |   |                         |
|                      |   |   (Backend logic)       |
+----------------------+   +-------------------------+
```

Routern kan inte veta att "api" inte är ett dynamisk värde för [komun]. Eftersom varje del av "path"en är dynamisk så kan routern bara hitta skilnad på frontend-routen och backend-routen genom att se att backend routen har ett extra slash.

Next.js misslyckas ibland att hitta rätt route, så man får en "fetch failed" error på i dev miljön, men på aws så funkar det.

I praktiken betyder det att frontenden inte kan gå "djupare", alltså den är begränsad till tre sub-directories.

En lösning på detta hade vart att hosta backenden på en seperat server, men då kan frontenden ta längretid att svara.

En annan lösning hade vart att lägga till en statisk route för frontenden, typ "frontend/[Komun]/[Skola]/[ShemaID]", men då kommer url:en vara mycket mindre intuitiv.

En annan lösning hade vart att flytta backenden till en server komponent (vilket jag tror att egentligen borde göra)

#### Ny

Jag tog bort API mappen (typ bara en fil). nu kör jag requestsen i serverkomponenter istället.

## skola24as API

Skola24as API är odkumenterad så jag var tvungen att "reverse-engeneer"a delar av den. Detta gjorde jag med Chrome Dev Tools.

### Vad jag hittade

För att hämta schema ifrån Skola24a behöver man göra fyra api anrop. Dessa kommer ge cors erros om de görs av webläsaren, så man är tjungen att göra de på backenden.

Jag har bara implementerat Älmhult, men det borde vara ganska enkelt att byta komun.

#### [1. Först behöver man hämta en "signatur"](src/utils/scheduleFetching/getSignature.ts)

**Endpoint**: https://web.skola24.se/api/encrypt/signature

**Method**: post

**Headers**:

- "Content-Type": "application/json",
- "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",

**body**:

- "signature" : "[schemaID]"

#### [2. Sedan behöver man hämta "schoolyear"](/src/utils/scheduleFetching/getSchoolYear.ts)

En schoolYear är som en typ av id för läsåret. Varje kommun har ett unikt schoolyear.

**Endpoint**: https://web.skola24.se/api/get/active/school/years

**Method**: post

**Headers**:

- "Content-Type": "application/json",
- "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",

**body**:

- "hostName" : "almhult.skola24.se" //byt ut "almhult" för din komun
- "checkSchoolYearsFeatures" : false

#### [3. Sedan behöver man hämta en "key"](src/utils/scheduleFetching/getKey.ts)

**Endpoint**: https://web.skola24.se/api/get/timetable/render/key

**Method**: post

**Headers**:

- "Content-Type": "application/json",
- "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",

**body**: {}

Denna request fungerar _inte_ med en javascripts fetch, man behöver axios eller något annat. Jag vet inte exakt varför, men jag misstänker att det har med headers att göra.

Bodyn _måste_ inkluderas trots att den är tom

#### [4. Sedan är det dags att hämta schemat](src/app/[kommun]/[skola]/[schema-id]/fetchSchedule.ts)

**Endpoint**: https://web.skola24.se/api/render/timetable

**Method**: post

**Headers**:

- "Content-Type": "application/json",
- "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",

**body**:

- renderKey: ["key", ifrån steg 3],
- selection: ["signatur", ifrån steg 1],
- scheduleDay: [vecko dag, 1 = måndag, 5 = fredag, ger error på 6 och 7, 0 verkar ge hela veckan],
- week: [vecka],
- year: [år],
- host: [kommunens skola24 adress. för Älmhult är det: "almhult.skola24.se"],
- unitGuid: [ett id som representerar "skolan" eller "enheten", för Älmhult är det: "OTU1MGZkNTktZGYzMi1mMTRkLWJhZDUtYzI4YWI0MDliZGU3"],
- schoolYear: [värdet ifrån steg 2],
- startDate: null,
- endDate: null,
- blackAndWhite: false,
- width: 125,
- height: 550,
- selectionType: 4,
- showHeader: false,
- periodText: "",
- privateFreeTextMode: false,
- privateSelectionMode: null,
- customerKey: "",

Se källkoden för att få "unitGuid" för din skola, och andra detailer.

Här är min implementation av API anropen:

[Mapp med util funktioner för att hämta "pussel bitarna" (signatur och key)](src/utils/scheduleFetching)

[Fil som sätter ihop "pussel bitarna"](src/app/[kommun]/[skola]/[schema-id]/fetchSchedule.ts)

## Hosting

För hosting använder jag AWS amplify, med _nästan_ default inställningarna för next.js, jag har bara bytt build imagen till "Amazon Linux:2023 image" och laggt till " - nvm use 18" i build commands. Jag har gjort de ändringarna eftersom den inte ville bygga annars.

## Projektplan and rapport

Jag valde att bygga detta som ett projekt till kursen "teknik specialisering" (TEKTEK00S) [länk till skolverkets hemsida](https://www.skolverket.se/undervisning/gymnasieskolan/laroplan-program-och-amnen-i-gymnasieskolan/gymnasieprogrammen/program/gymnasieingenjor---vidareutbildning-i-form-av-ett-fjarde-tekniskt-ar;jsessionid=532015DC21C3C52A0D018832804C8BA9?url=-996270488%2Fsyllabuscw%2Fjsp%2Fsubject.htm%3FsubjectCode%3DTEK%26courseCode%3DTEKTEK00S%26lang%3D%26tos%3Dgy&sv.url=12.189c87ae1623366ff3738d9#anchor_TEKTEK00S)

[Läs projektplanen](https://docs.google.com/document/d/1rBdQZsH2nr4DTf1uHy5NT9x7SsOZKTwEdwRVmA8y-Uo/edit?usp=sharing)

[Läs rapporten](https://docs.google.com/document/d/1pqbqXavDd5imzPtROEYdAQcy4M8G9sKpvyfnodd--x8/edit?usp=sharing)

OBS att jag försökte skriva rapporten med lite enklare språk så att även de som inte är insatta i programmering ska fatta.