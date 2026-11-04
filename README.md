# Little Elsewhere · v0.6.0

Dvoujazyčné (CZ/DE) živé městečko, Next.js.

## Vlastnosti
- 50 fiktivních obyvatel s rozvrhy, dovolenou, vedlejší prací a měnícím se rozpoložením.
- Osobní mapa s postupně objevenými místy a možností skočit přímo na doporučenou lokaci.
- Domácí život: lednička, televize, postel, knihovna, jídlo a energie; nákupy v supermarketu.
- Knihovna: půjčit knihu, přečíst doma, přespat a následně vrátit. Odměna Mindset až po tom všem.
- Telefon: události v kalendáři, zápis nejvýše na dvě akce za herní den, účast a setkávání s obyvateli.
- Nové lokace: supermarket, kavárna, park, kostel, hotel a fitness; objevování a drobné humorné události.
- Práce: výdělek, absence, náladový šéf a riziko postihu při dlouhém používání telefonu v práci.
- Volitelné AI rozhovory s oddělenými českými a německými variantami; vlastní historie pro každého NPC.
- Postupně odemykané úkoly a krátké znalostní kvízy.

## Spuštění

```sh
npm install
npm run build
npm run dev
```

## Volitelné AI odpovědi
Vercel → Settings → Environment Variables: `OPENAI_API_KEY`, případně `OPENAI_DIALOGUE_MODEL`. Tajné klíče nikdy nevkládejte do GitHubu ani do `NEXT_PUBLIC_`.

## Současná omezení
Jde o klientskou simulaci s uložením do localStorage. Neexistuje ještě společný serverový 24/7 čas, multiplayer ani serverově garantovaná historie. Reakce bez API klíče používají pravidla, nikoli generativní AI. Vizuální mapa je stylizovaný prototyp, ne finální podrobný 3D svět.

## Verze
- v0.5.0: grafická mapa, 50 NPC, dialogy, kvízy.
- v0.6.0: denní život, knihy, události, objevování, práce a nový název.
