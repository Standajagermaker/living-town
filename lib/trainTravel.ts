import type {TownState} from './world';
import {addTime} from './life';
export type TravelCity='lake'|'historic'|'alps';
export const destinations:{id:TravelCity;cs:string;de:string;ticket:number;hotel:number;minutes:number;storyCs:string;storyDe:string;pointCs:string;pointDe:string}[]=[
 {id:'lake',cs:'Městečko u jezera',de:'Stadt am See',ticket:27,hotel:69,minutes:95,
 storyCs:'Ve vlaku průvodčí poznamenal, že u jezera se prý dobře přemýšlí. Na molu ti někdo podal zapomenutou pohlednici.',storyDe:'Der Schaffner sagt, am See könne man gut nachdenken. Am Steg reicht dir jemand eine vergessene Postkarte.',
 pointCs:'Na pohlednici stálo: „Nečekej na dokonalý den. Ten dnešní je první, který máš.“',pointDe:'Auf der Karte steht: „Warte nicht auf den perfekten Tag. Der heutige ist der erste, den du hast.“'},
 {id:'historic',cs:'Historické město',de:'Historische Stadt',ticket:42,hotel:84,minutes:145,
 storyCs:'V hotelu hledají klíč od tvého pokoje. Recepční ti mezitím vypráví příběh o staré radnici.',storyDe:'Im Hotel sucht man deinen Zimmerschlüssel. Währenddessen erzählt die Rezeptionistin von einem alten Rathaus.',
 pointCs:'Nakonec klíč našli. Visel na cedulce „Prosíme, nic neztrácejte“.',pointDe:'Schließlich finden sie den Schlüssel. Er hing am Schild „Bitte nichts verlieren“.'},
 {id:'alps',cs:'Alpské město',de:'Alpenstadt',ticket:68,hotel:99,minutes:190,
 storyCs:'Ve vlaku ti spolucestující doporučí trasu, o které tvrdí, že je lehká. Pak dodá, že býval horolezec.',storyDe:'Im Zug empfiehlt dir jemand eine angeblich leichte Route. Dann erwähnt er, früher Bergsteiger gewesen zu sein.',
 pointCs:'Rozhodl ses raději začít procházkou. V horách je rozumnost také dobrodružství.',pointDe:'Du beginnst lieber mit einem Spaziergang. In den Bergen ist Vernunft auch ein Abenteuer.'}
];
export type RailwayReply='complain'|'joke'|'ask'|'quiet';
export function railDelayMinutes(s:TownState):number{
 // A deterministic station announcement; only some visits have a late train.
 return (s.day*7+Math.floor(s.minute/60)*3)%5===2?15+((s.day*13)%4)*5:0;
}
export function railConversationAvailable(s:TownState):boolean{
 return s.place==='train'&&s.railTalkDay!==s.day&&railDelayMinutes(s)>0;
}
export function railwayConversation(s:TownState,reply:RailwayReply):TownState{
 if(!railConversationAvailable(s))return s;
 const delay=railDelayMinutes(s);
 const text={
 complain:{cs:'„Tohle je neuvěřitelné! Zase zpoždění!“ obrátíš se na spolucestující. „Vím,“ povzdechne si. „Já už mám takovou zkušenost, že si kupuju jízdenku na včerejšek.“',
 de:'„Unfassbar, schon wieder Verspätung!“ sagst du zu einer Reisenden. „Ich weiß“, seufzt sie. „Inzwischen kaufe ich die Fahrkarte für gestern.“'},
 joke:{cs:'„Myslíš, že ten vlak vůbec existuje?“ zeptáš se. Spolucestující odvětí: „Určitě. Jen jsme ho zatím nikdy neviděli ve volné přírodě.“',
 de:'„Glaubst du, diesen Zug gibt es überhaupt?“ fragst du. „Bestimmt“, antwortet jemand. „Wir haben ihn nur noch nie in freier Wildbahn gesehen.“'},
 ask:{cs:'„Nevíte, kdy to pojede?“ zeptáš se. Cestující ti ukáže zprávu v mobilu. „Za chvíli. Když už čekáme, kam vlastně cestujete?“',
 de:'„Wissen Sie, wann der Zug kommt?“ fragst du. Ein Fahrgast zeigt die Meldung am Handy. „Bald. Wohin fahren Sie eigentlich?“'},
 quiet:{cs:'Zhluboka se nadechneš, přečteš si informační tabuli a čekáš dál. Vedle stojící cestující jen pokrčí rameny.',
 de:'Du atmest tief durch, liest die Anzeigetafel und wartest. Jemand neben dir zuckt nur mit den Schultern.'}
 }[reply];
 const n=addTime(s,delay);
 const businessDay=s.day%7>=2&&s.day%7<=6;
 const kind:'meeting'|'connection'|'stranger'=businessDay&&s.minute>=7*60&&s.minute<=13*60&&((s.day+Math.floor(s.minute/60))%3!==0)?'meeting':(s.day+s.minute)%3===0?'stranger':'connection';
 return {...n,railIncident:{kind,day:s.day,seed:s.day*31+s.minute+delay},railTalkDay:s.day,railTalkOutcome:text,
 stress:Math.max(0,Math.min(100,n.stress+(reply==='complain'?3:reply==='joke'?-3:reply==='ask'?-1:0))),
 journal:{cs:[...n.journal.cs,text.cs],de:[...n.journal.de,text.de]}};
}
export type IncidentAction='notify'|'negotiate'|'improvise';
export function railwayIncidentTitle(kind:'meeting'|'connection'|'stranger'|'hotel',lang:'cs'|'de'){
 const titles={meeting:{cs:'Zmeškaná pracovní schůzka',de:'Verspäteter Geschäftstermin'},connection:{cs:'Ujel přípoj',de:'Anschluss verpasst'},stranger:{cs:'Nečekané setkání',de:'Unerwartete Begegnung'},hotel:{cs:'Pozdní příjezd do hotelu',de:'Später Check-in im Hotel'}};
 return titles[kind][lang];
}
export function railwayIncidentText(kind:'meeting'|'connection'|'stranger'|'hotel',lang:'cs'|'de'){
 const texts={
  meeting:{cs:'Na telefonu bliká zpráva od šéfa: „Kde jsi? Klient už čeká.“ Zpoždění vlaku přerostlo v pracovní problém. Jak zareaguješ?',de:'Dein Chef schreibt: „Wo bleibst du? Der Kunde wartet.“ Die Zugverspätung wird zum Arbeitsproblem. Was tust du?'},
  connection:{cs:'Na tabuli zhasne tvůj přípoj. Poslední autobus odjel před pěti minutami. U přepážky se tvoří fronta.',de:'Dein Anschluss verschwindet von der Anzeige. Der letzte Bus ist vor fünf Minuten abgefahren. Am Schalter bildet sich eine Schlange.'},
  stranger:{cs:'Spolucestující poznamená: „Když už tu tvrdneme, mám aspoň čas na jednu důležitou otázku: máte rádi neplánovaná dobrodružství?“',de:'Ein Mitreisender fragt: „Wenn wir schon festsitzen: Mögen Sie ungeplante Abenteuer?“'},
  hotel:{cs:'Do hotelu přicházíš až po zavření recepce. U dveří stojí další host s kufrem. Oba zjišťujete, že máte stejný problém.',de:'Du kommst nach Rezeptionsschluss am Hotel an. Ein anderer Gast mit Koffer steht vor der Tür. Ihr habt offenbar dasselbe Problem.'}
 };
 return texts[kind][lang];
}
export function resolveRailIncident(s:TownState,action:IncidentAction):TownState{
 const incident=s.railIncident;if(!incident||!(s.place==='train'||s.place==='hotel'))return s;
 const {kind,seed}=incident;
 const lucky=(seed%4)===0;
 const delay=action==='notify'?8:action==='negotiate'?13:18;
 const n=addTime(s,delay);
 let charge=0,stressDelta=0,mindsetDelta=0,warn=false;
 let cs='',de='';
 if(kind==='meeting'){
  if(action==='notify'){
   warn=!lucky;stressDelta=warn?11:2;
   cs=warn?'Šéf oceňuje, že ses ozval, ale klient už odešel. Dostáváš upozornění.':'Šéf zprávu včas předal klientovi. Schůzku přesunuli a všichni si oddechli.';
   de=warn?'Der Chef schätzt deine Nachricht, aber der Kunde ist weg. Du bekommst eine Warnung.':'Der Chef informiert den Kunden rechtzeitig. Der Termin wird verschoben.';
  }else if(action==='negotiate'){
   mindsetDelta=2;stressDelta=-4;
   cs='Klient přijme videohovor přímo z nádraží. Zrovna při vysvětlování plánu ti do řeči vstoupí hlášení: „Vlak do nikam má další zpoždění.“ Klient se poprvé zasměje.';
   de='Der Kunde nimmt einen Videoanruf vom Bahnhof an. Mitten in deiner Präsentation ertönt eine Verspätungsdurchsage. Zum ersten Mal lacht der Kunde.';
  }else{
   charge=lucky?0:15;stressDelta=8;warn=!lucky;
   cs=lucky?'Běžíš na náhradní spoj a schůzku stihneš. Jen si ještě dvacet minut nemůžeš vzpomenout, kde máš poznámky.':'Taxi stojí 15 €. Na schůzku stejně dorazíš pozdě. Šéf chce příště lepší plán.';
   de=lucky?'Du erwischst einen Ersatzanschluss und schaffst den Termin. Nur deine Notizen sind verschwunden.':'Das Taxi kostet 15 €. Du kommst trotzdem spät. Der Chef erwartet künftig bessere Planung.';
  }
 }else if(kind==='connection'){
  if(action==='notify'){stressDelta=-3;cs='Dáš vědět, že se zdržíš. Nikdo není nadšený, ale aspoň na tebe nečekají zbytečně.';de='Du meldest die Verspätung. Niemand ist begeistert, aber immerhin wartet niemand umsonst.';}
  else if(action==='negotiate'){mindsetDelta=2;charge=lucky?0:6;cs=lucky?'Pracovnice na přepážce najde náhradní spoj zdarma. Ještě dostaneš mapu města.':'Za 6 € dostaneš změněnou jízdenku. Ve frontě náhodou potkáš člověka, který zná tvoji cílovou ulici.';de=lucky?'Am Schalter findet man kostenlos eine neue Verbindung. Dazu gibt es einen Stadtplan.':'Für 6 € wird das Ticket umgebucht. In der Schlange triffst du jemanden, der deine Zielstraße kennt.';}
  else{charge=14;stressDelta=3;cs='Dohodneš spolujízdu za 14 €. Spolucestující celou cestu vypráví o tom, jak se kdysi ztratil v sousední ulici svého domu.';de='Du organisierst eine Mitfahrt für 14 €. Dein Mitfahrer erzählt, wie er sich einst in der Nachbarstraße seines Hauses verirrte.';}
 }else if(kind==='hotel'){
  if(action==='notify'){charge=lucky?0:12;stressDelta=-2;cs=lucky?'Telefonní automat tě spojí s noční recepcí. Přijde recepční v pantoflích a zachrání večer.':'Hotel ti po telefonu sdělí kód ke schránce s klíči, ale za pozdní příjezd účtuje 12 €.';de=lucky?'Du erreichst die Nachtrezeption. Ein Mitarbeiter in Hausschuhen rettet deinen Abend.':'Das Hotel schickt einen Schlüsselcode, verlangt aber 12 € Spätankunftsgebühr.';}
  else if(action==='negotiate'){mindsetDelta=3;stressDelta=-3;cs='Společně s druhým hostem najdete správný noční vchod. Nakonec zjistíte, že oba přijeli stejným zpožděným vlakem.';de='Mit dem anderen Gast findest du den Nachteingang. Am Ende stellt sich heraus, dass ihr denselben verspäteten Zug genommen habt.';}
  else{charge=lucky?0:24;stressDelta=4;cs=lucky?'Nedaleký penzion má volný pokoj a přijme tvou hotelovou rezervaci. Noc skončí lépe, než začala.':'Najdeš náhradní ubytování, ale doplatek je 24 €. Vrátný ti aspoň doporučí skvělou snídani.';de=lucky?'Eine Pension übernimmt deine Reservierung. Die Nacht endet besser als sie begonnen hat.':'Du findest ein Ersatzquartier, zahlst aber 24 € extra. Der Pförtner empfiehlt wenigstens ein gutes Frühstück.';}
 }else{
  if(action==='notify'){stressDelta=-4;cs='Zůstaneš stranou a napíšeš, že přijedeš později. Zvláštní je, že tě to vlastně uklidní.';de='Du schreibst eine Verspätungsnachricht. Seltsam, aber es beruhigt dich.';}
  else if(action==='negotiate'){mindsetDelta=3;cs='Dáte se do řeči. Spolucestující ti doporučí malou kavárnu, do které by ses sám nikdy nevydal. „Občas si člověk musí nechat ujet vlak, aby něco našel.“';de='Ihr kommt ins Gespräch. Dein Mitreisender empfiehlt ein Café, das du nie gefunden hättest. „Manchmal muss man einen Zug verpassen, um etwas zu entdecken.“';}
  else{charge=lucky?0:5;mindsetDelta=2;cs='Zahrajete si s cizím cestujícím slovní hru. Prohraješ a platíš kávu. Nepříjemné čekání se změní v historku.';de='Du spielst mit einem Fremden ein Wortspiel. Du verlierst und zahlst den Kaffee. Die nervige Wartezeit wird zur guten Geschichte.';}
 }
 if(charge>n.wallet){charge=0;cs+=' Peněz už na další výdaj nezbývá.';de+=' Für weitere Ausgaben reicht das Geld nicht.';}
 const balance=Math.round((n.wallet-charge)*100)/100;
 return {...n,railIncident:undefined,railTalkOutcome:{cs,de},wallet:balance,
 walletHistory:charge>0?[...n.walletHistory,balance]:n.walletHistory,
 mindset:n.mindset+mindsetDelta,stress:Math.max(0,Math.min(100,n.stress+stressDelta)),
 employment:warn&&n.employment==='employed'?'warned':n.employment,
 journal:{cs:[...n.journal.cs,cs],de:[...n.journal.de,de]}};
}
export function travelToCity(s:TownState,id:TravelCity):TownState{
 const destination=destinations.find(d=>d.id===id);
 if(!destination||s.place!=='train'||s.onHoliday||s.railIncident||s.vacationDays<2||s.wallet<destination.ticket+destination.hotel)return s;
 const n=addTime(s,destination.minutes+(s.railTalkDay!==s.day?railDelayMinutes(s):0));
 const lateArrival=n.minute>=21*60||n.minute<6*60;
 const total=destination.ticket+destination.hotel,balance=Math.round((n.wallet-total)*100)/100;
 return {...n,travelCity:id,onHoliday:true,place:'hotel',selectedNpc:null,railIncident:lateArrival?{kind:'hotel',day:n.day,seed:n.day*41+n.minute}:undefined,vacationDays:Math.max(0,s.vacationDays-2),
 wallet:balance,walletHistory:[...n.walletHistory,balance],mindset:n.mindset+3,stress:Math.max(0,n.stress-12),
 life:{...n.life,energy:Math.max(5,n.life.energy-8)},journal:{cs:[...n.journal.cs,destination.storyCs],de:[...n.journal.de,destination.storyDe]}};
}
export function returnFromHoliday(s:TownState):TownState{
 if(!s.onHoliday||s.place!=='train'||s.wallet<29)return s;
 const n=addTime(s,110);
 const destination=destinations.find(d=>d.id===s.travelCity);
 const balance=Math.round((n.wallet-29)*100)/100;
 return {...n,travelCity:'home',onHoliday:false,place:'street',selectedNpc:null,wallet:balance,walletHistory:[...n.walletHistory,balance],
 mindset:n.mindset+4,stress:Math.max(0,n.stress-8),
 journal:{cs:[...n.journal.cs,destination?.pointCs??'Vrátil ses domů s novým zážitkem.'],de:[...n.journal.de,destination?.pointDe??'Du bist mit neuen Erinnerungen zurückgekommen.']}};
}
