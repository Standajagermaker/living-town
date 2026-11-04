import type {TownState,Lang} from './world';
import {addTime} from './life';
import {byId,moodOf} from './residents';
import type {Place} from './game';
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
 {id:'hiking',price:70,cs:'Turistické boty',de:'Wanderschuhe'}
];
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
 const social=s.social??defaultSocial();if(s.wallet<210)return s;
 return {...s,wallet:s.wallet-210,walletHistory:[...s.walletHistory,s.wallet-210],social:{...social,housingPaidThrough:s.day+14,rentArrears:0}};
}
export function applyNewDay(s:TownState):TownState{
 const social=s.social??defaultSocial(),season=seasonFor(s.day);
 const arrears=s.day>social.housingPaidThrough&&s.day%14===0?social.rentArrears+1:social.rentArrears;
 let n={...s,social:{...social,rentArrears:arrears}};
 if(season!==social.seasonAnnounced){
 const cs=['Do města dorazilo jaro.','Přišlo léto a město ožívá.','Začal podzim.','Napadl první sníh a začala zima.'][season];
 const de=['Der Frühling ist da.','Der Sommer bringt neues Leben.','Der Herbst ist gekommen.','Die ersten Schneeflocken kündigen den Winter an.'][season];
 n={...n,social:{...n.social,seasonAnnounced:season},journal:{cs:[...s.journal.cs,cs],de:[...s.journal.de,de]}};
 }
 return collectReplies(n);
}
export function buyGear(s:TownState,id:string):TownState{
 const item=gearItems.find(x=>x.id===id),social=s.social??defaultSocial();
 if(s.place!=='outfitter'||!item||social.wardrobe.includes(id)||s.wallet<item.price)return s;
 return {...s,wallet:s.wallet-item.price,walletHistory:[...s.walletHistory,s.wallet-item.price],social:{...social,wardrobe:[...social.wardrobe,id]}};
}
export function dayTrip(s:TownState):TownState{
 const social=s.social??defaultSocial();if(s.place!=='mountains'||s.life.energy<30||!social.wardrobe.includes('hiking')||!social.wardrobe.includes(gearFor(s.day)))return s;
 const n=addTime(s,180);
 return {...n,life:{...n.life,energy:Math.max(0,n.life.energy-25),hunger:Math.min(100,n.life.hunger+15)},social:{...social,tripCount:social.tripCount+1},journal:{cs:[...s.journal.cs,'Výlet v horách: turistka se ztratila i s papírovou mapou a nakonec se zeptala ovce na cestu.'],de:[...s.journal.de,'Ausflug in die Berge: Eine Wanderin verläuft sich trotz Papierkarte und fragt schließlich ein Schaf nach dem Weg.']}};
}
export function holiday(s:TownState):TownState{
 const social=s.social??defaultSocial();if(s.place!=='hotel'||s.wallet<2000||social.lastHoliday===s.day)return s;
 const n=addTime(s,48*60);
 return {...n,place:'home',wallet:s.wallet-1200,walletHistory:[...s.walletHistory,s.wallet-1200],social:{...social,lastHoliday:s.day},life:{...n.life,energy:95,hunger:30},journal:{cs:[...s.journal.cs,'Vrátil ses z dovolené. Na recepci tě omylem zapsali jako delegáta konference o hotelových polštářích.'],de:[...s.journal.de,'Zurück aus dem Urlaub. Im Hotel wurdest du versehentlich als Delegierter einer Konferenz über Hotelkissen eingetragen.']}};
}
export function restaurantMeal(s:TownState):TownState{
 if(s.place!=='restaurant'||s.wallet<18)return s;const n=addTime(s,45);
 return {...n,wallet:s.wallet-18,walletHistory:[...s.walletHistory,s.wallet-18],life:{...n.life,hunger:Math.max(0,n.life.hunger-60),energy:Math.min(100,n.life.energy+9)}};
}
