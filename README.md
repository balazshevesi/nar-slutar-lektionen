# När slutar lektionen?

"När slutar lektionen?" Är bland de vanligaste frågorna man ställer i skolan. Detta projekt ska besvara frågan. Det är en relativt enkel webb-app byggd med React och Next.js.

## Stack

### Production dependencies

- **Meta Framework:** Next.js, med app router och server komponenter
- **Styling:** TailwindCSS

### Development dependencies

- **Code Formating:** Prettier, med import-sort-plugin och tailwind-plugin
- **Linting:** ESlint, med inställningarna som Next.js kommer med
- **Språk:** Typescript

## Design Val

### Server komponenter

Appen utnyttjar next.js 14s app router. Appen har bara tre client komponenter, det är för att de _måste_ vara client side. Det är

- "FavNav" (genvägarna)
- "CountDownTimer" (timern)
- "AngeSchemaID" (sök-input).

### Routingen

Eftersom att backenden och frontend-koden är coupled i nextjs så blir det lite konstigt med dynamiska routes.

**Frontend routen är** "[Komun]/[Skola]/[ShemaID]"

**Backend routen är** "/api/[Komun]/[Skola]/[ShemaID]"

bild (genererad med chatGPT) för illustrera:

```
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

## skola24as API

Skola24as API är odkumenterad så jag var tvungen att "reverse-engeneer"a delar av den. Detta gjorde jag med Chrome Dev Tools.

### Vad jag hittade

För att hämta schema ifrån Skola24a behöver man göra tre api anrop. Dessa kommer ge cors erros om de görs av webläsaren, så man är tjungen att göra de på backenden. [Min end point](src/app/api/[kommun]/[skola]/[schema-id]/route.ts)

Jag har bara implementerat Älmhult, men det borde vara ganska enkelt att byta kommun.

#### [1. Först behöver man hämta en "signatur"](src/app/api/utils/getSignature.ts)

**Endpoint**: https://web.skola24.se/api/encrypt/signature

**Method**: post

**Headers**:

- "Content-Type": "application/json",
- "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",

**body**:

- "signature" : "[schemaID]"

#### [2. Sedan behöver man hämta en "key"](src/app/api/utils/getKey.ts)

**Endpoint**: https://web.skola24.se/api/get/timetable/render/key

**Method**: post

**Headers**:

- "Content-Type": "application/json",
- "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",

**body**: {}

Denna request fungerar _inte_ med en javascripts fetch, man behöver axios eller något annat. Jag vet inte exakt varför, men jag misstänker att det har med headers att göra.

Bodyn _måste_ inkluderas trots att den är tom

#### [3. Sedan är det dags att hämta schemat](src/app/api/utils/getTimetable.ts)

**Endpoint**: https://web.skola24.se/api/render/timetable

**Method**: post

**Headers**:

- "Content-Type": "application/json",
- "X-Scope": "8a22163c-8662-4535-9050-bc5e1923df48",

**Body**:

- renderKey: ["key", ifrån steg 2],
- selection: ["signatur", ifrån steg 1],
- scheduleDay: [vecko dag, 1 = måndag, 5 = fredag, ger error på 6 och 7],
- week: [vecka],
- year: [år],
- host: [kommunens skola24 adress. för Älmhult är det: "almhult.skola24.se"],
- unitGuid: [ett id som representerar "skolan" eller "enheten", för Älmhult är det: "OTU1MGZkNTktZGYzMi1mMTRkLWJhZDUtYzI4YWI0MDliZGU3"],
- schoolYear: [jag *tror* att det ska vara ett hård-kodat värde: "bb76aa4b-03d4-4c97-83ca-5dc08bd00b1c"],
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

- [getUnitGuidFromSkola.ts](src/app/api/utils/getUnitGuidFromSkola.ts)

## Hosting

För hosting använder jag AWS amplify, med _nästan_ default inställningarna för next.js, jag har bara bytt build imagen till "Amazon Linux:2023 image" och laggt till " - nvm use 18" i build commands. Jag har gjort de ändringarna eftersom den inte ville bygga annars.

## TODO

- [ ] Standardisera layouted med componenter typ
- [ ] Bestäm URL, sedan köp (.net eller .se ???)
- [ ] Fixa finare loading screens
- [ ] Fixa bread crums så att den är med i layout.tsx, för snyggare loading states
- [ ] Write tests g (bruhhhh dunno howw?)

- [x] Fixa så att det händer nått när countdownen når 0 (typ ladda om fliken)
- [x] Fixa så att man kan flytta favoriterna upp och ner
- [x] Make folder structure better
- [x] Fix local storage ssr stuffs (fixed by diabling ssr)
- [x] BUG fix servern är fuckaddd (funkar på render dock??, kanske borde setta upp nån api som jag kan "logga till" eftersom det typ är omöjligt att logga på amplify) (bug med date objekt)
- [x] BUG FIX: när servern renderar CountDown komponenten så använder den inte samma tid som klienten (jag _tror_ att det är fixat nu, på render borde det fungera)
- [x] Det ska egentligen gå att använda "/" i namn, man behöver bara encode:a namnet _först_, sedan lägga den i URLen
- [x] Bug fix "/" i bread crums nav
- [x] Fix prettier config, add import sort
- [x] Bygga ut något "genväg" system som låter dig ha koll på de 5 senaste scheman du kollade på, och dina "favorit"-scheman, och låta dig välja ett "default"-schema, dit ska man bli redirectad om man går till base-url:en. Det blir nog bäst att lagra det i local storage (förutom "default"-schemat), cookies har en gräns på 4000 tecken, och om man lagrar hela adresser så kan det blir mycket.

```

```
