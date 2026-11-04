# Living Town – Pilot 004

Interaktivní prototyp společenského městečka v **češtině a němčině**, vytvořený v Next.js. Stav se ukládá lokálně v prohlížeči (localStorage). AI dialogy, společný serverový svět a multiplayer **zatím nejsou připojeny**.

## Co lze hrát

- Začínáš doma; od začátku máš známé zaměstnání. Před domem je ulice, soused se psem a pekárna.
- Horní navigace je stále viditelná a ukazuje současnou lokaci a dostupné cesty. Z interiérů lze vyjít na ulici.
- Každé NPC má vlastní historii rozhovorů; další setkání navazuje na předchozí informace. Slušné rozloučení lze zvolit vždy během dialogu. Po opakování stejné otázky postava reaguje na opakování.
- Otázky ve volbách se po položení skryjí. Po vlastní textové zprávě se nabídnou návazné reakce. Neznámé formulace mají variabilní, **pravidlové** reakce; nejedná se o plnohodnotné porozumění AI.
- Osobní mapa odkrývá známé lokace včetně míst doporučených během rozhovoru.
- Aktivity odemykají mise. V knihovně lze číst krátký text o naslouchání nebo o posuzování informačních zdrojů, což po dočtení přidá Mindset (maximálně jednou za herní den pro každý typ aktivity).
- Peněženka (začátek 85 €), nákup preclíku (2,50 €), práce (45 € za směnu), pracovní absence, výstraha a možnost propuštění. Opakované hrubé chování vůči nadřízenému má také herní důsledky.
- Přepínač CZ/DE mění rozhraní a připravené NPC repliky; historie NPC ukládá obě jazykové verze. Hráčův vlastní text se nepřekládá.
- Telefon s oznámeními, kontakty a deníkem.

## Vyzkoušení

1. Nainstaluj Node.js 20.9+.
2. Spusť `npm install` a `npm run dev`.
3. Otevři `http://localhost:3000`.
4. Pro veřejné nasazení připoj GitHub repozitář `Standajagermaker/living-town` do Vercelu.

Tato lokální verze nepotřebuje žádné API klíče. Prozatímní soubory `.env.example` a `.gitignore` jsou na GitHubu.

## Supabase (příprava)

Soubor `supabase/001_initial.sql` je počáteční návrh datového modelu, ale **frontend Pilot 004 ještě Supabase nepoužívá**. Nové lokální herní stavy (Mindset, zaměstnání, mise, individuální historie dialogů) bude třeba později promítnout i do serverového schématu. Nikdy nezveřejňuj secret/service-role klíče pod prefixem `NEXT_PUBLIC_`.

## Omezení prototypu

Všechny události a NPC jsou zatím lokálně simulované. Hra neběží sama na serveru 24/7, neobsahuje autentizaci, trvalou sdílenou databázi ani generativní LLM. Odpovědi na zcela volný text jsou variabilní podle kontextu, ale nedokážou spolehlivě pochopit libovolný význam. Pro produkční hru bude potřeba serverově řízený stav a bezpečnostní pravidla.

**Nasazení:** změny v tomto repozitáři samy o sobě neprokazují, že Vercel build proběhl úspěšně.
