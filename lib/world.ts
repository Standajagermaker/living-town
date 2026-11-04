import {byId,isPresent,moodOf,placeFor,residents,residentsAt,type Resident} from './residents';
import type {Place,Lang} from './game';
export type {Place,Lang};
export type Topic='hello'|'name'|'about'|'advice'|'job'|'event'|'hobby'|'followup'|'thanks'|'bye'|'custom';
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
 square:{cs:'Náměstí',de:'Marktplatz'},work:{cs:'Práce',de:'Arbeitsplatz'},library:{cs:'Knihovna',de:'Bibliothek'}
};
export const links:Record<Place,Place[]>={home:['street'],street:['home','bakery','square','work','library'],bakery:['street'],square:['street','library'],work:['street'],library:['street','square']};
export type TownState={
 version:number;place:Place;day:number;minute:number;wallet:number;mindset:number;employment:'employed'|'warned'|'fired';absences:number;lastShift:number;
 discovered:Place[];recommended:Place[];known:string[];selectedNpc:string|null;
 conversations:Record<string,Conversation>;completed:string[];journal:{cs:string[];de:string[]};
 completedQuiz:string[];lastRead:number;lastResearch:number;walletHistory:number[];
};
const fresh=():Conversation=>({open:false,topic:null,asked:[],turns:[],repeat:0,visits:0,lastSeen:-1});
export function initialTown():TownState{return {
 version:5,place:'home',day:0,minute:10*60+30,wallet:85,mindset:12,employment:'employed',absences:0,lastShift:-1,
 discovered:['home','street','bakery','work'],recommended:[],known:[],selectedNpc:null,conversations:{},
 completed:[],journal:{cs:['Přistěhoval ses do městečka.'],de:['Du bist in die Stadt gezogen.']},
 completedQuiz:[],lastRead:-1,lastResearch:-1,walletHistory:[85]
};}
export function restoreTown(raw:unknown):TownState{
 const freshState=initialTown();
 if(!raw||typeof raw!=='object')return freshState;
 const v=raw as Partial<TownState>;
 if(v.version!==5)return freshState;
 return {...freshState,...v,conversations:v.conversations??{},journal:v.journal??freshState.journal};
}
export const clock=(m:number)=>String(Math.floor((m%1440)/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
export const dayLabel=(day:number,lang:Lang)=>(lang==='cs'?['So','Ne','Po','Út','St','Čt','Pá']:['Sa','So','Mo','Di','Mi','Do','Fr'])[day%7];
export const occupant=(s:TownState)=>residentsAt(s.place,s.day,s.minute);
export const canGo=(s:TownState,to:Place)=>s.place===to||links[s.place].includes(to)&&s.discovered.includes(to);
export function go(s:TownState,to:Place):TownState{
 if(!canGo(s,to))return s;
 return {...s,place:to,minute:s.minute+6,selectedNpc:null};
}
const pair=(cs:string,de:string)=>({cs,de});
export function note(s:TownState,cs:string,de:string):TownState{return {...s,journal:{cs:[...s.journal.cs,cs],de:[...s.journal.de,de]}};}
export function startConversation(s:TownState,id:string):TownState{
 if(!isPresent(id,s.place,s.day,s.minute))return s;
 const r=byId(id)!; const prior=s.conversations[id]??fresh();if(prior.open)return {...s,selectedNpc:id};
 const greetings=prior.visits>0?pair('Zase se vidíme. Co je u tebe nového?','Wir sehen uns wieder! Was gibt es Neues bei Ihnen?'):
 pair('Ahoj, potřebuješ něco?','Hallo, kann ich Ihnen helfen?');
 const mood=moodOf(r,s.day,s.minute);
 const prompt=mood==='tired'?pair('Dnes už jsem trochu unavená, ale chvíli mám.','Ich bin heute etwas müde, aber kurz habe ich Zeit.'):greetings;
 return {...s,selectedNpc:id,conversations:{...s.conversations,[id]:{...prior,open:true,visits:prior.visits+1,lastSeen:s.day,turns:[...prior.turns,{role:'npc',...prompt}]}}};
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
 const context=m.topic?[
 {id:'follow-'+m.turns,topic:'followup' as Topic,cs:'A jak to pokračovalo?',de:'Und wie ging es weiter?'},
 {id:'opinion-'+m.turns,topic:'followup' as Topic,cs:'Jaký z toho máš pocit?',de:'Wie fühlen Sie sich dabei?'}]:[];
 const unused=all.filter(c=>!m.asked.includes(c.id));
 const current=[...context,...unused].slice(0,4);
 if(!current.length)current.push({id:'more-'+m.turns,topic:'followup',cs:'Co je u tebe nového?',de:'Was gibt es Neues bei Ihnen?'});
 current.push({id:'bye',topic:'bye',cs:'Děkuji za rozhovor, měj se hezky.',de:'Danke für das Gespräch, bis bald.'});
 return current;
}
function stableHash(input:string){let n=5381;for(const c of input)n=(n*33+c.charCodeAt(0))>>>0;return n;}
function infer(s:string):Topic{
 const v=s.toLowerCase();
 if(/tschüss|auf wiedersehen|sbohem|měj se|na shledanou|bis bald/.test(v))return 'bye';
 if(/jmen|name|heiß/.test(v))return 'name';
 if(/tip|doporuč|empfehl|kaffee|kavár|café/.test(v))return 'advice';
 if(/prác|job|arbeit|schicht/.test(v))return 'job';
 if(/zálib|baví|hobby|freizeit/.test(v))return 'hobby';
 if(/akce|událost|event|heute los/.test(v))return 'event';
 if(/proč|warum|wie|jak|víc|mehr/.test(v))return 'followup';
 return 'custom';
}
export function reply(s:TownState,input:string,lang:Lang,choice?:Answer,generated?:{cs:string;de:string}):TownState{
 const id=s.selectedNpc;if(!id||!isPresent(id,s.place,s.day,s.minute))return {...s,selectedNpc:null};
 const r=byId(id)!;const m=s.conversations[id]??fresh();if(!m.open)return s;
 const topic=choice?.topic??infer(input);
 if(topic==='bye')return exitConversation(s);
 const askedId=choice?.id??topic;
 const repeat=m.asked.includes(askedId);
 const repeated=repeat?m.repeat+1:0;
 const mood=moodOf(r,s.day,s.minute);
 const name= r.name.split(' ')[0];
 const responses:Record<Topic,{cs:string;de:string}>={
 hello:pair('Ahoj. Rád tě poznávám.','Hallo. Freut mich, Sie kennenzulernen.'),
 name:pair('Jmenuji se '+r.name+'. A ty?','Ich heiße '+r.name+'. Und Sie?'),
 about:pair('V tomhle městě je pořád něco nového. Dnes mám ale vlastní plány.','In dieser Stadt ist immer etwas los. Heute habe ich allerdings eigene Pläne.'),
 job:pair('Pracuji hlavně v '+placeNames[r.job??'square'].cs.toLowerCase()+(r.sideJob?' a občas mám druhou práci.':'.'),'Ich arbeite meistens bei '+placeNames[r.job??'square'].de+(r.sideJob?' und habe gelegentlich einen Nebenjob.':'.')),
 advice:pair('Zkus náměstí a knihovnu. Někdy tam narazíš na zajímavé lidi.','Schauen Sie sich den Marktplatz und die Bibliothek an. Dort trifft man interessante Leute.'),
 event:pair('Sleduj nástěnku na náměstí. Něco se tam občas pořádá.','Schauen Sie auf die Tafel am Marktplatz. Dort gibt es manchmal Veranstaltungen.'),
 hobby:pair(r.temperament==='eccentric'?'Sbírám staré klíče a hádám, od jakých byly dveří.':'Rád chodím na procházky a čtu si, když mám čas.',r.temperament==='eccentric'?'Ich sammle alte Schlüssel und rate, zu welchen Türen sie gehörten.':'Ich gehe gerne spazieren und lese, wenn ich Zeit habe.'),
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
 const key=topic==='custom'?variants[stableHash(input+r.id+m.turns)%variants.length]:responses[topic];
 const contextual=generated?.cs?.trim()&&generated?.de?.trim()?pair(generated.cs.trim(),generated.de.trim()):key;
 const newText=topic==='bye'||repeated?contextual:mood==='tired'?pair(contextual.cs+' Dnes už jsem trochu unavený.',contextual.de+' Ich bin heute etwas müde.'):mood==='stressed'?pair(contextual.cs+' Dnes toho mám hodně.',contextual.de+' Heute habe ich viel zu tun.'):contextual;
 const npcTurn:Turn={role:'npc',cs:newText.cs,de:newText.de};
 const seen=new Set(m.asked);if(!repeat)seen.add(askedId);
 let next:TownState={...s,minute:s.minute+2,conversations:{...s.conversations,[id]:{...m,asked:[...seen],topic,repeat:repeated,turns:[...m.turns,{role:'player',cs:input,de:input,raw:input},npcTurn]}}};
 if(topic==='name'&&!next.known.includes(id)){next={...next,known:[...next.known,id],completed:[...new Set([...next.completed,'meet'])]};}
 if(topic==='advice'){
  const discovered=[...new Set([...next.discovered,'square','library'] as Place[])];
  next={...next,discovered,recommended:[...new Set([...next.recommended,'square','library'] as Place[])],completed:[...new Set([...next.completed,'discover'])]};
 }
 if(repeated>=3){next={...next,conversations:{...next.conversations,[id]:{...next.conversations[id],open:false,turns:[...next.conversations[id].turns,{role:'npc',...pair('Na to už jsem odpovídal tolikrát, že si připadám jako porouchaná deska. Měj se!','Das habe ich so oft beantwortet, dass ich mich wie eine kaputte Schallplatte fühle. Bis dann!')}] }},selectedNpc:null};}
 return next;
}
export function doShift(s:TownState):TownState{
 if(s.place!=='work'||s.employment==='fired'||s.day%7<2||s.lastShift===s.day)return s;
 return {...s,wallet:s.wallet+45,minute:s.minute+8*60,lastShift:s.day,completed:[...new Set([...s.completed,'work'])],walletHistory:[...s.walletHistory,s.wallet+45]};
}
export function buy(s:TownState):TownState{
 if(s.place!=='bakery'||s.wallet<2.5)return s;
 return {...s,wallet:s.wallet-2.5,completed:[...new Set([...s.completed,'buy'])],walletHistory:[...s.walletHistory,s.wallet-2.5]};
}
export function read(s:TownState,kind:'book'|'web'):TownState{
 if(s.place!=='library'||(kind==='book'?s.lastRead:s.lastResearch)===s.day)return s;
 const gain=kind==='book'?3:2,mission=kind==='book'?'read':'research';
 return {...s,mindset:s.mindset+gain,minute:s.minute+25,[kind==='book'?'lastRead':'lastResearch']:s.day,completed:[...new Set([...s.completed,mission])]};
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
