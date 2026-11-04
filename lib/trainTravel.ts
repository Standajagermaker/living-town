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
