import type {TownState} from './world';
import {addTime} from './life';
import {byId} from './residents';
import type {Place} from './game';

export type NarrativeChoice={id:string;cs:string;de:string;resultCs:string;resultDe:string;minutes:number;money?:number;energy?:number;mindset?:number;stress?:number;followCs?:string;followDe?:string;followAfter?:number};
export type NarrativeScene={id:string;place:Place;cs:string;de:string;choices:NarrativeChoice[];minAge?:number;minDay?:number;time?:'day'|'night';rare?:boolean;};
const ch=(id:string,cs:string,de:string,resultCs:string,resultDe:string,minutes:number,extra:Partial<NarrativeChoice>={}):NarrativeChoice=>({id,cs,de,resultCs,resultDe,minutes,...extra});
export const livingStories:NarrativeScene[]=[
 {id:'hospital-queue',place:'hospital',cs:'V čekárně se ozve: „Jsem tu už dvě hodiny. Jestli to bude trvat déle, začnu tu platit nájem.“ Sestra vysvětluje, že akutní případy mají přednost.',de:'Ein Patient sagt: „Ich warte seit zwei Stunden. Bald zahle ich hier Miete.“ Die Schwester erklärt, dass Notfälle Vorrang haben.',choices:[
 ch('queue-calm','Zeptám se na čekací dobu.','Nach der Wartezeit fragen.','Sestra ti dá přibližný termín. Nemusíš být spokojený, ale víš, na čem jsi.','Du erfährst die ungefähre Wartezeit.',12,{stress:-3,mindset:1}),
 ch('queue-talk','Dám se do řeči s čekajícím.','Mit dem Wartenden sprechen.','Stěžování se změní ve veselý rozhovor. Překvapivě vám to oběma zlepší náladu.','Aus der Beschwerde wird ein nettes Gespräch.',20,{stress:-4,followCs:'V kavárně tě někdo zdraví: „My se známe z nemocnice, že?“',followDe:'Im Café grüßt dich jemand: „Wir kennen uns aus dem Krankenhaus, oder?“',followAfter:3}),
 ch('queue-rude','Rozčílím se kvůli pořadí.','Mich über die Reihenfolge ärgern.','Sestra odpoví: „Vy nevíte, kvůli čemu jsou tu ostatní.“ A má pravdu.','Die Schwester sagt: „Sie kennen die Gründe der anderen nicht.“',9,{stress:10})]},
 {id:'hospital-night',place:'hospital',time:'night',rare:true,cs:'Noční sestra před automatem stiskne espresso. Automat jí vydá čaj. „Aspoň tady má někdo vlastní názor,“ poznamená.',de:'Die Nachtschwester bestellt Espresso, bekommt aber Tee. „Wenigstens hat hier jemand eine eigene Meinung“, sagt sie.',choices:[
 ch('night-joke','To je automat s charakterem.','Der Automat hat Charakter.','Sestra se zasměje. Dlouhá směna je na okamžik snesitelnější.','Die Schwester lacht. Für einen Moment ist der Dienst leichter.',10,{stress:-4}),
 ch('night-help','Nabídnu jí svoji kávu.','Meinen Kaffee anbieten.','Poděkuje, ale odmítne. „Vy ji potřebujete možná víc.“','Sie bedankt sich und lehnt freundlich ab.',8,{mindset:1}),
 ch('night-leave','Nechám ji v klidu.','Sie in Ruhe lassen.','Sestra ti kývne na pozdrav a pokračuje v práci.','Sie nickt und arbeitet weiter.',4,{stress:-1})]},
 {id:'hospital-flowers',place:'hospital',rare:true,cs:'Na recepci stojí květiny s kartičkou „Promiň“. Nikdo neví, komu patří. Recepční tě požádá, abys je nepřemisťoval.',de:'An der Rezeption stehen Blumen mit der Karte „Entschuldigung“. Niemand weiß, für wen sie sind.',choices:[
 ch('flowers-wait','Nebudu zasahovat.','Nicht eingreifen.','Večer si je vyzvedne starší žena. Jen se usměje a nic nevysvětlí.','Am Abend holt sie eine ältere Frau ab und lächelt.',6,{mindset:1}),
 ch('flowers-ask','Zeptám se na příběh.','Nach der Geschichte fragen.','Recepční pokrčí rameny: „Někdy je lepší nevědět úplně všechno.“','„Manchmal muss man nicht alles wissen“, sagt die Rezeptionistin.',7,{mindset:2}),
 ch('flowers-photo','Vyfotím kartičku.','Die Karte fotografieren.','Recepční tě upozorní, že soukromí pacientů má přednost. Fotku smažeš.','Die Rezeptionistin erinnert dich an die Privatsphäre.',8,{stress:3})]},
 {id:'hospital-fatigue',place:'hospital',minDay:2,cs:'Praktický lékař se zeptá: „Spíte dost?“ Podle tvého výrazu už skoro zná odpověď.',de:'Der Hausarzt fragt: „Schlafen Sie genug?“ Dein Gesicht verrät fast die Antwort.',choices:[
 ch('fatigue-truth','Přiznám, že často spím málo.','Zugeben, dass ich wenig schlafe.','Lékař ti doporučí pravidelný režim. Nezní to převratně, ale bývá to těžší než další káva.','Der Arzt empfiehlt einen regelmäßigen Schlafrhythmus.',25,{mindset:2,stress:-3,followCs:'Po několika klidnějších nocích zjistíš, že i obyčejný den může být příjemnější.',followDe:'Nach einigen ruhigeren Nächten merkst du, wie gut ein normaler Tag sein kann.',followAfter:4}),
 ch('fatigue-joke','Řeknu, že spím mezi kávami.','Sagen, ich schlafe zwischen Kaffeezeiten.','Doktor: „Výborně. Teď ještě zkusíme spát mezi večerem a ránem.“','„Gut. Probieren wir es noch zwischen Abend und Morgen“, sagt er.',12,{mindset:1}),
 ch('fatigue-go','Kontrolu odložím.','Den Termin verschieben.','Doktor ti vysvětlí, že můžeš přijít jindy. Únava ale sama nezmizela.','Der Arzt sagt, du kannst wiederkommen. Die Müdigkeit bleibt.',6,{stress:3})]},
 {id:'hospital-document',place:'hospital',cs:'U recepce nemohou najít tvůj záznam. Zjistíš, že někdo napsal špatné číslo domu.',de:'An der Anmeldung ist dein Datensatz verschwunden. Die Hausnummer wurde falsch eingetragen.',choices:[
 ch('doc-calm','Společně opravíme údaje.','Die Daten gemeinsam korrigieren.','Sestra děkuje za trpělivost. Teď už tě najdou i bez detektivní práce.','Die Schwester bedankt sich. Jetzt wird deine Akte gefunden.',18,{stress:-2}),
 ch('doc-blame','Vyčtu jim jejich chybu.','Den Fehler vorwerfen.','Sestra se omluví, ale papíry se tím samy neopraví.','Sie entschuldigt sich, doch die Daten bleiben falsch.',12,{stress:5}),
 ch('doc-check','Zkontroluji i další údaje.','Auch andere Angaben prüfen.','Najdeš ještě jeden překlep. Poprvé se vyplatilo být puntičkář.','Du findest noch einen Tippfehler. Genauigkeit lohnt sich.',24,{mindset:2})]},
 {id:'hospital-first-aid',place:'hospital',cs:'Záchranář tě žádá, abys uvolnil průchod. Za chvíli se usměje: „Díky. Někdy je nejlepší pomoc nepřekážet.“',de:'Ein Sanitäter bittet dich, Platz zu machen. „Danke. Manchmal hilft man am besten, indem man nicht im Weg steht.“',choices:[
 ch('aid-move','Rychle uvolním cestu.','Sofort Platz machen.','Záchranáři mohou bez zdržení pokračovat.','Das Team kann ungehindert weiterarbeiten.',3,{mindset:1}),
 ch('aid-ask','Zeptám se, zda potřebuji něco udělat.','Fragen, ob ich helfen kann.','Odpoví, že všechno potřebné mají. Poděkuje za ochotu.','Sie haben alles Nötige und danken trotzdem.',5,{mindset:1}),
 ch('aid-observe','Budu tiše čekat stranou.','Leise zur Seite treten.','Po chvíli se čekárna vrátí ke svému tempu.','Bald kehrt Ruhe in den Warteraum zurück.',8,{stress:-2})]},
 {id:'school-first',place:'school',cs:'Ve třídě si někdo sedl na tvé místo. „Myslel jsem, že tu není zasedací pořádek,“ řekne rozpačitě.',de:'Jemand sitzt auf deinem Platz. „Ich dachte, hier gibt es keine Sitzordnung“, sagt er verlegen.',choices:[
 ch('seat-share','Posadím se vedle něj.','Mich daneben setzen.','Za chvíli si začnete půjčovat poznámky. První známý vznikne bez představování.','Ihr tauscht bald Notizen aus.',12,{mindset:1}),
 ch('seat-ask','Zdvořile se zeptám na místo.','Höflich nach dem Platz fragen.','Omluví se a usměje se. Celá záležitost trvala deset vteřin.','Er entschuldigt sich. Alles ist schnell geklärt.',5,{stress:-1}),
 ch('seat-scold','Začnu se přít o židli.','Über den Stuhl streiten.','Učitel přinese další židli. Konflikt se stává zbytečnou historkou.','Der Lehrer bringt einen weiteren Stuhl.',15,{stress:5})]},
 {id:'school-exam',place:'school',minDay:2,cs:'Před testem všichni tvrdí, že se nic nenaučili. Pak někdo vytáhne třicet stran vlastních poznámek.',de:'Vor der Prüfung behaupten alle, nichts gelernt zu haben. Dann holt jemand dreißig Seiten Notizen hervor.',choices:[
 ch('exam-learn','Ještě si zopakuji hlavní pojmy.','Die wichtigsten Begriffe wiederholen.','Nezaručilo to jedničku, ale otázky najednou dávají větší smysl.','Die Fragen ergeben plötzlich mehr Sinn.',35,{mindset:5,energy:-5}),
 ch('exam-calm','Půjdu do testu bez paniky.','Ruhig in die Prüfung gehen.','Po testu zjistíš, že ses obával hlavně představy selhání.','Nach dem Test merkst du, dass die Angst größer war.',20,{mindset:2,stress:-4}),
 ch('exam-cheat','Pokusím se opisovat.','Versuchen abzuschreiben.','Učitel si toho všimne. Příště si musíš důvěru získat zpátky.','Der Lehrer bemerkt es. Vertrauen muss neu wachsen.',12,{stress:12})]},
 {id:'school-evening',place:'school',minAge:18,time:'night',cs:'Večerní kurz má nečekaný problém: lektor zapomněl prezentaci. „Dnes budeme improvizovat,“ oznámí.',de:'Im Abendkurs hat der Dozent seine Präsentation vergessen. „Heute improvisieren wir“, sagt er.',choices:[
 ch('evening-help','Nabídnu vlastní poznámky.','Eigene Notizen anbieten.','Vznikne spontánní diskuse a ostatní se tě začnou ptát.','Eine spontane Diskussion entsteht.',35,{mindset:4,energy:-4,followCs:'Lektor tě pozve na další praktický workshop.',followDe:'Der Dozent lädt dich zum nächsten Workshop ein.',followAfter:5}),
 ch('evening-question','Položím otázku z praxe.','Eine Praxisfrage stellen.','Názory se rozcházejí. Je to zajímavější než původní prezentace.','Die Diskussion wird spannender als die Folien.',30,{mindset:3}),
 ch('evening-leave','Půjdu raději domů.','Lieber nach Hause gehen.','Nikdo se neurazí. Někdy člověk prostě nemá energii na další večer.','Niemand nimmt es übel.',10,{stress:-2})]},
 {id:'school-project',place:'school',cs:'Ve skupině má každý jinou představu o projektu. Nejhlasitější člen ale zatím nic nenapsal.',de:'In der Projektgruppe haben alle andere Ideen. Der lauteste Teilnehmer hat noch nichts geschrieben.',choices:[
 ch('project-plan','Navrhnu rozdělení úkolů.','Aufgaben aufteilen.','Konečně se začne pracovat. Někdo ti později poděkuje.','Endlich geht es voran.',30,{mindset:3,stress:-2}),
 ch('project-listen','Dám prostor tichému členovi.','Dem stillen Mitglied Raum geben.','Právě on přijde s jednoduchým řešením, na které nikdo nepomyslel.','Er bringt die beste Idee ein.',25,{mindset:4,stress:-3}),
 ch('project-solo','Udělám všechno sám.','Alles allein machen.','Projekt postupuje, ale jsi vyčerpaný. Ostatní se nic nenaučili.','Es geht voran, doch du bist erschöpft.',55,{energy:-13,stress:8})]},
 {id:'school-debate',place:'school',cs:'Spolužák řekne něco, s čím zásadně nesouhlasíš. Učitel čeká na tvoji reakci.',de:'Ein Mitschüler sagt etwas, womit du überhaupt nicht einverstanden bist. Der Lehrer wartet.',choices:[
 ch('debate-ask','Zeptám se, proč si to myslí.','Nach seinen Gründen fragen.','Odpověď tě nepřesvědčí, ale lépe chápeš jeho pohled.','Du verstehst seinen Standpunkt besser.',18,{mindset:4}),
 ch('debate-prove','Ukážu konkrétní argument.','Ein konkretes Argument nennen.','Diskuse zůstane věcná. Ani jeden nemusí vyhrát.','Die Diskussion bleibt sachlich.',22,{mindset:3}),
 ch('debate-mock','Zesměšním jeho názor.','Seine Meinung lächerlich machen.','Třída na chvíli ztichne. Tenhle vtip nikoho moc nepobavil.','Im Raum wird es still.',8,{stress:7})]},
 {id:'school-lost',place:'school',rare:true,cs:'Na chodbě leží složka se zkouškovými výsledky. Nikdo ji nehlídá.',de:'Auf dem Flur liegt eine Mappe mit Prüfungsergebnissen. Niemand passt darauf auf.',choices:[
 ch('lost-return','Odnesu ji učiteli neotevřenou.','Ungeöffnet beim Lehrer abgeben.','Učitel poděkuje. Nic dalšího se nemusí stát.','Der Lehrer bedankt sich.',8,{mindset:2}),
 ch('lost-open','Podívám se dovnitř.','Hineinschauen.','Zaznamenáš cizí osobní údaje. Rychle pochopíš, že to nebyl dobrý nápad.','Du siehst private Daten. Das war keine gute Idee.',7,{stress:5}),
 ch('lost-leave','Nechám ji ležet.','Die Mappe liegen lassen.','Někdo ji později vyzvedne. O jejím obsahu nic nevíš.','Später holt sie jemand ab.',4,{})]},
 {id:'home-empty-walls',place:'home',minDay:1,cs:'Všimneš si, jak prázdně působí obývací pokoj. Na stěně zůstala jediná díra po hřebíku. Možná by domov potřeboval trochu života.',de:'Dein Wohnzimmer wirkt leer. An der Wand ist nur ein altes Nagelloch. Vielleicht fehlt hier etwas Persönlichkeit.',choices:[
 ch('wall-plan','Naplánuji návštěvu obchodu s nábytkem.','Einen Möbelhausbesuch planen.','Není nutné utratit hned celé jmění. Začneš seznamem věcí, které skutečně potřebuješ.','Du machst erst eine Liste.',15,{mindset:2}),
 ch('wall-friend','Požádám známého o názor.','Einen Freund um Rat fragen.','Kamarád navrhne květiny, protože ty se na rozdíl od tapet dají přestěhovat.','Ein Freund schlägt Pflanzen vor.',15,{stress:-2}),
 ch('wall-later','Zatím to neřeším.','Erst einmal lassen.','Možná je prázdný pokoj také příležitost začít od začátku.','Ein leerer Raum ist vielleicht eine Chance.',5,{})]},
 {id:'work-schedule',place:'work',minDay:4,cs:'Šéf přesouvá plánovanou schůzku. Jeden kolega nestíhá školení, druhý má doma nemocné dítě. Co navrhneš?',de:'Der Chef verschiebt einen Termin. Ein Kollege hat eine Schulung, der andere ein krankes Kind. Was schlägst du vor?',choices:[
 ch('work-schedule-swap','Navrhnu nový termín.','Einen Ersatztermin anbieten.','Najde se kompromis. Šéf si zapamatuje, že umíš hledat řešení.','Ein Kompromiss wird gefunden.',20,{mindset:2,stress:-2}),
 ch('work-schedule-blame','Obviním kolegy z nespolehlivosti.','Den Kollegen Unzuverlässigkeit vorwerfen.','Získáš chladné pohledy. Schůzku to stejně neurychlí.','Die Stimmung kippt.',10,{stress:8}),
 ch('work-schedule-help','Nabídnu převzetí části práce.','Einen Teil der Arbeit übernehmen.','Pomůžeš týmu, ale dnešní večer bude kratší.','Du hilfst, aber dein Abend wird kürzer.',50,{energy:-12,mindset:2})]},
 {id:'park-stranger',place:'park',rare:true,cs:'Na lavičce někdo čte knihu vzhůru nohama. Když se přiblížíš, zjistíš, že jen schovává obálku.',de:'Jemand liest ein Buch verkehrt herum. Offenbar möchte die Person das Cover verbergen.',choices:[
 ch('park-book','Zeptám se na knihu.','Nach dem Buch fragen.','Zasměje se: „Je to kuchařka. Já ale neumím uvařit ani vodu.“','„Es ist ein Kochbuch. Ich kann nicht einmal Wasser kochen.“',12,{stress:-3}),
 ch('park-greet','Jen pozdravím.','Nur grüßen.','Odpoví úsměvem. Krátké setkání může zůstat krátkým.','Ein Lächeln genügt.',4,{stress:-1}),
 ch('park-ignore','Nechám ho číst.','Weiterlesen lassen.','Park dál plyne svým vlastním tempem.','Der Park bleibt ruhig.',3,{})]}
];
export function playableScene(s:TownState):NarrativeScene|null{
 const list=livingStories.filter(e=>e.place===s.place&&!s.storySeen.includes(e.id)&&s.day>=(e.minDay??0)&&(e.minAge===undefined||s.ageConfirmed&&s.playerAge>=e.minAge)
 &&(e.time!=='night'||s.minute>=19*60||s.minute<7*60)&&(e.time!=='day'||s.minute>=7*60&&s.minute<19*60)
 &&(!e.rare||(s.day+Math.floor(s.minute/60))%3===0));
 if(!list.length)return null;
 return list[(s.day+Math.floor(s.minute/60)+list.length)%list.length];
}
export function applyStoryChoice(s:TownState,sceneId:string,choiceId:string):TownState{
 const scene=playableScene(s);
 if(!scene||scene.id!==sceneId)return s;
 const choice=scene.choices.find(c=>c.id===choiceId);
 if(!choice)return s;
 const n=addTime(s,choice.minutes);
 const balance=Math.max(0,Math.round((n.wallet+(choice.money??0))*100)/100);
 const seen=[...n.storySeen,scene.id];
 const pending=choice.followCs&&choice.followDe?[...n.storyPending,{dueDay:n.day+(choice.followAfter??2),cs:choice.followCs,de:choice.followDe}]:n.storyPending;
 return {...n,storySeen:seen,storyPending:pending,wallet:balance,walletHistory:balance!==n.wallet?[...n.walletHistory,balance]:n.walletHistory,
 mindset:Math.max(0,n.mindset+(choice.mindset??0)),stress:Math.min(100,Math.max(0,n.stress+(choice.stress??0))),
 life:{...n.life,energy:Math.min(100,Math.max(0,n.life.energy+(choice.energy??0)))},
 journal:{cs:[...n.journal.cs,choice.resultCs],de:[...n.journal.de,choice.resultDe]}};
}
export function relationshipAging(s:TownState):TownState{
 if(s.socialTickDay===s.day)return s;
 const bonds={...s.social.bonds};
 const active=Object.values(bonds).filter(b=>b.warmth>=12).length;
 const overload=Math.max(0,active-10);
 for(const [id,bond] of Object.entries(bonds)){
  const r=byId(id);
  const tolerance=r?.temperament==='reserved'?21:r?.temperament==='warm'?10:14;
  const absent=s.day-bond.lastContact;
  const decline=absent>tolerance?Math.min(3,1+Math.floor((absent-tolerance)/14)):0;
  const extra=overload>0&&absent>4?Math.min(2,Math.ceil(overload/6)):0;
  if(decline+extra) bonds[id]={...bond,warmth:Math.max(-100,bond.warmth-decline-extra)};
 }
 const due=s.storyPending.filter(x=>x.dueDay<=s.day);
 const remaining=s.storyPending.filter(x=>x.dueDay>s.day);
 return {...s,socialTickDay:s.day,storyPending:remaining,
 social:{...s.social,bonds},
 journal:due.length?{cs:[...s.journal.cs,...due.map(x=>x.cs)],de:[...s.journal.de,...due.map(x=>x.de)]}:s.journal};
}
