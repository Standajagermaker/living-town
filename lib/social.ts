import type {TownState,Lang} from './world';
import {addTime} from './life';
import {byId,moodOf} from './residents';
import type {Place} from './game';
import {foodTrouble} from './restaurantStory';
import {petAtNewDay} from './pets';
import {relationshipAging} from './storyExpansion';
export type Bond={warmth:number;trust:number;lastContact:number;invited:boolean;requested:boolean;cooldownUntil:number};
export type PhoneMessage={id:string;residentId:string;sentDay:number;sentMinute:number;dueDay:number;dueMinute:number;body:string;replyCs:string;replyDe:string;delivered:boolean};
export type SocialState={bonds:Record<string,Bond>;contacts:string[];messages:PhoneMessage[];housingPaidThrough:number;rentArrears:number;wardrobe:string[];seasonAnnounced:number;lastHoliday:number;tripCount:number};
export const defaultSocial=():SocialState=>({bonds:{},contacts:[],messages:[],housingPaidThrough:0,rentArrears:0,wardrobe:['everyday'],seasonAnnounced:0,lastHoliday:-1,tripCount:0});
export const seasonFor=(day:number)=>Math.floor(day/14)%4;
export const seasonLabels={cs:['jaro','léto','podzim','zima'],de:['Frühling','Sommer','Herbst','Winter']};
export const gearFor=(day:number)=>['raincoat','swimsuit','jacket','wintercoat'][seasonFor(day)];
export const gearItems=[
 {id:'raincoat',price:45,cs:'Pláštěnka',de:'Regenjacke'},
 {id:'swimsuit',price:35,cs:'Plavky',de:'Badebekleidung'},
 {id:'jacket',price:85,cs:'Podzimní bunda',de:'Herbstjacke'},
 {id:'wintercoat',price:135,cs:'Zimní kabát',de:'Wintermantel'},
 {id:'bike',price:300,cs:'Kolo',de:'Fahrrad'},
 {id:'skis',price:420,cs:'Lyže',de:'Ski'},
 {id:'hiking',price:70,cs:'Turistické boty',de:'Wanderschuhe'},
 {id:'running-shoes',price:58,cs:'Běžecké boty',de:'Laufschuhe'},
 {id:'sportswear',price:39,cs:'Sportovní oblečení do posilovny',de:'Sportkleidung fürs Fitnessstudio'},
 {id:'smart-outfit',price:89,cs:'Společenské oblečení',de:'Schicke Kleidung für Theater und Kirche'}
];
// Outfit checks are enforced on location entry and again when starting an activity.
export function requiredOutfit(place:Place,day:number):string[]{
 if(place==='gym')return ['sportswear','running-shoes'];
 if(place==='theatre'||place==='church')return ['smart-outfit'];
 if(place==='mountains'){
  const season=seasonFor(day);
  return ['hiking',...(season===0?['raincoat']:season===2?['jacket']:season===3?['wintercoat']:[])];
 }
 return [];
}
export function missingOutfit(place:Place,day:number,wardrobe:string[]):string[]{
 return requiredOutfit(place,day).filter(id=>!wardrobe.includes(id));
}
export function outfitMessage(place:Place,day:number,wardrobe:string[],lang:Lang):string|null{
 const missing=missingOutfit(place,day,wardrobe);
 if(!missing.length)return null;
 const labels=missing.map(id=>gearItems.find(x=>x.id===id)?.[lang]??id);
 return lang==='cs'?'Nejdřív potřebuješ: '+labels.join(', ')+'. Najdeš je v obchodě s oblečením a vybavením.':
 'Du brauchst zuerst: '+labels.join(', ')+'. Das gibt es im Sport- und Bekleidungsgeschäft.';
}
const bond0=():Bond=>({warmth:0,trust:0,lastContact:-1,invited:false,requested:false,cooldownUntil:-1});
export const getBond=(s:TownState,id:string)=>s.social?.bonds[id]??bond0();
export function developBond(s:TownState,id:string,kind:'kind'|'rude'|'time'|'flirt'):TownState{
 const social=s.social??defaultSocial(),r=byId(id);if(!r)return s;
 const old=getBond(s,id),mood=moodOf(r,s.day,s.minute);
 const delta=kind==='rude'?-12:kind==='time'?3:kind==='flirt'?(old.trust>=25&&mood!=='irritable'?4:-6):mood==='stressed'||mood==='tired'?1:5;
 const b={...old,warmth:Math.max(-100,Math.min(100,old.warmth+delta)),trust:Math.max(-100,Math.min(100,old.trust+(kind==='rude'?-8:kind==='kind'?3:kind==='time'?2:0))),lastContact:s.day};
 return {...s,social:{...social,bonds:{...social.bonds,[id]:b}}};
}
export function askContact(s:TownState,id:string):{state:TownState;accepted:boolean}{
 const social=s.social??defaultSocial(),r=byId(id),b=getBond(s,id);
 if(!r||social.contacts.includes(id))return {state:s,accepted:!!r};
 const willing=b.warmth>=12&&b.trust>=8&&s.day>=b.cooldownUntil;
 const next:Bond={...b,requested:true,cooldownUntil:willing?s.day:s.day+3};
 return {accepted:willing,state:{...s,social:{...social,bonds:{...social.bonds,[id]:next},contacts:willing?[...social.contacts,id]:social.contacts}}};
}
export function sendText(s:TownState,id:string,text:string):TownState{
 const social=s.social??defaultSocial();if(!social.contacts.includes(id)||!text.trim()||text.length>260)return s;
 const r=byId(id);if(!r)return s;
 const mood=moodOf(r,s.day,s.minute),h=Math.floor(s.minute/60);
 const delay=mood==='stressed'||mood==='tired'?150:45+(r.trait%5)*23;
 let due=s.minute+delay,day=s.day;if(due>=1440){day++;due-=1440}
 const m:PhoneMessage={id:'msg-'+s.day+'-'+s.minute+'-'+social.messages.length,residentId:id,sentDay:s.day,sentMinute:s.minute,dueDay:day,dueMinute:due,body:text,replyCs:'Ahoj, teď mám chvíli. Odepíšu, až to půjde.',replyDe:'Hallo, ich habe gerade kurz Zeit. Ich melde mich, sobald es passt.',delivered:false};
 return {...s,social:{...social,messages:[...social.messages,m]}};
}
export function collectReplies(s:TownState):TownState{
 const social=s.social??defaultSocial();
 const messages=social.messages.map(m=>(s.day>m.dueDay||(s.day===m.dueDay&&s.minute>=m.dueMinute))?{...m,delivered:true}:m);
 if(messages.every((m,i)=>m===social.messages[i]))return s;
 return {...s,social:{...social,messages}};
}
export function payRent(s:TownState):TownState{
 const social=s.social??defaultSocial();
 if(s.housingStatus==='owned'||s.wallet<210||s.day<social.housingPaidThrough)return s;
 const amount=210,balance=Math.round((s.wallet-amount)*100)/100;
 return {...s,wallet:balance,walletHistory:[...s.walletHistory,balance],housingStatus:'rented',social:{...social,housingPaidThrough:(Math.floor(s.day/30)+1)*30,rentArrears:0}};
}
export function payUtilities(s:TownState):TownState{
 if(s.utilitiesDue<=0||s.wallet<s.utilitiesDue)return s;
 const balance=Math.round((s.wallet-s.utilitiesDue)*100)/100;
 return {...s,wallet:balance,walletHistory:[...s.walletHistory,balance],utilitiesDue:0};
}
export function applyNewDay(s:TownState):TownState{
 const social=s.social??defaultSocial(),season=seasonFor(s.day);
 const month=Math.floor(s.day/30);
 const newBilling=s.day>0&&s.day%30===0&&s.monthlyBilling!==month;
 const rentDue=newBilling&&s.housingStatus!=='owned'&&s.day>=social.housingPaidThrough;
 const arrears=rentDue?social.rentArrears+1:social.rentArrears;
 const utilitiesDue=s.utilitiesDue+(newBilling?65:0);
 let n:TownState={...relationshipAging(s),stress:Math.min(100,Math.max(0,s.stress-3+(arrears?5:0)+(s.employment==='fired'?3:0))),
 monthlyBilling:newBilling?month:s.monthlyBilling,utilitiesDue,
 housingStatus:arrears>=2?'warning':s.housingStatus,
 pet:s.pet?petAtNewDay(s.pet,s.day):null,social:{...social,rentArrears:arrears}};
 if(newBilling){
  const cs='Je první den měsíce. Přišly účty: '+(rentDue?'nájem 210 € a ':'')+'energie 65 €.';
  const de='Der Erste des Monats. Rechnungen sind fällig: '+(rentDue?'Miete 210 € und ':'')+'Nebenkosten 65 €.';
  n={...n,journal:{cs:[...n.journal.cs,cs],de:[...n.journal.de,de]}};
 }
 if(arrears>=2&&s.housingStatus!=='owned'&&s.housingStatus!=='temporary'){
  n={...n,journal:{cs:[...n.journal.cs,'Pronajímatel poslal upomínku. Pokud nezaplatíš, můžeš přijít o bydlení.'],de:[...n.journal.de,'Der Vermieter hat gemahnt. Ohne Zahlung riskierst du die Wohnung.']}};
 }
 if(season!==social.seasonAnnounced){
  const cs=['Do města dorazilo jaro.','Přišlo léto a město ožívá.','Začal podzim.','Napadl první sníh a začala zima.'][season];
  const de=['Der Frühling ist da.','Der Sommer bringt neues Leben.','Der Herbst ist gekommen.','Die ersten Schneeflocken kündigen den Winter an.'][season];
  n={...n,social:{...n.social,seasonAnnounced:season},journal:{cs:[...n.journal.cs,cs],de:[...n.journal.de,de]}};
 }
 return collectReplies(n);
}
export function buyGear(s:TownState,id:string):TownState{
 const item=gearItems.find(x=>x.id===id),social=s.social??defaultSocial();
 if(s.place!=='outfitter'||!item||social.wardrobe.includes(id)||s.wallet<item.price)return s;
 return {...s,wallet:s.wallet-item.price,walletHistory:[...s.walletHistory,s.wallet-item.price],social:{...social,wardrobe:[...social.wardrobe,id]}};
}
export function dayTrip(s:TownState):TownState{
 const social=s.social??defaultSocial();if(s.place!=='mountains'||s.life.energy<30||missingOutfit('mountains',s.day,social.wardrobe).length>0)return s;
 const n=addTime(s,180);
 return {...n,life:{...n.life,energy:Math.max(0,n.life.energy-25),hunger:Math.min(100,n.life.hunger+15)},social:{...social,tripCount:social.tripCount+1},journal:{cs:[...s.journal.cs,'Výlet v horách: turistka se ztratila i s papírovou mapou a nakonec se zeptala ovce na cestu.'],de:[...s.journal.de,'Ausflug in die Berge: Eine Wanderin verläuft sich trotz Papierkarte und fragt schließlich ein Schaf nach dem Weg.']}};
}
export function holiday(s:TownState):TownState{
 const social=s.social??defaultSocial();if(s.place!=='hotel'||s.wallet<2000||social.lastHoliday===s.day)return s;
 const n=addTime(s,48*60);
 return {...n,place:'home',wallet:s.wallet-1200,walletHistory:[...s.walletHistory,s.wallet-1200],social:{...social,lastHoliday:s.day},life:{...n.life,energy:95,hunger:30},journal:{cs:[...s.journal.cs,'Vrátil ses z dovolené. Na recepci tě omylem zapsali jako delegáta konference o hotelových polštářích.'],de:[...s.journal.de,'Zurück aus dem Urlaub. Im Hotel wurdest du versehentlich als Delegierter einer Konferenz über Hotelkissen eingetragen.']}};
}
export function restaurantQuote(s:TownState,guestId?:string):number{
 // One menu price per day and game visit; cents are deterministic so the quoted price never changes while deciding.
 const baseCents=2000+((s.day*137+s.minute*7+s.social.tripCount*59+173)%1947);
 return Math.round(baseCents*(guestId?2:1))/100;
}
export function restaurantMeal(s:TownState,guestId?:string,tipPercent:number=0):TownState{
 if(s.place!=='restaurant')return s;
 const guest=guestId&&s.social.contacts.includes(guestId)&&getBond(s,guestId).warmth>=18?guestId:undefined;
 if(guestId&&!guest)return s;
 const basePrice=restaurantQuote(s,guest);
 const tip=Math.round(basePrice*Math.max(0,Math.min(20,tipPercent))/100*100)/100;
 const price=Math.round((basePrice+tip)*100)/100;
 if(s.wallet<price)return s;
 const n=addTime(s,45);
 const social=guest?{...n.social,bonds:{...n.social.bonds,[guest]:{...getBond(n,guest),warmth:Math.min(100,getBond(n,guest).warmth+4),trust:Math.min(100,getBond(n,guest).trust+2)}}}:n.social;
 return {...n,wallet:Math.round((s.wallet-price)*100)/100,walletHistory:[...s.walletHistory,Math.round((s.wallet-price)*100)/100],
 life:{...n.life,lastMeal:n.day*1440+n.minute,hunger:Math.max(0,n.life.hunger-60),energy:Math.min(100,n.life.energy+9)},social,
 restaurantStory:{...s.restaurantStory,mealComplaint:foodTrouble(s.day,s.minute),mealDay:s.day,chefCalled:false,ownerCalled:false,waiterSatisfaction:Math.max(-10,Math.min(10,(s.restaurantStory.waiterSatisfaction??0)+(tipPercent>=10?2:tipPercent>=5?1:-1)))},
 journal:tipPercent>0?{cs:[...s.journal.cs,`Nechal jsi spropitné ${tip.toFixed(2)} €. Obsluha se usmála.`],de:[...s.journal.de,`Du hast ${tip.toFixed(2)} € Trinkgeld gegeben. Die Bedienung hat gelächelt.`]}:foodTrouble(s.day,s.minute)?{
 cs:[...s.journal.cs,'Večeře dnes chutnala nezvykle slaně. Z kuchyně se ozval povzdech.'],
 de:[...s.journal.de,'Das Abendessen schmeckte heute ungewöhnlich salzig. Aus der Küche kam ein Seufzer.']
 }:s.journal};
}
export function theatreTicket(s:TownState):TownState{
 if(s.place!=='street'&&s.place!=='square'&&s.place!=='theatre')return s;
 const fee=Math.round((11.9+((s.day*17+s.minute)%910)/100)*100)/100;
 if(s.wallet<fee)return s;
 const n=addTime(s,100);
 return {...n,place:'theatre',wallet:Math.round((s.wallet-fee)*100)/100,
 walletHistory:[...s.walletHistory,Math.round((s.wallet-fee)*100)/100],
 journal:{cs:[...s.journal.cs,'Byl jsi v divadle. V druhém dějství se herec zarazil a publikum to považovalo za součást představení.'],
 de:[...s.journal.de,'Du warst im Theater. Im zweiten Akt stockte ein Schauspieler, das Publikum hielt es für Absicht.']}};
}


export function sport(s:TownState,kind:'run'|'bike'|'swim'|'ski'|'downhill'):TownState{
 const social=s.social??defaultSocial(),season=seasonFor(s.day);
 if(s.life.energy<25)return s;
 if(kind==='run'&&(s.place!=='park'||!social.wardrobe.includes('running-shoes')))return s;
 if(kind==='bike'&&(s.place!=='park'||!social.wardrobe.includes('bike')))return s;
 if(kind==='swim'&&(s.place!=='pool'||season!==1||!social.wardrobe.includes('swimsuit')))return s;
 if(kind==='ski'&&(s.place!=='resort'||season!==3||!social.wardrobe.includes('skis')||!social.wardrobe.includes('wintercoat')))return s;
 if(kind==='downhill'&&(s.place!=='resort'||(season!==1&&season!==2)||!social.wardrobe.includes('bike')))return s;
 const n=addTime(s,90);
 return {...n,life:{...n.life,energy:Math.max(0,n.life.energy-12),hunger:Math.min(100,n.life.hunger+13)},
 journal:{cs:[...s.journal.cs,kind==='run'?'Běhání v parku: chtěl jsi předběhnout pana s jezevčíkem. Jezevčík tě nechal vyhrát až na cílové rovince.':kind==='bike'?'Projížďka na kole: cizí pes tě předběhl s výrazem profesionálního závodníka.':kind==='swim'?'Koupání v létě: jeden plavec si zapomněl, že má na sobě sluneční brýle.':kind==='ski'?'Lyžování: stopa vedla přímo ke stánku s čajem. Podezřele praktické.':'Downhill: na sjezdovce tě předjel důchodce s klidným výrazem a zvonkem na řídítkách.'],
 de:[...s.journal.de,kind==='run'?'Joggen im Park: Du wolltest einen Mann mit Dackel überholen. Der Dackel ließ dich erst kurz vor dem Ziel gewinnen.':kind==='bike'?'Radtour: Ein fremder Hund überholt dich mit der Miene eines Profis.':kind==='swim'?'Sommerschwimmen: Ein Schwimmer vergisst, dass er noch seine Sonnenbrille trägt.':kind==='ski'?'Skifahren: Die Spur endet direkt am Teestand. Verdächtig praktisch.':'Downhill: Ein Rentner überholt dich seelenruhig mit Klingel am Lenker.']}};
}
