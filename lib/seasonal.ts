import type {Place} from './game';
import {seasonFor} from './social';
export const isVenueOpen=(place:Place,day:number)=>{
 const season=seasonFor(day);
 if(place==='pool')return season===1;
 if(place==='resort')return season===3||season===1||season===2;
 return true;
};
export type VenueStatus={open:boolean;cs:string;de:string};
export function venueStatus(place:Place,day:number):VenueStatus{
 const season=seasonFor(day),open=isVenueOpen(place,day);
 if(place==='pool')return {open,cs:open?'Otevřeno · venkovní plavání':'Zavřeno · plovárna je otevřená jen v létě',de:open?'Geöffnet · Freibad':'Geschlossen · Freibad nur im Sommer'};
 if(place==='resort')return season===3?{open:true,cs:'Otevřeno · lyžování',de:'Geöffnet · Skibetrieb'}:season===1||season===2?{open:true,cs:'Otevřeno · horská kola a downhill',de:'Geöffnet · Mountainbike und Downhill'}:{open:false,cs:'Zavřeno · sezónní přestávka',de:'Geschlossen · Saisonpause'};
 return {open:true,cs:'Otevřeno',de:'Geöffnet'};
}
