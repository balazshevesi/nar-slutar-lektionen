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

## skola24as API

Skola24as API är odkumenterad så jag var tvungen att "reverse-engeneer"a delar av den, den är skit noga med att skickar headersen, så därför var jag tjungen att ibland använda axios, och ibland fetch.

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
