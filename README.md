# Sonnenthal – Living Town v0.5.0

Živé městečko / Lebendige Kleinstadt

## Změny v0.5.0

- Přesné verzování `v0.5.0` v hlavičce a `package.json`; výraz „pilot“ se v novém rozhraní nepoužívá.
- Nová výrazně stylizovaná webová grafika: velká ilustrativní mapa s mlhou a odemykanými budovami, samostatný perspektivní pohled hráče, sezónní vzhled, panel dialogu a virtuální telefon.
- 50 originálních fiktivních obyvatel v `lib/residents.ts`, každý s vlastním temperamentem, hodnotami, zaměstnáním, případně vedlejší prací, rozvrhem a dovolenou. Místo, kde jsou, se přepočítává podle herního dne a hodiny, takže se například střídají lidé v pekárně.
- Historie rozhovorů se ukládá pro každého obyvatele zvlášť. Již položené nabídnuté otázky mizí, přibývají návazné volby. Kdykoliv lze odejít.
- Dialogy mohou být generované modelem OpenAI, **pokud je nastavena serverová proměnná `OPENAI_API_KEY`**. Bez klíče funguje lokální pravidlový engine. Každá odpověď modelu obsahuje oddělenou českou a německou variantu.
- Mindset **nemá horní limit**. Rozvíjí se čtením naučných textů a za správné odpovědi v mini-kvízech; každá konkrétní kvízová otázka odměňuje pouze poprvé.
- Práce a peněženka: zaměstnání od startu, směny, výdělek, absence a možné propuštění.
- Průběžně viditelná navigace, fungující návrat z interiérů a osobní mapa s doporučeními.

## Spuštění

```bash
npm install
npm run dev
```

Otevři http://localhost:3000. Pro Vercel připoj repozitář `Standajagermaker/living-town`. Přepínání CZ/DE je v horní liště.

## Volitelné AI dialogy

Ve **Vercel > Project > Settings > Environment Variables** nastav:

- `OPENAI_API_KEY`: vlastní API klíč, pouze server-side.
- `OPENAI_DIALOGUE_MODEL`: volitelně `gpt-4.1-mini`.

Potom spusť nový deployment. Klíč **nikdy** nevkládej do GitHubu, do `NEXT_PUBLIC_` proměnných ani do `.env.example`. Backend vystupuje jako konkrétní NPC s odlišnou povahou, náladou a hodinou. Mimo nastavený klíč vše funguje bez placeného API.

## Co zatím není hotové

- 50 NPC má deterministicky simulované rozvrhy, ale **neběží 50 nepřetržitě aktivních AI agentů**. Model se volá pouze při rozhovoru, pokud je nakonfigurován.
- Stav a historie jsou zatím pouze v `localStorage` konkrétního prohlížeče; nepřetržitý 24/7 server, skutečný multiplayer a společná autoritativní databáze přijdou později.
- Sezónní tlačítka přepínají zatím ilustrativní podoby města; nejde o napojení na reálné počasí.
- Portréty obyvatel jsou prozatím jednoduché symbolické avatary. Výtvarná kvalita se bude dále rozpracovávat podle požadované grafické předlohy.
- Návštěvy a dialogy modelu se zatím ověřují vůči lokálnímu klientskému stavu; před produkčním provozem je třeba zavést serverově potvrzovanou přítomnost, RLS a robustní omezení požadavků.
- SQL soubory `supabase/` jsou návrh budoucího backendu. Tato verze nepoužívá živé Supabase spojení.

## Verzování

- v0.1 – první rozhovory na ulici
- v0.2 – jazyk, mapa, peněženka a cíle
- v0.3 – paměť otázek, doporučené lokace
- v0.4 – mise, navigace, práce a Mindset
- **v0.5.0 – nová vizuální koncepce, 50 obyvatel, rozvrhy, volitelné AI dialogy a znalostní výzvy**

Další plánovaný milník: v0.6.0 – bezpečná serverová perzistence, NPC vztahy a společný čas světa.
