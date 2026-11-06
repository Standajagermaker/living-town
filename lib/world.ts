import {byId,isPresent,moodOf,placeFor,residents,residentsAt,currentAppointment,interestCatalog,type Resident} from './residents';
import type {Place,Lang} from './game';
import {initialLife,addTime,eventsForDay,type LifeState} from './life';
import {defaultSocial,developBond,applyNewDay,type SocialState} from './social';
import {contextualOptions,contextualResponse} from './dialogue';
import {isVenueOpen} from './seasonal';
import {restaurantCast,initialRestaurantStory,type RestaurantStory,foodTrouble} from './restaurantStory';
import {nextUnusedFact} from './facts';
import {weatherAt} from './weather';
import {seasonFor,missingOutfit} from './social';
import {type Pet} from './pets';
import {supermarketEncounter} from './marketEncounter';
import {arrival083,greeting083,v083} from './living083';
export type {Place,Lang};
export type Topic='hello'|'name'|'about'|'advice'|'job'|'event'|'hobby'|'followup'|'thanks'|'bye'|'custom'|'contact'|'flirt'|'invite';
export type Turn={role:'player'|'npc';cs:string;de:string;raw?:string};
export type Conversation={open:boolean;topic:Topic|null;asked:string[];turns:Turn[];repeat:number;visits:number;lastSeen:number};
export type MissionId='meet'|'discover'|'work'|'buy'|'read'|'quiz'|'research';
export type Answer={id:string;topic:Topic;cs:string;de:string};
export type Quiz={id:string;cs:{question:string;options:string[];explanation:string};de:{question:string;options:string[];explanation:string};correct:number;points:number};
export const quizzes:Quiz[]=[
 {id:'listen',cs:{question:'Co je dobrá reakce, když ti někdo vypráví nepříjemný zážitek?',options:['Hned poradit, co měl udělat.','Nejdřív naslouchat a ověřit, zda chce radu.','Změnit téma na něco pozitivního.'],explanation:'Aktivní naslouchání znamená nejdřív porozumět, ne automaticky problém opravovat.'},de:{question:'Wie reagierst du gut, wenn jemand von einer schweren Erfahrung erzählt?',options:['Sofort einen Rat geben.','Erst zuhören und fragen, ob Rat erwünscht ist.','Das Thema wechseln.'],explanation:'Aktives Zuhören heißt zunächst verstehen, statt sofort eine Lösung anzubieten.'},correct:1,points:5},
 {id:'sources',cs:{question:'Jak nejlépe ověříš senzační zprávu na internetu?',options:['Podle počtu sdílení.','Podle sebevědomého tónu autora.','Prověřím původ a další nezávislý zdroj.'],explanation:'Důvěryhodnost podporují ověřitelná fakta, dohledatelný zdroj a nezávislé potvrzení.'},de:{question:'Wie prüfst du eine sensationelle Nachricht?',options:['Anhand der Anzahl der Likes.','Anhand des selbstbewussten Tons.','Ursprung und unabhängige Quelle prüfen.'],explanation:'Verlässliche Informationen beruhen auf überprüfbaren Fakten und unabhängiger Bestätigung.'},correct:2,points:5},
 {id:'boundaries',cs:{question:'Někdo odmítne tvoje pozvání. Co je respektující odpověď?',options:['Ještě jednou ho přesvědčovat.','Přijmout odpověď a nechat mu prostor.','Zeptat se všech jeho přátel proč.'],explanation:'Respektování hranic zachovává autonomii druhého člověka a vytváří bezpečnější kontakt.'},de:{question:'Jemand lehnt deine Einladung ab. Wie reagierst du respektvoll?',options:['Noch mehr Überzeugungsversuche.','Die Antwort akzeptieren und Raum lassen.','Alle Freunde nach dem Grund fragen.'],explanation:'Grenzen zu respektieren wahrt die Selbstbestimmung und erleichtert sicheren Kontakt.'},correct:1,points:6},
 {id:'probability',cs:{question:'Hodíš dvakrát férovou mincí a padne panna. Jaká je šance na pannu při třetím hodu?',options:['25 %','50 %','75 %'],explanation:'Nezávislé hody se neovlivňují. U férové mince zůstává pravděpodobnost 50 %.'},de:{question:'Eine faire Münze zeigt zweimal Kopf. Wie hoch ist die Chance auf Kopf beim dritten Wurf?',options:['25 %','50 %','75 %'],explanation:'Unabhängige Münzwürfe beeinflussen sich nicht. Die Wahrscheinlichkeit bleibt bei 50 %.'},correct:1,points:4},
 {id:'memory',cs:{question:'Co obvykle nejlépe pomůže dlouhodobému zapamatování?',options:['Opakovat učivo s časovými odstupy.','Číst text stále dokola bez přestávky.','Učit se jen těsně před testem.'],explanation:'Rozložené opakování pomáhá udržet informace dlouhodobě.'},de:{question:'Was hilft meist am besten beim langfristigen Lernen?',options:['Mit zeitlichem Abstand wiederholen.','Ohne Pause immer weiter lesen.','Nur direkt vor dem Test lernen.'],explanation:'Verteiltes Wiederholen unterstützt langfristiges Behalten.'},correct:0,points:5}
];
export const placeNames:Record<Place,Record<Lang,string>>={
 home:{cs:'Domov',de:'Zuhause'},street:{cs:'Ulice',de:'Straße'},bakery:{cs:'Pekárna',de:'Bäckerei'},
 square:{cs:'Náměstí',de:'Marktplatz'},work:{cs:'Práce',de:'Arbeitsplatz'},library:{cs:'Knihovna',de:'Bibliothek'},
 market:{cs:'Supermarket',de:'Supermarkt'},cafe:{cs:'Kavárna',de:'Café'},park:{cs:'Park',de:'Park'},
 church:{cs:'Kostel',de:'Kirche'},hotel:{cs:'Hotel',de:'Hotel'},gym:{cs:'Fitness',de:'Fitnessstudio'},mountains:{cs:'Hory',de:'Berge'},restaurant:{cs:'Restaurace',de:'Restaurant'},outfitter:{cs:'Sportovní obchod',de:'Sportgeschäft'},pool:{cs:'Venkovní plovárna',de:'Freibad'},resort:{cs:'Horské středisko',de:'Bergsportzentrum'},bank:{cs:'Banka',de:'Bank'},theatre:{cs:'Divadlo',de:'Theater'},petshop:{cs:'Zverimex',de:'Tierhandlung'},train:{cs:'Vlakové nádraží',de:'Bahnhof'},hospital:{cs:'Nemocnice',de:'Krankenhaus'},school:{cs:'Škola',de:'Schule'}
};
export const links:Record<Place,Place[]>={home:['street'],street:['home','bakery','square','work','library','market','cafe','park','church','hotel','gym','mountains','restaurant','outfitter','pool','resort','bank','theatre','petshop','train','hospital','school'],bakery:['street'],square:['street','library','cafe','park','church','market','hotel','gym','restaurant','outfitter'],work:['street'],library:['street','square'],market:['street','square'],cafe:['street','square'],park:['street','square','mountains'],church:['street','square'],hotel:['street','square'],gym:['street','square'],mountains:['street','park'],restaurant:['street','square'],outfitter:['street','square'],pool:['street','park'],resort:['street','mountains'],bank:['street','square'],theatre:['street','square'],petshop:['street','square'],train:['street','square'],hospital:['street','square'],school:['street','square']};
export type TownState={
 v083?:import('./living083').V083;
 office089?:{day:number;step:number;last:{cs:string;de:string}};
 gymMembership?:{plan:'one'|'two'|'three';paidThrough:number;visits:number[];lastVisitDay:number};
 version:number;playerName?:string;playerGender?:'female'|'male'|'other';place:Place;day:number;minute:number;wallet:number;mindset:number;employment:'employed'|'warned'|'fired';absences:number;lastShift:number;life:LifeState;social:SocialState;
 discovered:Place[];recommended:Place[];known:string[];selectedNpc:string|null;
 conversations:Record<string,Conversation>;completed:string[];journal:{cs:string[];de:string[]};
 playerAge:number;ageConfirmed:boolean;stress:number;vacationDays:number;onHoliday:boolean;travelCity:'home'|'lake'|'historic'|'alps';workShifts:number;careerRank:number;monthlyBilling:number;utilitiesDue:number;housingStatus:'rented'|'warning'|'temporary'|'owned';family:{relationship:'single'|'dating'|'partner'|'married';partnerId?:string;children:number};pet:Pet|null;
 completedQuiz:string[];lastRead:number;lastResearch:number;walletHistory:number[];restaurantStory:RestaurantStory;factsSeen:string[];lastFactDay:number;marketVisits:number;marketEncounterResolved:number;marketLastResponse?:{cs:string;de:string};marketLastResponseVisit?:number;storySeen:string[];storyPending:{dueDay:number;cs:string;de:string}[];socialTickDay:number;crushId:string|null;railTalkDay:number;railTalkOutcome?:{cs:string;de:string};railIncident?:{kind:'meeting'|'connection'|'stranger'|'hotel';day:number;seed:number};
};
const fresh=():Conversation=>({open:false,topic:null,asked:[],turns:[],repeat:0,visits:0,lastSeen:-1});
export function initialTown():TownState{return {
 version:8,gymMembership:undefined,playerName:'',playerGender:'other',place:'home',day:0,minute:10*60+30,wallet:85,mindset:12,playerAge:25,ageConfirmed:false,stress:15,vacationDays:24,onHoliday:false,travelCity:'home',workShifts:0,careerRank:0,monthlyBilling:-1,utilitiesDue:0,housingStatus:'rented',family:{relationship:'single',children:0},pet:null,employment:'employed',absences:0,lastShift:-1,life:initialLife(),social:defaultSocial(),
 discovered:['home','street','bakery','work','market','restaurant'],recommended:[],known:[],selectedNpc:null,conversations:{},
 completed:[],journal:{cs:['Přistěhoval ses do městečka.'],de:['Du bist in die Stadt gezogen.']},
 completedQuiz:[],lastRead:-1,lastResearch:-1,walletHistory:[85],restaurantStory:initialRestaurantStory(),factsSeen:[],lastFactDay:-1,marketVisits:0,marketEncounterResolved:-1,storySeen:[],storyPending:[],socialTickDay:-1,crushId:null,railTalkDay:-1
};}
export function restoreTown(raw:unknown):TownState{
 const freshState=initialTown();
 if(!raw||typeof raw!=='object')return freshState;
 const v=raw as Partial<TownState>;
 if(v.version!==5&&v.version!==6&&v.version!==7&&v.version!==8)return freshState;
 return {...freshState,...v,version:8,discovered:[...new Set([...freshState.discovered,...(v.discovered??[])])],life:{...initialLife(),...(v.life??{})},social:{...defaultSocial(),...(v.social??{})},conversations:v.conversations??{},journal:v.journal??freshState.journal,restaurantStory:{...initialRestaurantStory(),...(v.restaurantStory??{})},factsSeen:v.factsSeen??[],lastFactDay:v.lastFactDay??-1,marketVisits:v.marketVisits??0,marketEncounterResolved:v.marketEncounterResolved??-1,storySeen:v.storySeen??[],storyPending:v.storyPending??[],socialTickDay:v.socialTickDay??-1,crushId:v.crushId??null,railTalkDay:v.railTalkDay??-1,railTalkOutcome:v.railTalkOutcome,playerAge:v.playerAge??25,ageConfirmed:v.ageConfirmed??false,family:{relationship:'single',children:0,...v.family},pet:v.pet??null,gymMembership:v.gymMembership,stress:v.stress??15,vacationDays:v.vacationDays??24,onHoliday:v.onHoliday??false,travelCity:v.travelCity??'home',workShifts:v.workShifts??0,careerRank:v.careerRank??0,monthlyBilling:v.monthlyBilling??-1,utilitiesDue:v.utilitiesDue??0,housingStatus:v.housingStatus??'rented'};
}
export const clock=(m:number)=>String(Math.floor((m%1440)/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
export const dayLabel=(day:number,lang:Lang)=>(lang==='cs'?['So','Ne','Po','Út','St','Čt','Pá']:['Sa','So','Mo','Di','Mi','Do','Fr'])[day%7];
export const occupant=(s:TownState)=>{
 const regular=residentsAt(s.place,s.day,s.minute);
 const event=eventsForDay(s.day).find(e=>e.place===s.place&&s.life.visited.includes(e.id));
 const attendees=event?event.attendees.map(byId).filter((r):r is Resident=>!!r):[];
 const outings=s.place==='mountains'&&s.minute>=8*60&&s.minute<19*60?residents.filter(r=>(Number(r.id.slice(-2))+s.day)%7===0).slice(0,5):s.place==='restaurant'&&s.minute>=11*60&&s.minute<21*60?residents.filter(r=>(Number(r.id.slice(-2))+s.day)%9===0).slice(0,4):[];
 const staff=s.place==='restaurant'?[
  ...(s.restaurantStory?.chefCalled?[byId(restaurantCast.chef)]:[]),
  ...(s.restaurantStory?.ownerCalled?[byId(restaurantCast.owner)]:[])
 ].filter((r):r is Resident=>Boolean(r)):[];
 const market=supermarketEncounter(s);
 const familiar=market?[byId(market.residentId)].filter((r):r is Resident=>Boolean(r)):[];
 return [...new Map([...regular,...attendees,...outings,...staff,...familiar].map(r=>[r.id,r])).values()];
};
export function callRestaurantStaff(s:TownState,role:'chef'|'owner'):TownState{
 if(s.place!=='restaurant'||s.minute<11*60||s.minute>=22*60)return s;
 if(role==='chef'){
  return {...s,restaurantStory:{...s.restaurantStory,chefCalled:true},minute:s.minute+3};
 }
 return {...s,restaurantStory:{...s.restaurantStory,ownerCalled:true},minute:s.minute+5};
}
export function gameLevel(s:TownState){return 1+Math.floor(s.workShifts/4)+Math.floor(s.known.length/6)+Math.floor(s.mindset/45);}
export function locationAccess(s:TownState,to:Place):{allowed:boolean;cs:string;de:string}{
 const missing=missingOutfit(to,s.day,s.social.wardrobe);
 if(missing.length)return {allowed:false,cs:'Nejdřív potřebuješ vhodné vybavení ze sportovního obchodu.',de:'Du brauchst zunächst passende Ausrüstung aus dem Sportgeschäft.'};
 if(to==='hotel'&&!s.onHoliday)return {allowed:false,cs:'Hotel slouží k přespání v cizím městě na dovolené.',de:'Das Hotel dient zur Übernachtung in der Reisestadt.'};
 if(to==='work'&&s.onHoliday)return {allowed:false,cs:'Na dovolené do své práce nemůžeš.',de:'Im Urlaub kannst du nicht an deinem Arbeitsplatz arbeiten.'};
 if(to==='gym'&&s.onHoliday)return {allowed:false,cs:'V cizím městě nemáš členství ve fitness.',de:'In der Reisestadt hast du kein Fitnessstudio-Abo.'};
 if(to==='home'&&s.onHoliday)return {allowed:false,cs:'Tvůj domov je v původním městě. Nejdřív se vrať vlakem.',de:'Dein Zuhause liegt in der Heimatstadt. Fahre zuerst mit dem Zug zurück.'};
 const levels:Partial<Record<Place,number>>={mountains:2,church:2,theatre:2,bank:2,resort:3};
 if(gameLevel(s)<(levels[to]??1))return {allowed:false,cs:'Toto místo se odemkne na úrovni '+levels[to]+'.',de:'Dieser Ort wird ab Level '+levels[to]+' freigeschaltet.'};
 if(!isVenueOpen(to,s.day))return {allowed:false,cs:'Místo je mimo sezonu zavřené.',de:'Dieser Ort ist außerhalb der Saison geschlossen.'};
 return {allowed:true,cs:'',de:''};
}
export const canGo=(s:TownState,to:Place)=>s.place===to||(links[s.place].includes(to)&&s.discovered.includes(to)&&locationAccess(s,to).allowed);
// Travel always takes time when changing locations, including clicking an already-discovered map pin.
export function travelMinutes(from:Place,to:Place,day:number):number{
 if(from===to)return 0;
 const far=new Set<Place>(['mountains','resort','hotel','pool','train']);
 const distant=far.has(from)||far.has(to);
 const nearby=new Set<Place>(['square','street','bakery','cafe','library','bank','theatre','restaurant']);
 const close=nearby.has(from)&&nearby.has(to);
 const base=distant?28:close?7:13;
 const kind=weatherAt(day).kind;
 return base+(kind==='storm'?8:kind==='rain'||kind==='snow'?4:0);
}
function moveTo(s:TownState,to:Place):TownState{
 if(to===s.place)return s;
 const n=addTime(s,travelMinutes(s.place,to,s.day));
 const abandoned=s.place==='work'&&to!=='work'&&s.day%7>=2&&s.lastShift!==s.day&&s.minute>=8*60&&s.minute<16*60;
 const absences=abandoned?s.absences+1:s.absences;
 const employment=abandoned?(absences>=2?'fired':'warned'):s.employment;
 const next={...n,place:to,selectedNpc:null,absences,employment,marketVisits:to==='market'?s.marketVisits+1:s.marketVisits,marketLastResponse:undefined};
 const moved=arrival083(next);
 return abandoned?note(moved,absences>=2?'Znovu jsi opustil pracoviště bez svolení. Zaměstnavatel tě propustil.':'Odešel jsi z pracoviště bez upozornění. Šéf si toho všiml a při dalším přestupku budou následovat důsledky.',absences>=2?'Du hast den Arbeitsplatz erneut unangemeldet verlassen. Der Arbeitgeber hat dich entlassen.':'Du hast den Arbeitsplatz ohne Meldung verlassen. Dein Chef hat es bemerkt. Beim nächsten Mal folgen Konsequenzen.'):moved;
}
export function go(s:TownState,to:Place):TownState{
 if(!canGo(s,to))return s;
 return moveTo(s,to);
}
export function fastTravel(s:TownState,to:Place):TownState{
 if(!s.discovered.includes(to)||!locationAccess(s,to).allowed)return s;
 return moveTo(s,to);
}
export function goRecommended(s:TownState,to:Place):TownState{
 if(!s.recommended.includes(to)||!s.discovered.includes(to)||!locationAccess(s,to).allowed)return go(s,to);
 return moveTo(s,to);
}
const pair=(cs:string,de:string)=>({cs,de});
export function note(s:TownState,cs:string,de:string):TownState{return {...s,journal:{cs:[...s.journal.cs,cs],de:[...s.journal.de,de]}};}
export function startConversation(s:TownState,id:string):TownState{
 if(!occupant(s).some(r=>r.id===id))return s;
 const r=byId(id)!; const prior=s.conversations[id]??fresh();if(prior.open)return {...s,selectedNpc:id};
 const longAgo=prior.lastSeen>=0&&s.day-prior.lastSeen>=8;
 const openerOptions=[
  pair('Ty jsi tady nový? Co tě sem přivedlo?','Bist du neu hier? Was führt dich her?'),
  pair('Podívej se na to počasí. Co na něj říkáš?','Schau dir das Wetter an. Was sagst du dazu?'),
  pair('Promiň, nevíš, kolik je hodin?','Entschuldige, weißt du, wie spät es ist?'),
  pair('Už jsi tu někdy byl?','Warst du schon einmal hier?'),
  pair('Čekáš tu taky na někoho?','Wartest du auch auf jemanden?'),
  pair('Zrovna přemýšlím, kam dnes vyrazit. Máš nějaký tip?','Ich überlege gerade, wohin ich heute gehe. Hast du einen Tipp?'),
  pair('Je dnes nějak rušno, nemyslíš?','Heute ist ziemlich viel los, findest du nicht?'),
  pair('Ahoj. Líbí se ti to tu?','Hallo. Gefällt es dir hier?')
 ];
 const first=openerOptions[(Number(id.slice(-2))*13+s.day*7+s.minute+prior.visits*17)%openerOptions.length];
 const greetings=prior.visits>0?(longAgo?
 pair('Ty jsi tu dlouho nebyl! Co se u tebe změnilo?','Du warst ja lange nicht hier! Was hat sich bei dir verändert?'):
 openerOptions[(Number(id.slice(-2))*7+s.day*11+prior.visits*3)%openerOptions.length]):first;
 const mood=moodOf(r,s.day,s.minute);
 const venue= s.place;
 const restaurantRole=id===restaurantCast.waitress?'waitress':id===restaurantCast.chef?'chef':id===restaurantCast.owner?'owner':null;
 const placePrompt=venue==='restaurant'&&restaurantRole?(
 restaurantRole==='waitress'?pair('Dobrý den, dáte si něco k jídlu, nebo se chcete nejprve podívat na nabídku?','Guten Tag. Möchten Sie etwas essen oder erst die Speisekarte sehen?'):
 restaurantRole==='chef'?pair('Volali jste mě? Je něco v nepořádku s jídlem?','Sie haben mich rufen lassen? Stimmt etwas mit dem Essen nicht?'):
 pair('Dobrý den, jsem majitel. Potřebujete něco vyřešit?','Guten Tag, ich bin der Inhaber. Kann ich Ihnen helfen?')
 ):venue==='bakery'?(
    (s.minute%180<80)?pair('Pane, dnes máme fofr. Vyberte si prosím, co to bude?','Heute ist viel los! Bitte entscheiden Sie sich. Was darf es sein?'):
    pair('Dobrý den, co to bude? Máme čerstvé preclíky a chléb.','Guten Tag! Was darf es sein? Wir haben frische Brezeln und Brot.')
  ):venue==='work'?(
    s.minute<12*60?pair('Dobré ráno, co máš dnes na stole za úkoly?','Guten Morgen, was steht heute bei dir an?'):
    pair('Už jsi vyřídil dnešní úkoly?','Hast du deine Aufgaben für heute erledigt?')
  ):venue==='library'?pair('Hledáte něco konkrétního ke čtení?','Suchen Sie etwas Bestimmtes zum Lesen?'):
   venue==='cafe'?pair('Co si dáte? Kávu, nebo čaj?','Was darf es sein? Kaffee oder Tee?'):
   venue==='bank'?pair('Přejete si poradit s účtem, nebo úvěrem?','Geht es um Ihr Konto oder einen Kredit?'):
   venue==='gym'?pair('Jdete dnes cvičit?','Trainierst du heute?'):null;
 const contextual=prior.visits>0&&venue!=='restaurant'?greeting083(s,id):null;
 const prompt=(contextual??placePrompt)??(mood==='tired'?pair('Dnes už jsem trochu unavená, ale chvíli mám.','Ich bin heute etwas müde, aber kurz habe ich Zeit.'):greetings);
 const bond=s.social?.bonds[id];
 const away=!!currentAppointment(r,s.day,s.minute);
 const reluctant=(mood==='irritable'||mood==='stressed'||mood==='tired')&&(r.trait+s.day*7)%5<=2;
 const refuses=venue==='restaurant'||venue==='bakery'||venue==='work'||venue==='library'?false:(bond?.warmth??0)<-12||(reluctant&&prior.visits===0);
 const line=refuses
  ?pair(away?'Promiň, teď mám svoje plány. Rád si je nechám pro sebe. Měj se!':'Omlouvám se, dnes nemám chuť si povídat. Měj se!','Tut mir leid, ich habe gerade eigene Pläne und möchte sie für mich behalten. Bis dann!')
  :prompt;
 const forget=prior.lastSeen>=0&&s.day-prior.lastSeen>=10;
 const remembered=forget?{...prior,asked:prior.asked.slice(-3),topic:null,repeat:0}:prior;
 const n={...s,v083:{...v083(s),greeting:null},selectedNpc:id,conversations:{...s.conversations,[id]:{...remembered,open:!refuses,visits:prior.visits+1,lastSeen:s.day,turns:[...prior.turns,{role:'npc' as const,...line}]}}};
 return refuses?n:developBond(n,id,'time');
}
export function exitConversation(s:TownState):TownState{
 if(!s.selectedNpc)return s;
 const id=s.selectedNpc,prev=s.conversations[id]??fresh();
 const bye=pair('Díky za rozhovor. Tak zase někdy!','Danke für das Gespräch. Bis zum nächsten Mal!');
 return {...s,conversations:{...s.conversations,[id]:{...prev,open:false,turns:[...prev.turns,{role:'npc',...bye}] }},selectedNpc:null};
}
export function choices(s:TownState,lang:Lang):Answer[]{
 const id=s.selectedNpc;if(!id)return [];
 const r=byId(id),m=s.conversations[id]??fresh();if(!r||!m.open)return [];
 const all:Answer[]=[
 {id:'name',topic:'name',cs:'Jak se jmenuješ?',de:'Wie heißen Sie?'},
 {id:'about',topic:'about',cs:'Co tě sem přivedlo?',de:'Was führt Sie hierher?'},
 {id:'job',topic:'job',cs:'Co dnes děláš?',de:'Was machen Sie heute?'},
 {id:'advice',topic:'advice',cs:'Co bys mi ve městě doporučil?',de:'Was würden Sie mir in der Stadt empfehlen?'},
 {id:'hobby',topic:'hobby',cs:'Co tě baví ve volném čase?',de:'Was machen Sie gerne in der Freizeit?'},
 {id:'event',topic:'event',cs:'Neděje se dnes něco zajímavého?',de:'Ist heute etwas Interessantes los?'}
 ];
 const follow:Record<Topic,[string,string,string,string]>={
 contact:['Máš raději zprávy nebo telefon?','Schreiben Sie lieber oder telefonieren Sie?','Můžu ti někdy napsat?','Darf ich dir irgendwann schreiben?'],
 flirt:['To tě rozesmálo?','Hat dich das zum Lachen gebracht?','Co tě nejvíc baví na lidech?','Was magst du an Menschen?'],
 invite:['Mohli bychom se někdy potkat venku?','Könnten wir uns mal draußen treffen?','Co by se ti líbilo?','Was würde dir gefallen?'],
 name:['Těší mě. Jak dlouho tu bydlíš?','Freut mich! Wie lange wohnen Sie schon hier?','A znáš tu hodně lidí?','Kennen Sie hier viele Leute?'],
 advice:['A kudy se tam dostanu?','Und wie komme ich dorthin?','Co se ti tam nejvíc líbí?','Was gefällt Ihnen dort am besten?'],
 event:['Kdy se to koná?','Wann findet das statt?','Půjdeš tam taky?','Werden Sie auch dort sein?'],
 job:['A co tě na práci baví?','Was gefällt Ihnen an der Arbeit?','Nemáš toho dnes hodně?','Ist heute viel zu tun?'],
 hobby:['Jak ses k tomu dostal?','Wie bist du dazu gekommen?','Doporučil bys mi to zkusit?','Würdest du mir das empfehlen?'],
 about:['Jak dlouho to tak máš?','Wie lange ist das schon so?','A co plánuješ dál?','Was planen Sie als Nächstes?'],
 followup:['To dává smysl. A co potom?','Das klingt nachvollziehbar. Und danach?','Jak to celé dopadlo?','Wie ging es dann aus?'],
 hello:['Jaký máš dnes den?','Wie läuft Ihr Tag?','Máš chvilku?','Haben Sie einen Moment?'],
 thanks:['Uvidíme se zase?','Sehen wir uns wieder?','Měj se hezky.','Machen Sie es gut.'],
 bye:['Měj se.','Machen Sie es gut.','Díky.','Danke.'],custom:['To je zajímavé. A dál?','Interessant. Und weiter?','Co si o tom myslíš ty?','Was denken Sie darüber?']};
 const f=m.topic?follow[m.topic]:null;
 const lastNpc=[...m.turns].reverse().find(x=>x.role==='npc');
 const actual=contextualOptions(lastNpc,lang,m.turns.length);
 const context=f?[{id:'follow-'+m.turns,topic:'followup' as Topic,cs:f[0],de:f[1]},{id:'opinion-'+m.turns,topic:'followup' as Topic,cs:f[2],de:f[3]}]:[];
 const social=s.social??defaultSocial();
 const bond=s.social?.bonds[id];
 if((bond?.warmth??0)>=12&&(bond?.trust??0)>=8&&!social.contacts.includes(id)&&s.day>=(bond?.cooldownUntil??-1))all.push({id:'contact',topic:'contact',cs:'Mohl bych si na tebe vzít kontakt?',de:'Dürfte ich deine Nummer haben?'});
 if(s.ageConfirmed&&s.playerAge>=18&&(bond?.trust??0)>=10&&r.age>=18)all.push({id:'flirt',topic:'flirt',cs:'S tebou je docela příjemné povídání.',de:'Mit dir kann man sich wirklich angenehm unterhalten.'});
 if(s.ageConfirmed&&s.playerAge>=18&&r.age>=18&&s.place==='work'&&(bond?.warmth??0)>=18&&(bond?.trust??0)>=16)
  all.push({id:'workplace-interest',topic:'flirt',cs:'Nechtěl(a) bys někdy po práci zajít na kávu? Bez očekávání.',de:'Hättest du nach der Arbeit mal Lust auf einen Kaffee? Ganz ohne Erwartungen.'});
  if(s.ageConfirmed&&s.playerAge>=18&&r.age>=18&&(bond?.warmth??0)>=15)all.push({id:'invite',topic:'invite',cs:'Nezajdeme někdy na kávu?',de:'Wollen wir irgendwann mal einen Kaffee trinken gehen?'});
 const lived=s.life.experiences??[];
 const unlocked:Answer[]=[];
 if(lived.includes('movies'))unlocked.push({id:'movies-chat',topic:'followup',cs:'Včera jsem koukal na zajímavý film. Co ráda sleduješ?',de:'Gestern habe ich einen interessanten Film gesehen. Was schaust du gern?'});
 if(lived.includes('local-news'))unlocked.push({id:'local-news-chat',topic:'followup',cs:'Četl jsem novinky z města. Zaznamenala jsi něco zajímavého?',de:'Ich habe die Stadtneuigkeiten gelesen. Ist dir etwas aufgefallen?'});
 if(lived.includes('books'))unlocked.push({id:'book-chat',topic:'followup',cs:'Nedávno jsem dočetl knihu. Čteš ráda?',de:'Ich habe kürzlich ein Buch beendet. Liest du gern?'});
 if(s.completed.includes('work'))unlocked.push({id:'work-chat',topic:'followup',cs:'Dneska jsem měl v práci docela zajímavý den. A ty?',de:'Mein Arbeitstag war heute ziemlich interessant. Und deiner?'});
 all.push(...unlocked);
 const unused=all.filter(c=>c.id==='contact'||!m.asked.includes(c.id));
 const hello=m.turns.length<=1?[{id:'new-here',topic:'hello' as Topic,cs:'Ano, právě jsem se přistěhoval.',de:'Ja, ich bin gerade hergezogen.'},{id:'hello-day',topic:'hello' as Topic,cs:'Zatím se rozkoukávám. A co ty?',de:'Ich schaue mich noch um. Und wie geht es Ihnen?'}]:[];
 const npcQuestion=lastNpc&&/\?/.test(lastNpc[lang]);
 const restaurantAnswers:Answer[]=s.place==='restaurant'?(
 id===restaurantCast.waitress?[
  {id:'rest-menu-'+m.turns.length,topic:'followup',cs:'Nejdřív si prohlédnu nabídku.',de:'Ich sehe mir erst die Speisekarte an.'},
  {id:'rest-dinner-'+m.turns.length,topic:'followup',cs:'Rád bych se tu najedl.',de:'Ich würde gern etwas essen.'},
  {id:'rest-staff-'+m.turns.length,topic:'followup',cs:'Kdo dnes vaří?',de:'Wer kocht heute?'}
 ]:id===restaurantCast.chef?[
  {id:'rest-complain-'+m.turns.length,topic:'followup',cs:'Jídlo bylo dnes přesolené.',de:'Das Essen war heute versalzen.'},
  {id:'rest-calm-'+m.turns.length,topic:'followup',cs:'Chtěl jsem se jen zeptat, co doporučujete.',de:'Ich wollte nur fragen, was Sie empfehlen.'},
  {id:'rest-chef-good-'+m.turns.length,topic:'followup',cs:'Jídlo mi chutnalo, děkuju.',de:'Das Essen hat mir geschmeckt, danke.'}
 ]:[
  {id:'rest-owner-service-'+m.turns.length,topic:'followup',cs:'Rád bych s vámi probral obsluhu.',de:'Ich würde gern über den Service sprechen.'},
  {id:'rest-owner-hello-'+m.turns.length,topic:'followup',cs:'Jen jsem vás chtěl pozdravit.',de:'Ich wollte nur Hallo sagen.'},
  {id:'rest-owner-staff-'+m.turns.length,topic:'followup',cs:'Máte tu zajímavý tým.',de:'Sie haben ein interessantes Team.'}
 ]):[];
 const venueTopics:Answer[]=restaurantAnswers.length?restaurantAnswers:s.place==='work'?[
 {id:'work-tasks',topic:'job',cs:'Mám připravené dnešní úkoly.',de:'Ich habe meine Aufgaben vorbereitet.'},
 {id:'work-help',topic:'job',cs:'Potřeboval bych poradit s jedním úkolem.',de:'Ich brauche bei einer Aufgabe einen Rat.'},
 {id:'work-break',topic:'followup',cs:'Jak řešíš pracovní přestávky?',de:'Wie machst du deine Arbeitspausen?'}
 ]:s.place==='library'?[
 {id:'lib-recommend',topic:'advice',cs:'Doporučil byste mi nějakou knihu?',de:'Könnten Sie mir ein Buch empfehlen?'},
 {id:'lib-borrow',topic:'hobby',cs:'Chtěl bych si vypůjčit knihu.',de:'Ich möchte ein Buch ausleihen.'}
 ]:s.place==='bakery'?[
 {id:'bakery-pretzel-'+m.turns.length,topic:'followup',cs:'Jeden preclík, prosím.',de:'Eine Brezel, bitte.'},
 {id:'bakery-bread-'+m.turns.length,topic:'followup',cs:'Máte čerstvý chleba?',de:'Haben Sie frisches Brot?'},
 {id:'bakery-wait-'+m.turns.length,topic:'followup',cs:'Ještě si vybírám, hned to bude.',de:'Ich schaue noch kurz, gleich bin ich so weit.'}
 ]:[];
 // Answer the actual NPC question first; never append unrelated conversation openers to an unanswered question.
 const candidates:Answer[]=npcQuestion?(actual?.length?actual:restaurantAnswers.length?restaurantAnswers:venueTopics.length?venueTopics:[
 {id:'question-yes-'+m.turns.length,topic:'followup',cs:'Ano, to bych rád.',de:'Ja, das würde ich gerne.'},
 {id:'question-no-'+m.turns.length,topic:'followup',cs:'Ne, tentokrát ne.',de:'Nein, dieses Mal nicht.'},
 {id:'question-detail-'+m.turns.length,topic:'followup',cs:'Můžeš mi k tomu říct víc?',de:'Kannst du mir mehr dazu sagen?'}
 ]):venueTopics.length?[...venueTopics,...unused]:[...hello,...context,...unused];
 const said=new Set(m.turns.filter(x=>x.role==='player').map(x=>(x.raw||x[lang]||'').trim().toLocaleLowerCase()));
 const current=candidates.filter(c=>!m.asked.includes(c.id)&&!said.has(c[lang].trim().toLocaleLowerCase())).slice(0,npcQuestion?3:4);
 if(!current.length){const fresh=[{id:'fresh-plans',topic:'followup' as Topic,cs:'Co dnes plánuješ po práci?',de:'Was hast du heute nach der Arbeit vor?'},{id:'fresh-hobby',topic:'hobby' as Topic,cs:'Kterému koníčku ses věnoval naposledy?',de:'Welches Hobby hast du zuletzt ausgeübt?'},{id:'fresh-city',topic:'advice' as Topic,cs:'Kde se ti tady nejraději tráví čas?',de:'Wo verbringst du hier am liebsten Zeit?'}];const f=fresh.find(c=>!m.asked.includes(c.id)&&!said.has(c[lang].toLocaleLowerCase()));if(f)current.push(f);}
 current.push({id:'bye',topic:'bye',cs:'Děkuji za rozhovor, měj se hezky.',de:'Danke für das Gespräch, bis bald.'});
 return current;
}
function stableHash(input:string){let n=5381;for(const c of input)n=(n*33+c.charCodeAt(0))>>>0;return n;}
function infer(s:string):Topic{
 const v=s.toLowerCase();
 if(/tschüss|auf wiedersehen|sbohem|měj se|na shledanou|bis bald/.test(v))return 'bye';
 if(/jmen|name|heiß/.test(v))return 'name';
 if(/kontakt|nummer|telefonnummer|číslo|handynummer/.test(v))return 'contact';
 if(/rande|date|flirt|sympat|schön|hezk/.test(v))return 'flirt';
 if(/společně|treffen|zusammen|pozv|einlad/.test(v))return 'invite';
 if(/tip|doporuč|empfehl|kaffee|kavár|café/.test(v))return 'advice';
 if(/prác|job|arbeit|schicht/.test(v))return 'job';
 if(/zálib|baví|hobby|freizeit/.test(v))return 'hobby';
 if(/akce|událost|event|heute los/.test(v))return 'event';
 if(/proč|warum|wie|jak|víc|mehr/.test(v))return 'followup';
 return 'custom';
}
export function reply(s:TownState,input:string,lang:Lang,choice?:Answer,generated?:{cs:string;de:string}):TownState{
 const id=s.selectedNpc;if(!id||!occupant(s).some(r=>r.id===id))return {...s,selectedNpc:null};
 const r=byId(id)!;const m=s.conversations[id]??fresh();if(!m.open)return s;
 const topic=choice?.topic??infer(input);
 if((topic==='flirt'||topic==='invite')&&(!s.ageConfirmed||s.playerAge<18||r.age<18))return s;
  if(topic==='bye')return exitConversation(s);
 const askedId=choice?.id??topic;
 const repeat=m.asked.includes(askedId);
 const repeated=repeat?m.repeat+1:0;
 const mood=moodOf(r,s.day,s.minute);
 const name= r.name.split(' ')[0];
 const appointment=currentAppointment(r,s.day,s.minute);
 const privateMood=mood==='irritable'||mood==='stressed'||mood==='tired';
 const knowledge=s.social?.bonds[id];
 const trusted=(knowledge?.trust??0)>=14;
 const privacyDecline=privateMood&&(r.trait+s.day*3+m.turns.length)%4===0;
 const hobbyReply=privacyDecline?pair('Promiň, to si dnes raději nechám pro sebe.','Das möchte ich heute lieber für mich behalten.'):
 trusted?(()=>{
   const descriptions=r.interests.map(k=>interestCatalog.find(x=>x.id===k)).filter(Boolean);
   const chosen=descriptions[(r.age+s.day)%descriptions.length];
   return pair('Když mám čas, baví mě '+(chosen?.cs.toLowerCase()??'procházky')+'. A ty?','Wenn ich Zeit habe, mag ich '+(chosen?.de??'Spaziergänge')+'. Und du?');
 })():pair('Rád trávím čas venku. Co baví tebe?','Ich bin gern draußen. Und was machst du gern?');
 const responses:Record<Topic,{cs:string;de:string}>={
 contact:pair('Možná. Nejdřív se trochu poznejme.','Vielleicht. Lernen wir uns erst etwas besser kennen.'),
 flirt:pair('Děkuju. Uvidíme, jestli si budeme rozumět i příště.','Danke. Mal sehen, ob wir uns beim nächsten Mal auch so gut verstehen.'),
 invite:pair('Teď nevím. Dej mi prostor, rád se rozhodnu sám.','Ich weiß noch nicht. Gib mir bitte etwas Zeit, ich entscheide selbst.'),
 hello:pair('Vítej tady. Město je malé, ale občas překvapí víc než velkoměsto.','Willkommen! Die Stadt ist klein, überrascht aber manchmal mehr als eine Großstadt.'),
 name:pair('Jmenuji se '+r.name+'. A ty?','Ich heiße '+r.name+'. Und Sie?'),
 about:privacyDecline?pair('Nezlob se, o tom dnes nechci mluvit.','Entschuldige, darüber möchte ich heute nicht sprechen.'):pair('Zatím se tu mám docela dobře. Uvidíme, co přinese další týden.','Bisher gefällt es mir hier ganz gut. Mal sehen, was nächste Woche bringt.'),
 job:(()=>{
  // Never form Czech prepositional case by lowercasing a nominative location name.
  const jobPhrases:Record<Place,{cs:string;de:string}>={
   home:{cs:'Pracuju převážně z domova.',de:'Ich arbeite hauptsächlich von zu Hause.'},
   street:{cs:'Pracuju převážně v terénu.',de:'Ich arbeite überwiegend im Außendienst.'},
   bakery:{cs:'Pracuju v pekárně.',de:'Ich arbeite in einer Bäckerei.'},
   square:{cs:'Pracuju v centru města.',de:'Ich arbeite im Stadtzentrum.'},
   work:{cs:'Pracuju v kanceláři.',de:'Ich arbeite im Büro.'},
   library:{cs:'Pracuju v knihovně.',de:'Ich arbeite in der Bibliothek.'},
   market:{cs:'Pracuju v supermarketu.',de:'Ich arbeite im Supermarkt.'},
   cafe:{cs:'Pracuju v kavárně.',de:'Ich arbeite in einem Café.'},
   park:{cs:'Pracuju ve správě parku.',de:'Ich arbeite in der Parkverwaltung.'},
   church:{cs:'Pracuju v místní farnosti.',de:'Ich arbeite in der örtlichen Gemeinde.'},
   hotel:{cs:'Pracuju v hotelu.',de:'Ich arbeite in einem Hotel.'},
   gym:{cs:'Pracuju ve fitness centru.',de:'Ich arbeite in einem Fitnessstudio.'},
   mountains:{cs:'Pracuju v horském středisku.',de:'Ich arbeite in einem Bergsportzentrum.'},
   restaurant:{cs:'Pracuju v restauraci.',de:'Ich arbeite in einem Restaurant.'},
   outfitter:{cs:'Pracuju v obchodě se sportovním vybavením.',de:'Ich arbeite in einem Sportgeschäft.'},
   pool:{cs:'Pracuju na plovárně.',de:'Ich arbeite im Freibad.'},
   resort:{cs:'Pracuju v lyžařském středisku.',de:'Ich arbeite in einem Skigebiet.'},
   bank:{cs:'Pracuju v bance.',de:'Ich arbeite in einer Bank.'},
   theatre:{cs:'Pracuju v divadle.',de:'Ich arbeite im Theater.'},
   petshop:{cs:'Pracuju ve zverimexu.',de:'Ich arbeite in einer Tierhandlung.'},
   train:{cs:'Pracuju na vlakovém nádraží.',de:'Ich arbeite am Bahnhof.'},hospital:{cs:'Pracuju ve zdravotnictví.',de:'Ich arbeite im Gesundheitswesen.'},school:{cs:'Pracuju ve škole.',de:'Ich arbeite an einer Schule.'}
  };
  const phrase=jobPhrases[r.job??'square'];
  return pair(phrase.cs+(r.sideJob?' Občas mám ještě druhou práci.':''),phrase.de+(r.sideJob?' Gelegentlich habe ich noch einen Nebenjob.':''));
 })(),
 advice:pair('Zkus náměstí a knihovnu. Někdy tam narazíš na zajímavé lidi.','Schauen Sie sich den Marktplatz und die Bibliothek an. Dort trifft man interessante Leute.'),
 event:pair('Něco se určitě děje. Mrkni do městského kalendáře.','Bestimmt ist etwas los. Schau im Stadtprogramm nach.'),
 hobby:hobbyReply,
 followup:pair('To se teprve ukáže. Co bys dělal ty?','Das wird sich zeigen. Was würden Sie tun?'),
 thanks:pair('Není zač.','Gern geschehen.'),
 bye:pair('Měj se hezky!','Machen Sie es gut!'),
 custom:pair('Zajímavá myšlenka. Jak ses k tomu dostal?','Ein interessanter Gedanke. Wie sind Sie darauf gekommen?')
 };
 const variants=[
 pair('To mě překvapuje. Co tě na tom zaujalo nejvíc?','Das überrascht mich. Was interessiert Sie daran am meisten?'),
 pair('Hm, to bych možná viděl trochu jinak. Co myslíš?','Hm, das sehe ich vielleicht anders. Was meinen Sie?'),
 pair('To je docela odvážné tvrzení. Jakou s tím máš zkušenost?','Das ist eine mutige Aussage. Welche Erfahrungen haben Sie damit gemacht?'),
 pair('Možná na tom něco je. Povíš mi o tom víc?','Da könnte etwas dran sein. Erzählen Sie mehr.')
 ];
 const livedReplies:Record<string,{cs:string;de:string}>={
  'movies-chat':pair('To záleží na náladě. Někdy mám chuť na komedii, jindy na klidný večer.','Das hängt von der Stimmung ab. Mal Comedy, mal ein ruhiger Abend.'),
  'local-news-chat':pair('Něco jsem zaslechl, ale nerad šířím drby bez ověření.','Ich habe etwas gehört, verbreite aber ungern unbestätigte Gerüchte.'),
  'book-chat':pair('Občas. Ale dnes mi nějak chybí soustředění. Co jsi četl?','Manchmal. Heute fehlt mir aber die Konzentration. Was hast du gelesen?'),
  'work-chat':pair('To znám. Někdy stačí jeden kolega a hned je o zábavu postaráno.','Das kenne ich. Manchmal reicht ein Kollege für ordentlich Unterhaltung.')
 };
 const venueReaction:Record<string,{cs:string;de:string}>={
 'rest-menu':pair('Jistě, dejte si čas. Dnes máme i domácí specialitu.','Natürlich, nehmen Sie sich Zeit. Heute gibt es auch eine Hausspezialität.'),
 'rest-dinner':pair('Výborně, hned vám přinesu menu.','Sehr gern, ich bringe gleich die Speisekarte.'),
 'rest-staff':pair('Dnes vaří Hugo. Je šikovný, jen poslední dobou nějak zamyšlený.','Heute kocht Hugo. Er ist gut, nur in letzter Zeit etwas nachdenklich.'),
 'rest-complain':s.restaurantStory.mealComplaint?pair('Máte pravdu. Omlouvám se. Poslední dobou nemám hlavu u vaření. Víte, někdy se člověk zamiluje do někoho, kdo už s někým je...','Sie haben recht. Entschuldigung. Meine Gedanken sind derzeit woanders. Manchmal verliebt man sich in jemanden, der schon vergeben ist...'):pair('Mrzí mě to, příště si dám větší pozor.','Das tut mir leid. Nächstes Mal passe ich besser auf.'),
 'rest-calm':pair('Naše dnešní specialita je houbové rizoto.','Unsere Spezialität heute ist Pilzrisotto.'),
 'rest-chef-good':pair('To rád slyším. Dneska pro mě taková slova hodně znamenají.','Das freut mich. Heute bedeutet mir so etwas viel.'),
 'rest-owner-service':pair('Děkuji za upozornění, záleží mi na tom, aby se tu hosté cítili dobře.','Danke für die Rückmeldung. Mir ist wichtig, dass Gäste sich hier wohlfühlen.'),
 'rest-owner-hello':pair('Těší mě. Užijte si večer.','Freut mich. Genießen Sie den Abend.'),
 'rest-owner-staff':pair('Jsou to dobří lidé. Někdy je ale těžké oddělit práci od soukromí.','Es sind gute Leute. Manchmal ist es aber schwer, Arbeit und Privates zu trennen.')
 };
 const choicePrefix=choice?.id.replace(/-\d+$/,'')??'';
 const workRomance=choice?.id==='workplace-interest'?(r.temperament==='reserved'||privateMood?
 pair('Děkuju, ale na pracovišti si radši držím odstup. Neber to osobně.','Danke, aber am Arbeitsplatz halte ich lieber Abstand. Nimm es nicht persönlich.'):
 pair('Možná ano, ale pracovní vztahy bývají složité. Můžeme se nejdřív lépe poznat.','Vielleicht. Beziehungen bei der Arbeit können kompliziert sein. Lernen wir uns erst besser kennen.')):null;
 const contextualChoice=workRomance??((choice&&(venueReaction[choicePrefix]??livedReplies[choice.id]))||(choice?contextualResponse(choice.id):null));
 const key=contextualChoice??(topic==='custom'?variants[stableHash(input+r.id+m.turns.length)%variants.length]:responses[topic]);
 const boss=id==='npc-05'&&s.place==='work'&&v083(s).roles.includes(id)&&topic==='advice';
 const bossIrritable=(s.day*11+s.minute*3)%5<3;
 const bossText=pair(bossIrritable?'Šéf: „Doporučil bych ti hlavně tvoje pracovní místo. Teď do práce.“':'Šéf: „Kavárna na náměstí je dobrá. Ale až po práci. A mimochodem, dnes odvádíš dobrou práci.“',bossIrritable?'Chef: „Ich empfehle dir vor allem deinen Arbeitsplatz. An die Arbeit!“':'Chef: „Das Café am Marktplatz ist gut. Aber erst nach Feierabend. Übrigens, gute Arbeit heute.“');
 const bond=s.social?.bonds[id]??{warmth:0,trust:0,lastContact:-1,invited:false,requested:false,cooldownUntil:-1};
 const contactOk=topic==='contact'&&bond.warmth>=12&&bond.trust>=8&&s.day>=bond.cooldownUntil;
 const inviteOk=topic==='invite'&&bond.warmth>=20&&bond.trust>=15&&mood!=='stressed'&&mood!=='tired';
 const interpersonal=topic==='contact'?contactOk?pair('Dobře, můžeme si někdy napsat. Jen nečekej odpověď okamžitě.','Gern, wir können uns schreiben. Aber erwarte bitte keine sofortige Antwort.'):pair('Díky za nabídku. Raději bychom se ještě poznali osobně.','Danke. Ich möchte dich lieber erst persönlich besser kennenlernen.'):
 topic==='invite'?inviteOk?pair('Káva na veřejném místě by mohla být fajn. Domů si ale hosty zatím nezvu.','Ein Kaffee an einem öffentlichen Ort wäre nett. Nach Hause lade ich aber noch niemanden ein.'):pair('Díky za pozvání. Momentálně se mi to nehodí.','Danke für die Einladung. Im Moment passt es mir nicht.'):
 topic==='flirt'?(mood==='irritable'||bond.trust<10?pair('To je milé, ale nechme tomu volný průběh.','Das ist nett, aber lassen wir es entspannt angehen.'):pair('Usmívám se. A teď mě zajímá, co ještě řekneš.','Ich muss lächeln. Jetzt bin ich gespannt, was du als Nächstes sagst.')):null;
 const isRepair=Boolean(choice?.id.startsWith('misunderstand-'));
 const humourSignal=/haha|hehe|lol|vtip|srand|ironi|sarkas|witz|spaß|iron|scherz|😂|😄|😅/i.test(input);
 const complexSignal=input.length>115&&/[;,]/.test(input);
 const clashChance=(stableHash(r.id+':'+s.day+':'+m.turns.length)%13)===0;
 const humourGap=humourSignal&&r.humor<42;
 const comprehensionGap=complexSignal&&r.empathy<46;
 const misunderstood=!isRepair&&s.place!=='bakery'&&s.place!=='library'&&s.place!=='work'&&mood!=='cheerful'&&(humourGap||comprehensionGap||((topic==='flirt'||topic==='custom')&&clashChance&&(knowledge?.trust??0)<10));
 const friction=humourGap?pair('Počkej, to měl být vtip? Já jsem to pochopil úplně vážně. Jak jsi to myslel?','Moment, das war ein Witz? Ich habe das ganz ernst verstanden. Wie meinst du das?'):
 comprehensionGap?pair('Promiň, ztrácím se v tom. Co tím přesně myslíš?','Entschuldige, ich komme nicht ganz mit. Was meinst du damit?'):
 pair('Asi si teď úplně nerozumíme. Jak jsi to myslel?','Ich glaube, wir reden gerade aneinander vorbei. Wie meinst du das?');
 const live=!choice&&generated?.cs?.trim()&&generated?.de?.trim()?pair(generated.cs.trim().slice(0,250),generated.de.trim().slice(0,250)):null;
 const contextual=interpersonal??live??(misunderstood?friction:boss?bossText:privacyDecline&&['hobby','about','job'].includes(topic)?responses[topic]:contextualChoice??key);
 const newText=repeated?contextual:mood==='tired'&&!misunderstood?pair(contextual.cs+' Dnes už jsem trochu unavený.',contextual.de+' Ich bin heute etwas müde.'):mood==='stressed'&&!misunderstood?pair(contextual.cs+' Dnes toho mám hodně.',contextual.de+' Heute habe ich viel zu tun.'):contextual;
 const npcTurn:Turn={role:'npc',cs:newText.cs,de:newText.de};
 const seen=new Set(m.asked);if(!repeat)seen.add(askedId);
 let next:TownState={...s,minute:s.minute+2,conversations:{...s.conversations,[id]:{...m,asked:[...seen],topic,repeat:repeated,turns:[...m.turns,{role:'player',cs:input,de:input,raw:input},npcTurn]}}};
 if(boss){
   const warnings=s.life.workWarnings+(bossIrritable?1:0);
   const bonus=bossIrritable?0:10;
   next={...next,wallet:next.wallet+bonus,employment:warnings>=4?'fired':next.employment,
     life:{...next.life,workWarnings:warnings},walletHistory:bonus?[...next.walletHistory,next.wallet+bonus]:next.walletHistory};
 }
 if((topic==='flirt'||topic==='invite')&&s.playerAge<18)return s;
 if(topic==='contact'){
  const b=s.social?.bonds[id]??{warmth:0,trust:0,lastContact:-1,invited:false,requested:false,cooldownUntil:-1};
  next={...next,social:{...next.social,bonds:{...next.social.bonds,[id]:{...b,requested:true,cooldownUntil:contactOk?s.day:s.day+3}},contacts:contactOk?[...new Set([...next.social.contacts,id])]:next.social.contacts}};
 }
 if(topic==='invite'&&inviteOk){const b=next.social.bonds[id]??{warmth:0,trust:0,lastContact:-1,invited:false,requested:false,cooldownUntil:-1};next={...next,social:{...next.social,bonds:{...next.social.bonds,[id]:{...b,invited:true}}}};}
 if(topic==='name'&&!next.known.includes(id)){next={...next,known:[...next.known,id],completed:[...new Set([...next.completed,'meet'])]};}
 if(topic==='advice'){
  const discovered=[...new Set([...next.discovered,'square','library'] as Place[])];
  next={...next,discovered,recommended:[...new Set([...next.recommended,'square','library'] as Place[])],completed:[...new Set([...next.completed,'discover'])]};
 }
 if(repeated>=3){next={...next,conversations:{...next.conversations,[id]:{...next.conversations[id],open:false,turns:[...next.conversations[id].turns,{role:'npc',...pair('Na to už jsem odpovídal tolikrát, že si připadám jako porouchaná deska. Měj se!','Das habe ich so oft beantwortet, dass ich mich wie eine kaputte Schallplatte fühle. Bis dann!')}] }},selectedNpc:null};}
 next=developBond(next,id,misunderstood?'time':isRepair?'kind':topic==='flirt'?'flirt':topic==='thanks'||topic==='hobby'||topic==='about'?'kind':'time');
 return next;
}
export const WORK_START=8*60;
export const WORK_END=16*60+30;
export function canWork(s:TownState):boolean{
 return s.place==='work'&&s.employment!=='fired'&&s.day%7>=2&&s.lastShift!==s.day&&s.minute<WORK_END;
}
export function doShift(s:TownState):TownState{
 if(!canWork(s))return s;
 const start=Math.max(s.minute,WORK_START);
 const working=Math.max(0,WORK_END-start);
 if(working<60)return s;
 const lunch=Math.round((5.2+((s.day*17+11)%390)/100)*100)/100;
 const isLate=start>WORK_START+15;
 const gross=(isLate?Math.round(45*(working/(WORK_END-WORK_START))*100)/100:45)*(1+s.careerRank*.22);
 const n=addTime(s,WORK_END-s.minute);
 const balance=Math.round((s.wallet+gross-lunch)*100)/100;
 return {...n,wallet:balance,stress:Math.min(100,s.stress+6),workShifts:s.workShifts+1,careerRank:s.workShifts+1>=15?2:s.workShifts+1>=6?1:s.careerRank,lastShift:s.day,completed:[...new Set([...s.completed,'work'])],
 walletHistory:[...s.walletHistory,Math.round((s.wallet+gross)*100)/100,balance],
 life:{...n.life,lastMeal:s.day*1440+12*60+30,hunger:Math.max(10,n.life.hunger-38),energy:Math.max(3,n.life.energy)}};
}
export function buy(s:TownState):TownState{
 if(s.place!=='bakery'||s.wallet<2.5)return s;
 const n=addTime(s,10);return {...n,wallet:s.wallet-2.5,life:{...n.life,hunger:Math.max(0,n.life.hunger-22)},completed:[...new Set([...s.completed,'buy'])],walletHistory:[...s.walletHistory,s.wallet-2.5]};
}
export function read(s:TownState,kind:'book'|'web'):TownState{
 if(s.place!=='library'||(kind==='book'?s.lastRead:s.lastResearch)===s.day)return s;
 const gain=kind==='book'?3:2,mission=kind==='book'?'read':'research';
 return {...s,mindset:s.mindset+gain,minute:s.minute+25,[kind==='book'?'lastRead':'lastResearch']:s.day,completed:[...new Set([...s.completed,mission])]};
}
export function revealNewFact(s:TownState):{state:TownState;factId:string|null}{
 if(!quizzes.every(q=>s.completedQuiz.includes(q.id))||s.lastFactDay===s.day)return {state:s,factId:null};
 const fact=nextUnusedFact(s.factsSeen,s.day);
 if(!fact)return {state:s,factId:null};
 return {state:{...s,factsSeen:[...s.factsSeen,fact.id],lastFactDay:s.day},factId:fact.id};
}
export function solve(s:TownState,q:Quiz,answer:number):TownState{
 if(s.completedQuiz.includes(q.id))return s;
 if(answer!==q.correct)return s;
 return {...s,mindset:s.mindset+q.points,completedQuiz:[...s.completedQuiz,q.id],completed:[...new Set([...s.completed,'quiz'])]};
}
export function sleep(s:TownState):TownState{
 const missed=s.day%7>=2&&s.lastShift!==s.day&&s.employment!=='fired'?s.absences+1:s.absences;
 return {...s,place:'home',selectedNpc:null,day:s.day+1,minute:480,absences:missed,
 employment:missed>=3?'fired':missed>=2?'warned':s.employment};
}
export {residents,residentsAt,moodOf,placeFor,byId,type Resident};
