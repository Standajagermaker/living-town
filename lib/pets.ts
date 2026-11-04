import type {TownState,Lang} from './world';
import {addTime} from './life';
export type PetKind='dog'|'cat'|'fish'|'rabbit';
export type Pet={kind:PetKind;name:string;adoptedDay:number;food:number;care:number;lastFedDay:number;lastWalkDay:number;lastPlayedDay:number;};
export const petCatalog:{id:PetKind;cs:string;de:string;adoption:number;dailyCost:number;needsWalk:boolean;}[]=[
{id:'dog',cs:'Pes',de:'Hund',adoption:70,dailyCost:4,needsWalk:true},
{id:'cat',cs:'Kočka',de:'Katze',adoption:55,dailyCost:3,needsWalk:false},
{id:'fish',cs:'Akvarijní rybičky',de:'Aquarienfische',adoption:35,dailyCost:1,needsWalk:false},
{id:'rabbit',cs:'Králík',de:'Kaninchen',adoption:45,dailyCost:2,needsWalk:false}
];
export const petFoodOffer=(day:number)=>Math.round((8.75+((day*13+7)%270)/100)*100)/100;
export function adoptPet(s:TownState,kind:PetKind,name:string):TownState{
 const species=petCatalog.find(p=>p.id===kind);
 if(s.place!=='petshop'||!species||s.pet||s.wallet<species.adoption||!name.trim())return s;
 const n=addTime(s,25),price=species.adoption;
 return {...n,wallet:Math.round((s.wallet-price)*100)/100,walletHistory:[...s.walletHistory,Math.round((s.wallet-price)*100)/100],
 pet:{kind,name:name.trim().slice(0,25),adoptedDay:s.day,food:4,care:85,lastFedDay:s.day,lastWalkDay:s.day,lastPlayedDay:s.day},
 journal:{cs:[...s.journal.cs,'V domě přibyl nový člen domácnosti. Jeho jméno: '+name.trim().slice(0,25)+'.'],de:[...s.journal.de,'Ein neues Familienmitglied ist eingezogen: '+name.trim().slice(0,25)+'.']}};
}
export function buyPetFood(s:TownState):TownState{
 if(s.place!=='petshop'||!s.pet||s.wallet<petFoodOffer(s.day))return s;
 const cost=petFoodOffer(s.day),n=addTime(s,12),balance=Math.round((s.wallet-cost)*100)/100;
 return {...n,wallet:balance,walletHistory:[...s.walletHistory,balance],pet:{...s.pet,food:s.pet.food+5}};
}
export function petNeedsWalk(p:Pet){return petCatalog.find(k=>k.id===p.kind)?.needsWalk??false;}
export function feedPet(s:TownState):TownState{
 if(s.place!=='home'||!s.pet||s.pet.food<=0||s.pet.lastFedDay===s.day)return s;
 const n=addTime(s,10);
 return {...n,pet:{...s.pet,food:s.pet.food-1,lastFedDay:s.day,care:Math.min(100,s.pet.care+9)}};
}
export function walkPet(s:TownState):TownState{
 if(s.place!=='home'||!s.pet||!petNeedsWalk(s.pet)||s.pet.lastWalkDay===s.day||s.life.energy<15)return s;
 const n=addTime(s,40);
 return {...n,pet:{...s.pet,lastWalkDay:s.day,care:Math.min(100,s.pet.care+18)},life:{...n.life,energy:Math.max(0,n.life.energy-9)},
 journal:{cs:[...s.journal.cs,'Na procházce se '+s.pet.name+' rozhodl(a), že nejzajímavější místo je úplně obyčejný strom.'],de:[...s.journal.de,'Beim Spaziergang findet '+s.pet.name+' ausgerechnet einen ganz gewöhnlichen Baum am spannendsten.']}};
}
export function playWithPet(s:TownState):TownState{
 if(s.place!=='home'||!s.pet||s.pet.lastPlayedDay===s.day)return s;
 const n=addTime(s,s.pet.kind==='fish'?12:25);
 return {...n,pet:{...s.pet,lastPlayedDay:s.day,care:Math.min(100,s.pet.care+12)}};
}
export function petAtNewDay(p:Pet,day:number):Pet{
 const days=Math.max(1,day-Math.max(p.lastFedDay,p.adoptedDay));
 const walkMissed=petNeedsWalk(p)&&p.lastWalkDay<day-1;
 const decay=days*8+(walkMissed?12:0);
 return {...p,care:Math.max(0,p.care-decay)};
}
export function petLabel(p:Pet,lang:Lang){return petCatalog.find(x=>x.id===p.kind)?.[lang]??p.kind;}
