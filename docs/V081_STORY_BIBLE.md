# Living Town v0.8.1 — Story Bible / Release Prep

## No more accidental deploy storms
- Work on a single branch, one integration commit when the version is genuinely ready.
- If Vercel is connected to the working branch, even that one push may trigger one preview build. A production release must be authorized separately.
- CI must pass `npm ci && npm run build`, then test saved-game migration and realistic day transitions.
- Vercel's successful preview build does not prove game balance or story continuity; do a playable QA run.

## Core philosophy
A living city is an interconnected society, not a collection of 50 vending-machine NPCs. Choices carry persistent consequences; people have their own obligations, moods and relationships; not every problem requires an intervention. The player knows only events actually seen or communicated. A rare comic payoff emerges days later. No transparent quest markers for hidden relationships.

## Friendship: the soft ceiling of attention
- Roughly 5–10 close simultaneous relationships, not a hard numerical maximum. Each bond has trust, warmth, preferred contact intervals, initiative, reliability and separate autonomy.
- Unreturned messages, forgotten promises and repeated canceled meetings may erode closeness; one missed call does not terminate a friendship. NPCs also cancel.
- Reserved friends tolerate longer quiet periods. Active social overload affects the ability to maintain a large network.
- An ex-friend can be approached politely but may decide not to rebuild closeness. Reconciliation needs consistent actions.
- Never invent prior memories: a callback must reference a persistent event ID that happened in this saved game.

## Character aging and first impressions
- Approximate visible age by decade, such as 20–30 or 50–60; identity, exact age and job remain hidden until discovered.
- Asymmetrical conversational cues: younger characters may perceive experience or authority, older ones may offer guidance, near-age peers may be shy; temperament always overrides stereotypes.
- Physical stamina changes gradually with age, fitness, health and recovery; a fit senior may outperform a tired young adult.
- A single optional crush may emerge from actual shared events, with age-appropriate peer feelings for teens. Adult romance only among adults; never assume consent, and workplace romance has consequences.

## Story engines
- Each place is independently authored with time-of-day and seasonal variants.
- Hospital: reception, medical staff, triage, night shift, outpatient queue, delayed diagnosis, follow-up. A healthy player may ignore it for weeks.
- School: lessons, exams, homework, classmates, adult evening courses, conflicting obligations. No adult romance with minors.
- Clinic/GP: routine prevention, exhaustion, sleep, basic illness; not every visit is a dramatic disaster.
- Restaurant: always-on waitress during opening hours, callable chef/owner; private romantic triangle discovered indirectly; gossip remains unverified.
- Church: fixed priest plus occasional transient tourist; deliberately quiet.
- Supermarket: chance known-person encounters, recommendations and helping with fallen groceries.
- Train station: delays produce stranger dialogue, missed connections, missed work meetings, or hotel check-in problems; resolve through notice, negotiation or improvisation.
- Home: empty walls hint at furniture shopping; rents, bills, leaks, shared lives, pets and moves.
- Theater: stand-up, improv and chamber play with a payoff, not one generic button.
- Outdoor scenes: rain limits visible outdoor NPCs to 0–1; residents shelter inside.
- Exploration should not reveal a new destination every click.

## Economy and choices
- Time, wallet, age, vacation days, mindset, stress, long-term health, current energy, hunger and relationships are interconnected resources.
- Full-time employment, side jobs and freelance work affect pay, time, taxes, stress, attendance and reputation.
- Monthly rent/utilities arrive on the first of the game month. Tax notice, fines, car tax and insurance need due dates and payment history.
- Used car dealer versus expensive new cars, fuel station, maintenance, car-versus-public-transport time and cost trade-offs.
- Phone app store: virtual stock market with genuine possibility of losses; classifieds; age-gated dating; optional town forum.
- Casino and scratch cards are fictional-money, age-gated, negative expected value and do not offer an easy earnings loop.
- Pets require food, care and for dogs daily walking; an animal is a continuing responsibility.
- Life span approximately 80–95 in game years, dependent probabilistically on health and chance, not a guaranteed effect of sports.
- Satisfaction is not just maximizing money; money has diminishing marginal benefit. Knowledge can change expectations without being intrinsically harmful.

## Open gaps (intentionally not advertised as finished)
- Stock trading, dealership, fuel station, cinema, furniture retailer and advanced tax UI need dedicated mechanics and QA; the narrative contract above is a design specification, not a deployed implementation.
- Advanced autonomous NPC romance, family progression and irreversible break-ups need cross-day event scheduling and testing.
- Imported ten high-quality first-person WebP illustrations are not yet in repository; default SVG fallback must remain.
- Release only after successful build; do not call v0.8.1 production until verified on Vercel.
