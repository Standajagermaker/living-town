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
 return {...n,railTalkDay:s.day,railTalkOutcome:text,
 stress:Math.max(0,Math.min(100,n.stress+(reply==='complain'?3:reply==='joke'?-3:reply==='ask'?-1:0))),
 journal:{cs:[...n.journal.cs,text.cs],de:[...n.journal.de,text.de]}};
}
export function travelToCity(s:TownState,id:TravelCity):TownState{
 const destination=destinations.find(d=>d.id===id);
 if(!destination||s.place!=='train'||s.onHoliday||s.vacationDays<2||s.wallet<destination.ticket+destination.hotel)return s;
 const n=addTime(s,destination.minutes);
 const total=destination.ticket+destination.hotel,balance=Math.round((n.wallet-total)*100)/100;
 return {...n,travelCity:id,onHoliday:true,place:'hotel',selectedNpc:null,vacationDays:Math.max(0,s.vacationDays-2),
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
