# När slutar lektionen?

"När slutar lektionen?" Är bland de vanligaste frågorna man ställer i skolan. Detta projekt ska besvara frågan. Det är en relativt enkel webb-app byggd med React och Next.js.

## skola24as API

Skola24as API är odkumenterad så jag var tvungen att "reverse-engeneer"a delar av den, den är skit noga med att skickar headersen, så därför var jag tjungen att ibland använda axios, och ibland fetch.

## Hosting

För hosting använder jag AWS amplify, men _nästan_ default inställningarna för next.js, jag har bara bytt build imagen till "Amazon Linux:2023 image" och laggt till " - nvm use 18" i build commands. Jag har gjort de ändringarna eftersom den inte ville bygga annars.

## TODO

- [ ] BUG FIX: när servern renderar CountDown komponenten så använder den inte samma tid som klienten (jag *tror* att det är fixat nu)
- [ ] Det ska egentligen gå att använda "/" i namn, man behöver bara encode:a namnet _först_, sedan lägga den i URLen
- [ ] Bestäm URL, sedan köp (.net eller .se ???)
- [ ] Bygga ut något "genväg" system som låter dig ha koll på de 5 senaste scheman du kollade på, och dina "favorit"-scheman, och låta dig välja ett "default"-schema, dit ska man bli redirectad om man går till base-url:en. Det blir nog bäst att lagra det i local storage (förutom "default"-schemat), cookies har en gräns på 4000 tecken, och om man lagrar hela adresser så kan det blir mycket.
