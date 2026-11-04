import type {TownState} from './world';
import type {Place} from './game';
import {byId} from './residents';
import {addTime} from './life';
import {developBond} from './social';

/** A chance encounter is fixed for the duration of a supermarket visit. */
export type MarketEncounter={residentId:string;kind:'checkout'|'aisle'|'dropped';cs:string;de:string;};
const tips:{place:Place;cs:string;de:string}[]=[
 {place:'park',cs:'Mimochodem, v parku je dnes příjemně. Zkus se tam někdy podívat.',de:'Übrigens, im Park ist es schön. Schau doch irgendwann vorbei.'},
 {place:'cafe',cs:'Na náměstí je skvělá kavárna. Možná by se ti líbila.',de:'Am Marktplatz gibt es ein tolles Café. Vielleicht gefällt es dir.'},
 {place:'library',cs:'V knihovně mají nové knihy. Prý tam bývají i zajímavá setkání.',de:'In der Bibliothek gibt es neue Bücher. Man trifft dort auch interessante Leute.'},
 {place:'theatre',cs:'V divadle chystají představení. Slyšel jsem, že tentokrát bude překvapení.',de:'Im Theater wird ein Stück vorbereitet. Diesmal soll es eine Überraschung geben.'},
 {place:'mountains',cs:'Za městem jsou hezké turistické trasy. S pořádnými botami stojí za výlet.',de:'Außerhalb der Stadt gibt es schöne Wanderwege. Mit guten Schuhen lohnt sich der Ausflug.'}
];
export function supermarketEncounter(s:TownState):MarketEncounter|null{
 if(s.place!=='market'||!s.known.length||s.marketVisits<1||s.marketEncounterResolved===s.marketVisits)return null;
 const seed=(s.day*17+s.marketVisits*31+s.known.length*7);
 // Some visits are completely ordinary; no forced social encounters.
 if(seed%5>=3)return null;
 const known=s.known.filter(id=>!!byId(id));
 if(!known.length)return null;
 const residentId=known[seed%known.length];
 const kind:MarketEncounter['kind']=(['checkout','aisle','dropped'] as const)[seed%3];
 const lines={
 checkout:{cs:'U pokladny tě někdo poznal. „Ty taky nakupuješ takhle na poslední chvíli?“',de:'An der Kasse erkennt dich jemand. „Kaufst du auch immer in letzter Minute ein?“'},
 aisle:{cs:'Mezi regály narazíš na známou tvář. „Tebe bych tady nečekal. Máš chvilku?“',de:'Zwischen den Regalen triffst du ein bekanntes Gesicht. „Dich hätte ich hier nicht erwartet. Hast du kurz Zeit?“'},
 dropped:{cs:'Známému se rozsypou pomeranče. „No výborně. Pomůžeš mi je pochytat?“',de:'Einem Bekannten fallen Orangen herunter. „Na toll. Hilfst du mir beim Einsammeln?“'}
 }[kind];
 return {residentId,kind,...lines};
}
export function respondToSupermarket(s:TownState,answer:'help'|'talk'|'decline'):TownState{
 const encounter=supermarketEncounter(s);
 if(!encounter)return s;
 const {residentId,kind}=encounter;
 const n=addTime(s,answer==='decline'?2:answer==='help'?9:7);
 let next:TownState={...n,marketEncounterResolved:s.marketVisits};
 if(answer==='decline'){
  return {...next,journal:{cs:[...n.journal.cs,'V supermarketu ses s někým známým jen krátce pozdravil.'],de:[...n.journal.de,'Im Supermarkt hast du einen Bekannten nur kurz gegrüßt.']}};
 }
 next=developBond(next,residentId,answer==='help'?'kind':'time');
 const person=byId(residentId);
 const tip=tips[(s.day*3+s.marketVisits+residentId.length)%tips.length];
 const revealed=!s.discovered.includes(tip.place);
 // A tip makes a place discoverable only after the player actually listens.
 next={...next,discovered:[...new Set([...next.discovered,tip.place])],recommended:[...new Set([...next.recommended,tip.place])]};
 const invite=(s.marketVisits+s.day+person!.trait)%4===0;
 const cs=kind==='dropped'&&answer==='help'?'Pomeranče jsou zachráněné. '+(invite?'„Nezajdeme někdy na kávu? Dlužím ti ji.“ ':'')+tip.cs:
  (invite?'„Rád tě vidím. Co kdybychom někdy zašli na kávu?“ ':'')+tip.cs;
 const de=kind==='dropped'&&answer==='help'?'Die Orangen sind gerettet. '+(invite?'„Gehen wir mal einen Kaffee trinken? Ich schulde dir einen.“ ':'')+tip.de:
  (invite?'„Schön, dich zu sehen. Wie wäre es mal mit Kaffee?“ ':'')+tip.de;
 return {...next,journal:{cs:[...next.journal.cs,cs],de:[...next.journal.de,de]},
 marketLastResponse:{cs,de},marketLastResponseVisit:s.marketVisits};
}
