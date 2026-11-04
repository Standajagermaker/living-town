# Living Town – pilot 001

**Hratelný první den** v nově založeném městečku. Mobilní Next.js aplikace v češtině, s jednoduchými německými dialogy. Bez poplatků za AI: odpovědi zatím poskytuje lokální pravidlový engine.

## Co už funguje
- Scéna před domem s krabicemi, mužem se psem a pekárnou.
- Klikací postavy a budovy, dialogové volby a vlastní text.
- Lokální herní čas, pohyb mezi lokacemi, mapa s neobjeveným náměstím.
- Telefon: oznámení, kontakty a deník.
- Stav se ukládá do `localStorage` aktuálního prohlížeče.
- SQL migrace pro budoucí sdílený svět a bezpečné soukromé údaje.

**Zatím NEfunguje:** skutečný multiplayer, nepřetržité autonomní NPC, autentizace, generativní AI a cloudová synchronizace. Ty vyžadují serverové API a další vývoj. Nejde o hotovou multiplayerovou hru.

## 1. Spuštění na počítači
Nainstaluj Node.js 20.9+ (doporučeno Node 22). Potom:

```bash
npm install
npm run dev
```

Otevři http://localhost:3000 . Na mobilu nejdřív použij veřejné nasazení na Vercelu.

## 2. GitHub
1. Na github.com založ nový **soukromý** repozitář, např. `living-town`.
2. Nahraj obsah tohoto ZIPu do kořene repozitáře (ne samotnou vnořenou složku).
3. Soubor `.env.local` ani žádné API klíče do GitHubu nenahrávej.

Případně z terminálu:

```bash
git init
git add .
git commit -m "Initial playable Living Town pilot"
git branch -M main
git remote add origin https://github.com/TVUJ-UCET/living-town.git
git push -u origin main
```

## 3. Vercel
1. Přihlas se do Vercelu.
2. `Add New > Project` a vyber repozitář `living-town`.
3. Framework Next.js se rozpozná automaticky.
4. Stiskni `Deploy`.
5. Pro tuto první offline-verzi **nejsou potřeba žádné environment variables**.

## 4. Supabase
1. Vytvoř samostatný projekt, např. `living-town`.
2. Otevři `SQL Editor > New query`.
3. Vlož celý obsah `supabase/001_initial.sql` a klikni na `Run`.
4. V `Table Editor` uvidíš `worlds`, `locations`, `npcs`, `player_profiles`, `player_discoveries`, `npc_knowledge`, `world_events`, `dialogue_turns` a další.
5. Tabulky se vytvoří nezávisle na aplikaci. **Aktuální frontend se k nim ještě nepřipojuje.**

**Bezpečnost:** RLS je ve výchozím nastavení uzamčené, přímý přístup hráčů k soukromým NPC polím není povolen. Zápisy do herních stavů bude později provádět validující serverové API.

## 5. Další implementační balík
1. Supabase Auth (nejprve email / magic link), uživatelský profil.
2. `POST /api/move` – serverem potvrzený pohyb a viditelnost NPC.
3. `POST /api/dialogue` – serverová kontrola kontextu a AI generování.
4. Supabase Realtime – sdílená přítomnost hráčů a události v okolí.
5. Worker / cron – autonomní události 50 NPC i při nulové návštěvnosti.
6. Samostatné tabulky pro NPC rozvrhy, vztahy, rezervace a oprávnění multiplayer chatu.

## Poznámka k vizuálu
Aktuální ulice je **jednoduchá CSS scéna**, aby šla snadno spustit a upravovat. Další krok bude nahradit ji ilustrovanými 2D/2.5D vrstvami s pohybující se kamerou, skutečnou mlhou a animacemi postav. **Žádné číslované budovy na mapě.**
