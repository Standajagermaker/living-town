# Living Town — v0.8.0

Dvoujazyčné živé městečko (CZ/DE), Next.js.

## Herní smyčka
- Domov: jídlo, lednička, televize, knihovna, spánek a energie; nákup zásob, opakované placení nájmu.
- Zaměstnání: pravidelné směny, mzda, absence a reakce náladového šéfa.
- Vzdělávání: půjčování knih, čtení doma a přenocování před vrácením; malé znalostní kvízy; Mindset roste bez pevného limitu. Rozvoj není samostatně prozrazeným úkolem.
- Sezóny: automatické změny podle herních dní místo čtyř přepínacích dlaždic, obchod s oblečením a vybavením.
- Cestování: procházky, výlety do hor, restaurace a dovolená s požadovanými úsporami alespoň 2 000 €.
- 50 fiktivních obyvatel má vlastní rozvrhy, temperament, nálady a dovolené. V horách nebo restauraci můžeš potkat další postavy.
- Rozhovory: nabídky navazují na konkrétní téma, položené otázky mizí, vždy se lze slušně rozloučit.
- Sociální vazby: důvěra a sympatie se budují postupně; kontakt musí hráč vyžádat a druhý člověk nemusí souhlasit. Zprávy či pokus o zavolání mohou dostat odpověď až později; soukromé domovy nejsou automaticky přístupné.
- Telefon: události s maximálně dvěma rezervacemi za den a účastí na místě.

## Rozvoj
Pro další verze zůstávají zásadní serverový sdílený svět, skutečný multiplayer, robustní LLM-dialogy, ověřování konzistence stavů a bohatší výtvarná grafika.

## Nasazení
```sh
npm install
npm run build
npm run dev
```
Ve Vercelu můžeš volitelně nastavit serverovou `OPENAI_API_KEY`. Nikdy ji nesdílej v GitHubu ani neukládej do proměnných `NEXT_PUBLIC_`.

## Omezení
Stav je stále uložený v prohlížeči přes localStorage; hra dosud neběží na serveru 24 hodin denně. Zprávy se doručují podle herního času při dalších akcích, ne prostřednictvím autonomní notifikační služby. Bez AI klíče rozhovory používají pravidlové reakce. Grafické lokace jsou ilustrativní.
