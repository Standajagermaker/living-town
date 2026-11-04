import type {TownState} from './world';
export type HappinessFactor={id:string;cs:string;de:string;value:number;weight:number};
export type HappinessReport={score:number;factors:HappinessFactor[];};
const clamp=(n:number,lo=0,hi=100)=>Math.min(hi,Math.max(lo,n));
/**
 * Living Town v0.8.1 - intentionally provisional life-satisfaction model.
 * Diminishing financial returns, growing expectations, actual wellbeing and
 * connection; even ideal circumstances cannot sustain the theoretical 100%.
 */
export function lifeSatisfaction(s:TownState):HappinessReport{
 const wealth=clamp(100*(1-Math.exp(-Math.max(0,s.wallet)/650)));
 const energy=clamp(s.life.energy);
 const nutrition=clamp(100-s.life.hunger);
 const relationships=Object.values(s.social.bonds??{});
 const close=relationships.filter(b=>b.warmth>=20&&b.trust>=12).length;
 const friends=clamp(18+close*15+Math.min(25,relationships.filter(b=>b.warmth>0).length*4));
 const pet=s.pet?clamp(s.pet.care):45;
 const housing=clamp(s.social.rentArrears===0?76:76-s.social.rentArrears*25);
 const occupation=clamp(s.employment==='employed'?68:s.employment==='warned'?44:20);
 const romance=clamp(s.family.relationship==='married'?90:s.family.relationship==='partner'?78:s.family.relationship==='dating'?66:45);
 const family=clamp(s.family.children>0?65+Math.min(s.family.children,3)*8:50);
 // More knowledge can increase expectations, without portraying learning as intrinsically harmful.
 const expectations=clamp(100-(Math.log1p(Math.max(0,s.mindset))/Math.log(101))*26);
 const factors:HappinessFactor[]=[
  {id:'money',cs:'Finanční jistota',de:'Finanzielle Sicherheit',value:wealth,weight:.18},
  {id:'energy',cs:'Energie',de:'Energie',value:energy,weight:.13},
  {id:'nutrition',cs:'Jídlo a potřeby',de:'Essen und Bedürfnisse',value:nutrition,weight:.10},
  {id:'friends',cs:'Přátelství a důvěra',de:'Freundschaft und Vertrauen',value:friends,weight:.18},
  {id:'housing',cs:'Domov a bezpečí',de:'Zuhause und Sicherheit',value:housing,weight:.10},
  {id:'work',cs:'Smysl a stabilita práce',de:'Sinn und Stabilität der Arbeit',value:occupation,weight:.08},
  {id:'romance',cs:'Partnerský život',de:'Partnerschaft',value:romance,weight:s.playerAge>=18?.08:0},
  {id:'family',cs:'Rodinné vazby',de:'Familienleben',value:family,weight:.04},
  {id:'pet',cs:'Péče a společnost',de:'Fürsorge und Gesellschaft',value:pet,weight:.04},
  {id:'mindset',cs:'Nároky a očekávání',de:'Ansprüche und Erwartungen',value:expectations,weight:.07}
 ];
 const total=factors.reduce((v,f)=>v+f.weight,0);
 const mean=factors.reduce((v,f)=>v+f.value*f.weight,0)/Math.max(.01,total);
 // Human happiness is variable and incomplete, not a perfect-100 achievement.
 return {score:Math.round(clamp(mean*.98,0,98)),factors};
}
export function happinessLabel(score:number,lang:'cs'|'de'){
 if(score<30)return lang==='cs'?'Náročné období':'Schwierige Zeit';
 if(score<50)return lang==='cs'?'Hledání rovnováhy':'Auf der Suche nach Balance';
 if(score<70)return lang==='cs'?'Docela spokojený život':'Recht zufrieden';
 return lang==='cs'?'Daří se ti':'Es läuft gut';
}
