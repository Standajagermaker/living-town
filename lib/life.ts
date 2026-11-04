import type {Place} from './game';
import type {TownState,Lang} from './world';
import {applyNewDay,collectReplies} from './social';
export type CalendarEntry={eventId:string;day:number;status:'going'|'attended'};
export type TownEvent={id:string;day:number;start:number;end:number;place:Place;cs:string;de:string;emoji:string;detailCs:string;detailDe:string;attendees:string[]};
export type LifeState={
 energy:number;hunger:number;groceries:number;loans:{id:string;borrowedDay:number;readDay:number|null;dueDay:number}[];
 calendar:CalendarEntry[];readBooks:string[];lastMeal:number;lastBed:number;lookCount:number;
 phoneOpenedAt:number|null;phoneWarnings:number;workWarnings:number;lastBossEvent:number|null;
 stories:string[];visited:string[];lastPhoneCheck:number;experiences:string[];lastScreenDay:number;
};
export const initialLife=():LifeState=>({energy:80,hunger:25,groceries:2,loans:[],calendar:[],readBooks:[],lastMeal:-1,lastBed:-1,lookCount:0,phoneOpenedAt:null,phoneWarnings:0,workWarnings:0,lastBossEvent:null,stories:[],visited:[],lastPhoneCheck:0,experiences:[],lastScreenDay:-1});
export const catalog=[
 {id:'listening',cs:'O umění naslouchat',de:'Die Kunst des Zuhörens',csText:'Naslouchání znamená porozumět tomu, co druhý říká, a ověřit si, zda chce radu. Když se ptáš otevřeně a nepřerušuješ, zvyšuje se šance, že se dozvíš skutečný příběh.',deText:'Zuhören bedeutet verstehen, was das Gegenüber sagt, und klären, ob Rat erwünscht ist. Offene Fragen und Geduld helfen, die eigentliche Geschichte zu erfahren.',gain:12},
 {id:'reasoning',cs:'Proč se někdy mýlíme',de:'Warum wir uns manchmal irren',csText:'Mozek rád hledá důkazy pro to, čemu už věří. Zkus si položit otázku: Jaký důkaz by změnil můj názor? Přemýšlet znamená také umět změnit názor.',deText:'Unser Gehirn sucht gern Belege für bereits bestehende Ansichten. Frage dich: Welche Information würde meine Meinung ändern? Denken heißt auch, die eigene Sicht korrigieren zu können.',gain:14},
 {id:'resilience',cs:'Klid při nesouhlasu',de:'Gelassen bleiben bei Widerspruch',csText:'Nemusíš vyhrát každou diskusi. Když jsou emoce silné, pomáhá shrnout pozici druhého a jasně sdělit vlastní hranice. To není souhlas, ale respekt.',deText:'Du musst nicht jede Diskussion gewinnen. Wenn Gefühle stark sind, hilft es, die Sicht des Gegenübers zusammenzufassen und eigene Grenzen ruhig zu benennen. Das ist nicht Zustimmung, sondern Respekt.',gain:10}
];
export const eventsForDay=(day:number):TownEvent[]=>{
 // 0 = Saturday, 1 = Sunday. Seasons advance every fourteen game days.
 const dow=day%7,season=Math.floor(day/14)%4;
 const schedule:{cs:string;de:string;emoji:string;place:Place;start:number;days:number[];seasons:number[]}[]=[
  {cs:'Farmářský trh',de:'Bauernmarkt',emoji:'🧺',place:'square',start:9*60,days:[0],seasons:[0,1,2,3]},
  {cs:'Nedělní koncert',de:'Sonntagskonzert',emoji:'🎻',place:'square',start:16*60,days:[1],seasons:[0,1,2,3]},
  {cs:'Kvíz v kavárně',de:'Quiz im Café',emoji:'🧩',place:'cafe',start:19*60,days:[3],seasons:[0,1,2,3]},
  {cs:'Večer společenských her',de:'Spieleabend',emoji:'🎲',place:'cafe',start:18*60,days:[5],seasons:[0,1,2,3]},
  {cs:'Jarní dobrovolnická akce',de:'Frühlingsaktion',emoji:'🌱',place:'park',start:10*60,days:[0,1],seasons:[0]},
  {cs:'Jarní běžecký závod',de:'Frühlingslauf',emoji:'🏃',place:'park',start:11*60,days:[0],seasons:[0]},
  {cs:'Letní koupání',de:'Sommerbadetag',emoji:'🏊',place:'pool',start:11*60,days:[0,1],seasons:[1]},
  {cs:'Downhill víkend',de:'Downhill-Wochenende',emoji:'🚵',place:'resort',start:10*60,days:[0,1],seasons:[1,2]},
  {cs:'Letní slavnosti',de:'Sommerfest',emoji:'🎆',place:'square',start:18*60,days:[0],seasons:[1]},
  {cs:'Podzimní slavnost',de:'Herbstfest',emoji:'🍁',place:'square',start:16*60,days:[0],seasons:[2]},
  {cs:'Dýňový trh',de:'Kürbismarkt',emoji:'🎃',place:'square',start:10*60,days:[1],seasons:[2]},
  {cs:'Lyžařský den',de:'Skitag',emoji:'🎿',place:'resort',start:9*60,days:[0,1],seasons:[3]},
  {cs:'Zimní adventní trh',de:'Wintermarkt',emoji:'❄️',place:'square',start:16*60,days:[0,1],seasons:[3]},
  {cs:'Večerní čtení',de:'Abendlesung',emoji:'📚',place:'library',start:17*60,days:[4],seasons:[0,1,2,3]}
 ];
 const matching=schedule.filter(e=>e.days.includes(dow)&&e.seasons.includes(season));
 return matching.map((e,i)=>{
  const id='ev-'+day+'-'+i;
  const attendees=Array.from({length:4+(day+i)%6},(_,n)=>'npc-'+String(1+(day*9+i*7+n*6)%50).padStart(2,'0'));
  return {id,day,start:e.start,end:e.start+110,place:e.place,cs:e.cs,de:e.de,emoji:e.emoji,attendees,
   detailCs:'Lidé se postupně scházejí. Někteří přijdou pozdě, jiní mohou překvapit.',
   detailDe:'Die Leute treffen nach und nach ein. Manche kommen später, andere sorgen für Überraschungen.'};
 });
};
export function addTime(s:TownState,mins:number):TownState{
 let minute=s.minute+mins, day=s.day;
 if(minute>=1440){day+=Math.floor(minute/1440);minute%=1440}
 const life=s.life??initialLife();
 const next={...s,day,minute,life:{...life,energy:Math.max(0,life.energy-Math.max(0,mins)*.035),hunger:Math.min(100,life.hunger+Math.max(0,mins)*.045)}};
 return day!==s.day?applyNewDay(next):collectReplies(next);
}
export function eat(s:TownState):TownState{
 const l=s.life??initialLife();if(s.place!=='home'||l.groceries<=0)return s;
 const next=addTime(s,15);
 return {...next,life:{...next.life,groceries:l.groceries-1,lastMeal:next.day*1440+next.minute,hunger:Math.max(0,next.life.hunger-38),energy:Math.min(100,next.life.energy+8)}};
}
export function groceries(s:TownState):TownState{
 if(s.place!=='market'||s.wallet<12)return s;
 const n=addTime(s,20);return {...n,wallet:s.wallet-12,walletHistory:[...s.walletHistory,s.wallet-12],life:{...n.life,groceries:n.life.groceries+5}};
}
export function watchTv(s:TownState):TownState{
 if(s.place!=='home')return s;const n=addTime(s,40);
 return {...n,life:{...n.life,energy:Math.min(100,n.life.energy+6),stories:[...n.life.stories,'tv-'+n.day],experiences:[...new Set([...(n.life.experiences??[]),'news','movies'])],lastScreenDay:n.day}};
}
export function browseHome(s:TownState):TownState{
 if(s.place!=='home')return s;const n=addTime(s,20);
 return {...n,life:{...n.life,experiences:[...new Set([...(n.life.experiences??[]),'local-news','events','weather'])],lastScreenDay:n.day}};
}
export function rest(s:TownState):TownState{
 if(s.place!=='home')return s;
 let n=addTime(s,8*60);
 // A full sleep cycle takes the player to the morning of the following day.
 if(n.day===s.day)n={...n,day:s.day+1,minute:8*60};else n={...n,minute:8*60};
 const missed=s.day%7>=2&&s.lastShift!==s.day&&s.employment!=='fired'?s.absences+1:s.absences;
 const next={...n,place:'home' as Place,selectedNpc:null,absences:missed,employment:missed>=4?'fired' as const:missed>=2?'warned' as const:s.employment,
  life:{...n.life,energy:100,hunger:Math.min(100,n.life.hunger+14),lastBed:n.day,phoneOpenedAt:null}};
 return applyNewDay(next);
}
export function borrow(s:TownState,id:string):TownState{
 const l=s.life??initialLife();if(s.place!=='library'||l.loans.some(b=>b.id===id))return s;
 const n=addTime(s,12);
 return {...n,life:{...n.life,loans:[...l.loans,{id,borrowedDay:s.day,readDay:null,dueDay:s.day+10}]}};
}
export function readLoan(s:TownState,id:string):TownState{
 const l=s.life??initialLife(),book=l.loans.find(x=>x.id===id);
 if(s.place!=='home'||!book||book.readDay!==null)return s;
 const n=addTime(s,65);
 return {...n,life:{...n.life,loans:n.life.loans.map(b=>b.id===id?{...b,readDay:n.day}:b),energy:Math.max(0,n.life.energy-4)}};
}
export function returnLoan(s:TownState,id:string):TownState{
 const l=s.life??initialLife();const loan=l.loans.find(b=>b.id===id);
 if(s.place!=='library'||!loan)return s;
 const n=addTime(s,12),b=catalog.find(b=>b.id===id);
 // Need at least one overnight sleep after reading before knowledge is consolidated.
 const learned=loan.readDay!==null&&s.life.lastBed>loan.readDay&&!s.life.readBooks.includes(id);
 const gain=learned?(b?.gain??10):0;
 const updated={...n,life:{...n.life,loans:n.life.loans.filter(b=>b.id!==id),experiences:learned?[...new Set([...(n.life.experiences??[]),'books','learning'])]:n.life.experiences,readBooks:learned?[...n.life.readBooks,id]:n.life.readBooks}};
 return {...updated,mindset:updated.mindset+gain,completed:learned?[...new Set([...s.completed,'read'])]:s.completed};
}
export function registerEvent(s:TownState,event:TownEvent):TownState{
 if(event.day<s.day||s.life.calendar.some(e=>e.eventId===event.id))return s;
 if(s.life.calendar.filter(e=>e.day===event.day).length>=2)return s;
 return {...s,life:{...s.life,calendar:[...s.life.calendar,{eventId:event.id,day:event.day,status:'going'}]}};
}
export function attendEvent(s:TownState,event:TownEvent):TownState{
 const entry=s.life.calendar.find(e=>e.eventId===event.id);
 if(!entry||entry.status==='attended'||event.day!==s.day||s.minute>event.end)return s;
 const n=addTime(s,Math.max(8,event.start-s.minute));
 const end=addTime(n,38);
 const surprises=[
 ['Na akci dorazil někdo v kostýmu, ačkoliv to nebyl maškarní večírek. Teď tvrdí, že to byl experiment.','Jemand erschien verkleidet, obwohl es keine Kostümparty ist. Jetzt nennt er es ein Experiment.'],
 ['Moderátor zapomněl, koho měl uvítat. Publikum to vzalo jako improvizační komedii.','Der Moderator hat vergessen, wen er begrüßen sollte. Das Publikum hält es für Impro-Comedy.'],
 ['Někdo přinesl dort s úplně jiným jménem. Oslavenec se rozhodl, že dnes může být kdokoliv.','Jemand brachte eine Torte mit dem falschen Namen. Das Geburtstagskind beschloss, heute jemand anderes zu sein.'],
 ['Hudba začala o deset minut dřív. Organizátor trvá na tom, že jde o časový experiment.','Die Musik begann zehn Minuten zu früh. Der Veranstalter nennt das ein Zeitexperiment.']
 ];
 const [cs,de]=surprises[(event.day+event.start)%surprises.length];
 return {...end,place:event.place,discovered:[...new Set([...end.discovered,event.place])],
  life:{...end.life,calendar:end.life.calendar.map(e=>e.eventId===event.id?{...e,status:'attended' as const}:e),visited:[...end.life.visited,event.id]},
  journal:{cs:[...end.journal.cs,cs],de:[...end.journal.de,de]}};
}
export function lookAround(s:TownState):TownState{
 if(s.place!=='street'&&s.place!=='square')return s;
 const hidden:Place[]=['market','cafe','park','church','hotel','gym','library','square','mountains','restaurant','outfitter','pool','resort'];
 const available=hidden.filter(p=>!s.discovered.includes(p));
 const next=addTime(s,8);
 if(!available.length)return next;
 const place=available[(s.day*7+s.life.lookCount*3+s.minute)%available.length];
 const moments=[
 ['Na náměstí se honí pes za vlastním vodítkem. Jeho majitel předstírá, že to byl výcvik.','Auf dem Platz jagt ein Hund seiner eigenen Leine hinterher. Sein Besitzer behauptet, das sei Training.'],
 ['Cyklista se chlubí novou navigací. Ta ho právě potřetí poslala kolem stejné kašny.','Ein Radfahrer lobt sein neues Navi. Das schickt ihn gerade zum dritten Mal um denselben Brunnen.'],
 ['Někdo před kavárnou převrhl ceduli „Pozor, kluzká podlaha“. Na suchý chodník.','Vor dem Café fällt ein Schild mit „Vorsicht, Rutschgefahr“ auf den völlig trockenen Gehweg.'],
 ['Z hotelu vyšel muž s kufrem a zjistil, že právě čeká na autobusové zastávce pro pěší.','Ein Mann verlässt das Hotel mit Koffer und merkt, dass er an einer Fußgängerzone auf den Bus wartet.'],
 ['V parku někdo cvičí jógu. Husy mají zjevně vlastní názor na jeho osobní prostor.','Im Park macht jemand Yoga. Die Gänse haben offenbar eine andere Vorstellung von persönlichem Abstand.']
 ];
 const [cs,de]=moments[(s.day*7+s.life.lookCount)%moments.length];
 return {...next,discovered:[...s.discovered,place],life:{...next.life,lookCount:s.life.lookCount+1,stories:[...next.life.stories,'look-'+s.day+'-'+s.life.lookCount]},
 journal:{cs:[...next.journal.cs,cs],de:[...next.journal.de,de]}};
}
export function phoneOpened(s:TownState):TownState{
 if(s.place!=='work')return s;
 return {...s,life:{...s.life,phoneOpenedAt:Date.now(),lastPhoneCheck:s.minute}};
}
export function phoneClosed(s:TownState):TownState{
 return {...s,life:{...s.life,phoneOpenedAt:null}};
}
export function bossInterruption(s:TownState,lang:Lang):TownState{
 const l=s.life??initialLife();if(s.place!=='work'||l.phoneOpenedAt===null||Date.now()-l.phoneOpenedAt<5*60*1000||l.lastBossEvent===s.day)return s;
 const warnings=l.workWarnings+1;
 const n=addTime(s,6);
 const cs=warnings>=3?'Šéf přišel nečekaně: „Z telefonu máš asi druhý pracovní poměr. Ten první právě končí.“':'Šéf se objevil za zády: „Ten telefon má snad lepší pracovní smlouvu než ty!“';
 const de=warnings>=3?'Der Chef steht plötzlich hinter dir: „Dein Handy scheint einen zweiten Job zu haben. Den ersten hast du gerade verloren.“':'Der Chef steht plötzlich hinter dir: „Dein Handy hat wohl den besseren Arbeitsvertrag!“';
 return {...n,employment:warnings>=3?'fired':s.employment,life:{...n.life,phoneOpenedAt:null,phoneWarnings:l.phoneWarnings+1,workWarnings:warnings,lastBossEvent:s.day},journal:{cs:[...s.journal.cs,cs],de:[...s.journal.de,de]}};
}
export function bossConversation(s:TownState,input:string):TownState{
 if(s.place!=='work')return s;
 const v=input.toLowerCase();
 if(!/doporuč|empfehl|kavár|cafe|kaffee|místo|ort/.test(v))return s;
 const mood=(s.day*13+s.minute*7)%5;
 const warning=mood<=2;
 const l=s.life??initialLife(),warn=l.workWarnings+(warning?1:0);
 const cs=warning?'Šéf: „Doporučím ti místo – tvoje pracovní místo. Tam tě teď potřebuju!“':'Šéf: „Běž do kavárny u náměstí, ale až po směně. A mimochodem, práce ti dnes jde.“';
 const de=warning?'Chef: „Ich empfehle dir einen Ort: deinen Arbeitsplatz. Genau dort brauche ich dich jetzt!“':'Chef: „Das Café am Marktplatz. Aber erst nach der Schicht! Übrigens, gute Arbeit heute.“';
 const bonus=warning?0:10;
 return {...s,wallet:s.wallet+bonus,employment:warn>=4?'fired':s.employment,
 life:{...l,workWarnings:warn},journal:{cs:[...s.journal.cs,cs],de:[...s.journal.de,de]}};
}
