import type {Place} from './game';
import {weatherAt} from './weather';
export type ResidentMood='calm'|'cheerful'|'stressed'|'tired'|'irritable'|'curious';
export type Resident={id:string;name:string;age:number;temperament:'warm'|'reserved'|'eccentric'|'skeptical'|'bold'|'shy';trait:number;humor:number;empathy:number;job:Place|null;sideJob:Place|null;homeDistrict:number;vacationStart:number;vacationLength:number;weekendWorker:boolean;officeRole?:'boss'|'overtime'|'remote'|'staff';interests:string[];portrait:string};
const first=['Anton','Mira','Nora','Felix','Hanna','Leon','Klara','Emil','Greta','Theo','Lina','Oskar','Maja','Jonas','Romy','Bruno','Elisa','Tobias','Ida','Karl','Silvia','Juno','Matteo','Vera','Anika','Paul','Amira','Gregor','Sina','Rafael','Nina','Max','Elena','Moritz','Yara','Benedikt','Frida','David','Lotte','Samir','Kira','Arno','Cleo','Tim','Marlene','Milan','Rosa','Hugo','Tara','Vincent'];
const last=['Bauer','Keller','Neumann','Vogel','Schuster','Berger','Wolf','Kraus','Fischer','Lang','Richter','Seidel','Herzog','Kuhn','Ott','Lenz','Winkler','Graf','Hartmann','Beck','Urban','Brunner','Lindner','Weiss','Hofer'];
const types:Resident['temperament'][]=['warm','reserved','eccentric','skeptical','bold','shy'];
export type Interest={id:string;place:Place;cs:string;de:string;season?:number[]};
export const interestCatalog:Interest[]=[
 {id:'dance',place:'square',cs:'Tanec',de:'Tanzen'},
 {id:'hiking',place:'mountains',cs:'Turistika',de:'Wandern',season:[0,1,2]},
 {id:'books',place:'library',cs:'Čtení',de:'Lesen'},
 {id:'fitness',place:'gym',cs:'Fitness',de:'Fitness'},
 {id:'photos',place:'park',cs:'Fotografování',de:'Fotografie'},
 {id:'coffee',place:'cafe',cs:'Kavárny',de:'Cafés'},
 {id:'biking',place:'mountains',cs:'Cyklistika',de:'Radfahren',season:[0,1,2]},
 {id:'swim',place:'pool',cs:'Plavání',de:'Schwimmen',season:[1]},
 {id:'ski',place:'resort',cs:'Lyžování',de:'Skifahren',season:[3]},
 {id:'games',place:'cafe',cs:'Společenské hry',de:'Brettspiele'},
 {id:'gardening',place:'park',cs:'Zahradničení',de:'Gärtnern'},
 {id:'cooking',place:'market',cs:'Vaření',de:'Kochen'},
 {id:'yoga',place:'park',cs:'Jóga',de:'Yoga'},
 {id:'music',place:'square',cs:'Hudba',de:'Musik'},
 {id:'running',place:'park',cs:'Běhání',de:'Laufen'},
 {id:'history',place:'library',cs:'Historie',de:'Geschichte'}
];
function residentInterests(i:number):string[]{
 const count=1+(i%3),ids:string[]=[];
 for(let k=0;k<count;k++){const h=interestCatalog[(i*7+k*5+2)%interestCatalog.length].id;if(!ids.includes(h))ids.push(h);}
 return ids;
}
export type ResidentAppointment={place:Place;interest:Interest;start:number;end:number;day:number};
export function appointmentsFor(r:Resident,day:number):ResidentAppointment[]{
 const i=Math.max(0,Number(r.id.slice(-2))-1),dow=day%7,season=Math.floor(day/14)%4;
 if(day%90>=r.vacationStart&&day%90<r.vacationStart+r.vacationLength)return [];
 return r.interests.flatMap((id,k)=>{
  const h=interestCatalog.find(x=>x.id===id);
  if(!h||(h.season&&!h.season.includes(season)))return [];
  const weekday=(i+k*3+2)%7;
  if(weekday!==dow||(day+i*2+k*11)%13===0)return [];
  const start=(dow<=1?11:18)*60+((i+k)%3)*35;
  return [{interest:h,place:h.place,start,end:start+85,day}];
 });
}
export function currentAppointment(r:Resident,day:number,minute:number){
 return appointmentsFor(r,day).find(x=>minute>=x.start&&minute<x.end);
}
export const residents:Resident[]=first.map((name,i)=>({
 id:'npc-'+String(i+1).padStart(2,'0'),name:name+' '+last[(i*7+3)%last.length],age:19+(i*13)%52,
 temperament:types[(i*5+Math.floor(i/7))%types.length],trait:(i*37+19)%100,humor:(i*17+43)%100,empathy:(i*29+67)%100,
 job:([46,47,49].includes(i)?'restaurant':(['bakery','work','library','square','work','bakery','work','square','library','work'] as Place[])[i%10]),
 sideJob:i%5===0?'bakery':i%7===0?'library':i%9===0?'square':null,
 homeDistrict:i%6,vacationStart:(i*11+24)%85,vacationLength:3+i%9,
 weekendWorker:i%3===0||i%5===0,officeRole:i===4?'boss':i===6?'overtime':i===9?'remote':i%10===4||i%10===6||i%10===9?'staff':undefined,interests:residentInterests(i),portrait:['🧑','👩','👨','👩‍🦰','🧔','👱‍♀️','👨‍🦳','👩‍🦳','🧑‍🦱','👨‍🦰'][i%10]
}));
export const byId=(id:string)=>residents.find(r=>r.id===id);
function hash(n:number){return ((n*1103515245+12345)>>>0)%10000;}
export function moodOf(r:Resident,day:number,minute:number):ResidentMood{
 const hour=Math.floor((minute%1440)/60);
 const energy=hash(day*97+r.age*17+r.trait);
 if(hour<7||hour>21)return 'tired';
 if(hour>=12&&hour<=15&&r.temperament==='eccentric')return 'curious';
 if(energy<15)return 'stressed';
 if(energy<29&&r.temperament==='skeptical')return 'irritable';
 if(energy>70&&r.temperament==='warm')return 'cheerful';
 return 'calm';
}
export function placeFor(r:Resident,day:number,minute:number):Place{
 const hour=Math.floor((minute%1440)/60),dow=day%7;
 const vacation=day%90>=r.vacationStart&&day%90<r.vacationStart+r.vacationLength;
 // The waitress is on duty whenever the restaurant is open; other staff are backstage unless called.
 if(r.id==='npc-47'&&minute>=11*60&&minute<22*60)return 'restaurant';
 const officeRole=r.job==='work'?r.officeRole:undefined;
 // Office is a weekday workplace. Nobody gets an automatic weekend shift.
 // Boss occasionally checks in on Saturdays, and the IT enthusiast often stays late.
 if(officeRole==='remote'){
  // A colleague permanently works from a home computer: visible in messages, never in the office.
  if(hour>=8&&hour<20&&dow>=2)return 'home';
 }else if(officeRole==='boss'&&!vacation){
  if((dow>=2&&dow<=6&&minute>=7*60+45&&minute<17*60)||(dow===0&&(Math.floor(day/7)+r.trait)%3===0&&minute>=10*60&&minute<12*60+30))return 'work';
 }else if(officeRole==='overtime'&&!vacation){
  if(dow>=2&&dow<=6&&minute>=7*60+30&&minute<20*60+30)return 'work';
 }else if(officeRole==='staff'&&!vacation){
  if(dow>=2&&dow<=6&&minute>=8*60&&minute<16*60+30)return 'work';
 }
 const shift=vacation?null:r.job==='work'||r.id==='npc-48'||r.id==='npc-50'?null:(r.sideJob&&dow===6?r.sideJob:(dow>=2&&dow<=6||r.weekendWorker)?r.job:null);
 if(shift&&hour>=8+(r.age%3)&&hour<15+(r.age%5))return shift;
 const interest=currentAppointment(r,day,minute);
 if(interest)return interest.place;
 if(hour>=21||hour<7)return 'home';
 if(hour===7||hour===19)return 'street';
 if(hour>=16&&hour<=18)return (['square','street','library','bakery'] as Place[])[(r.age+day)%4];
 if(hour>=10&&hour<16&&dow<2)return (['square','street','bakery','library'] as Place[])[(r.age+day)%4];
 return r.homeDistrict%2===0?'street':'square';
}
const outdoorPlaces:Place[]=['street','square','park','mountains'];
const originalPlaceFor=placeFor;
export function weatherPlaceFor(r:Resident,day:number,minute:number):Place{
 const place=originalPlaceFor(r,day,minute),weather=weatherAt(day).kind;
 if((weather!=='rain'&&weather!=='storm')||!outdoorPlaces.includes(place))return place;
 if((Number(r.id.slice(-2))*13+day*7+Math.floor(minute/60))%9===0)return place;
 const indoor:Place[]=['cafe','library','market','home'];
 return indoor[(r.trait+day)%indoor.length];
}
export function residentsAt(place:Place,day:number,minute:number):Resident[]{
 // Home belongs to the player, other residents cannot be approached there.
 if(place==='home')return [];
 const found=residents.filter(r=>weatherPlaceFor(r,day,minute)===place).sort((a,b)=>a.id.localeCompare(b.id));
 // A quiet library normally contains a librarian and at most two visitors.
 return outdoorPlaces.includes(place)&&['rain','storm'].includes(weatherAt(day).kind)?found.slice(0,1):place==='library'?found.slice(0,3):found.slice(0,place==='park'?6:7);
}
export function isPresent(id:string,place:Place,day:number,minute:number){
 return residentsAt(place,day,minute).some(r=>r.id===id);
}
