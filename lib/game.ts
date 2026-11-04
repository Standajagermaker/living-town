export type Lang='cs'|'de';
export type Place='home'|'street'|'bakery'|'square';
export type NpcId='man'|'baker';
export type Intent='hello'|'name'|'tip'|'dog'|'bye'|'shop'|'buy'|'followup'|'thanks';
export type Message={who:'npc'|'player'|'system';text:string};
export type Goal='meet'|'tip'|'buy';
export type DialogueMemory={asked:Intent[];repetitions:number;lastTopic:Intent|null;closed:boolean;turns:number};
export type Recommendation={place:Place;nameCs:string;nameDe:string;from:NpcId};
export type GameState={
 place:Place;minute:number;discovered:Place[];knownNames:string[];greetedMan:boolean;manLeft:boolean;
 messages:Message[];notifications:string[];journal:string[];wallet:number;goal:Goal;completedGoals:Goal[];
 purchased:boolean;dialogues:Record<NpcId,DialogueMemory>;recommendations:Recommendation[];
};
const fresh=():DialogueMemory=>({asked:[],repetitions:0,lastTopic:null,closed:false,turns:0});
export const initialState:GameState={
 place:'home',minute:630,discovered:['home','street'],knownNames:[],greetedMan:false,manLeft:false,
 messages:[],notifications:['Vítej v novém městečku.'],journal:['Sobota: přistěhoval ses do města.'],
 wallet:85,goal:'meet',completedGoals:[],purchased:false,
 dialogues:{man:fresh(),baker:fresh()},recommendations:[]
};
export function timeLabel(minute:number){const v=minute%(24*60);return String(Math.floor(v/60)).padStart(2,'0')+':'+String(v%60).padStart(2,'0');}
export type Choice={text:string;intent:Intent};
export function activeNpc(s:GameState):NpcId|null{return s.place==='bakery'?'baker':s.place==='home'||s.place==='street'?'man':null;}
export function memoryFor(s:GameState,npc:NpcId){return s.dialogues?.[npc]??fresh();}
export function choicesFor(s:GameState):Choice[]{
 const npc=activeNpc(s);if(!npc)return [];
 const m=memoryFor(s,npc);
 if(m.closed||npc==='man'&&s.manLeft)return [];
 const offered:Choice[]=[];
 const add=(intent:Intent,text:string)=>{if(!m.asked.includes(intent))offered.push({intent,text});};
 if(npc==='baker'){
  add('hello','Guten Morgen! Ich bin gerade erst hergezogen.');
  if(m.lastTopic==='shop')add('buy','Dann nehme ich eine Brezel, bitte.');
  else add('shop','Was ist heute frisch?');
  add('tip','Haben Sie einen Tipp, was man hier entdecken kann?');
  if(m.lastTopic==='tip')add('followup','Ist dort heute etwas los?');
  if(m.lastTopic==='buy')add('thanks','Vielen Dank, das riecht wunderbar.');
 }else{
  if(!s.greetedMan)add('hello','Guten Morgen! Ich bin gerade erst eingezogen.');
  else {
   add('name','Wohnen Sie schon lange hier?');
   add('dog','Wie heißt Ihr Hund eigentlich?');
   add('tip','Wo gibt es hier einen guten Kaffee?');
   if(m.lastTopic==='hello')add('followup','Ich komme aus einer anderen Stadt. Und Sie?');
   if(m.lastTopic==='tip')add('followup','Ist es von hier aus weit bis zum Marktplatz?');
   if(m.lastTopic==='dog')add('followup','Gehen Sie mit Balu oft hier spazieren?');
   if(m.lastTopic==='name')add('followup','Was gefällt Ihnen hier besonders?');
   if(m.lastTopic==='followup')add('thanks','Das ist wirklich nett von Ihnen.');
  }
 }
 // Always allow a friendly exit; never gate it behind progress or patience.
 offered.push({intent:'bye',text:npc==='baker'?'Vielen Dank! Ich wünsche Ihnen einen schönen Tag.':'Danke für das Gespräch! Ich wünsche Ihnen einen schönen Tag.'});
 return offered.slice(0,5);
}
export function inferIntent(input:string,s:GameState):Intent|'unknown'{
 const v=input.toLocaleLowerCase('de');
 if(/tschüss|auf wiedersehen|bis bald|schönen tag|nicht aufhalten|mach.*gut|wiedersehen|nashledanou|na shledanou|mějte se|hezký den/.test(v))return 'bye';
 if(/vielen dank|danke|děkuji|dík/.test(v)&&!/(tipp|empfehl|kavár)/.test(v))return 'thanks';
 if(/hund|balu|pes|heißt er|jmenuje/.test(v))return 'dog';
 if(/kaffee|café|cafe|kavár|platz|empfehl|tipp|tip|wo gibt/.test(v))return 'tip';
 if(/brezel|kaufen|koup|nehme eine|eine brezn/.test(v))return 'buy';
 if(/lange hier|wohnen sie|wie heißen sie|name|jmenujete/.test(v))return 'name';
 if(/guten|hallo|neu|eingezogen|zdrav|přistěhoval/.test(v))return 'hello';
 if(s.place==='bakery'&&/frisch|brot|was haben/.test(v))return 'shop';
 if(/weit|oft|warum|weshalb|und sie|gefallen|dort|tam|kolik/.test(v))return 'followup';
 return 'unknown';
}
export function interact(s:GameState,input:string,chosen?:Choice):GameState{
 const npc=activeNpc(s);if(!npc)return s;
 const m=memoryFor(s,npc);
 if(m.closed&&chosen?.intent!=='bye'&&inferIntent(input,s)!=='bye')return s;
 const intent=chosen?.intent??inferIntent(input,s);
 const previousAsk=m.asked.includes(intent as Intent)&&intent!=='bye'&&intent!=='thanks';
 const reps=previousAsk?m.repetitions+1:0;
 const asked=[...new Set([...m.asked,...(intent==='unknown'||intent==='bye'?[]:[intent])])];
 let response='';let manLeft=s.manLeft;let wallet=s.wallet;let purchased=s.purchased;
 let knownNames=s.knownNames;let discovered=s.discovered;let recommendations=s.recommendations;
 const completed=new Set(s.completedGoals);
 const journal=[...s.journal];
 let closed=intent==='bye'||m.closed||reps>=3;
 const revealSquare=()=>{
  if(!discovered.includes('square')){discovered=[...discovered,'square'];journal.push('Objeveno díky doporučení: náměstí / Marktplatz.');}
  if(!recommendations.some(x=>x.place==='square')) recommendations=[...recommendations,{place:'square',nameCs:'Náměstí a malá kavárna',nameDe:'Marktplatz mit kleinem Café',from:npc}];
  completed.add('tip');
 };
 const revealName=()=>{
  if(!knownNames.includes('Herr Weber')){knownNames=[...knownNames,'Herr Weber'];journal.push('Souseda znáš jako Herr Weber.');}
  completed.add('meet');
 };
 if(intent==='bye'){
  response=npc==='baker'?'Auf Wiedersehen, kommen Sie gerne wieder!':'Sehr gern. Ihnen auch einen schönen Tag und gutes Ankommen!';
  if(npc==='man')manLeft=true;
 }else if(reps>=3){
  response=npc==='baker'?'Ich habe es Ihnen nun schon mehrfach erklärt. Ich muss mich wieder um den Laden kümmern. Auf Wiedersehen.':'Sie haben mich das jetzt wirklich oft gefragt. Ist bei Ihnen alles in Ordnung? Ich muss mit Balu weiter. Machen Sie es gut!';
  if(npc==='man')manLeft=true;
 }else if(previousAsk){
  response=reps===1?
   (npc==='baker'?'Das hatten Sie mich eben schon gefragt. Soll ich es Ihnen aufschreiben?':'Das haben Sie mich gerade schon gefragt. Vielleicht war der Umzug doch anstrengend?'):
   (npc==='baker'?'Schon wieder dieselbe Frage? Mein Gedächtnis funktioniert noch ganz gut – Ihres hoffentlich auch!':'Jetzt bin ich fast besorgt um Ihr Gedächtnis. Oder testen Sie mich?');
 }else if(npc==='baker'){
  if(intent==='hello')response='Willkommen! Sie sind also neu hier. Was darf es sein?';
  else if(intent==='buy'){
   if(wallet>=2.5){wallet-=2.5;purchased=true;completed.add('buy');journal.push('Koupil sis preclík za 2,50 €.');response='Sehr gern, eine frische Brezel! Das macht 2,50 Euro.';}
   else response='Tut mir leid, das reicht leider nicht.';
  }
  else if(intent==='tip'){response='Am Marktplatz gibt es ein kleines Café. Heute ist dort auch ein Markt. Ich kann Ihnen den Weg zeigen.';revealSquare();}
  else if(intent==='shop')response='Die Brezeln sind ganz frisch. Außerdem haben wir heute Apfelkuchen.';
  else if(intent==='followup')response=m.lastTopic==='tip'?'Ja, heute ist dort ein kleiner Markt. Geradeaus und dann links.':'Natürlich! Schauen Sie sich ruhig um.';
  else if(intent==='thanks')response='Sehr gern! Noch einen schönen Tag.';
  else response='Da bin ich gerade nicht sicher, was Sie meinen. Sie können es gern anders formulieren.';
 }else{
  if(intent==='hello')response='Ach, ein Neuer! Herzlich willkommen. Kommen Sie von weit her?';
  else if(intent==='name'){response='Ich wohne schon lange hier. Weber heiße ich übrigens.';revealName();}
  else if(intent==='dog'){response='Das ist Balu. Und ich heiße Weber. Wir drehen jeden Samstag unsere Runde.';revealName();}
  else if(intent==='tip'){response='Am Marktplatz gibt es ein nettes kleines Café. Vielleicht gefällt es Ihnen dort.';revealSquare();}
  else if(intent==='followup'){
   if(m.lastTopic==='tip')response='Nein, nur ein paar Minuten zu Fuß. Folgen Sie einfach dieser Straße.';
   else if(m.lastTopic==='dog')response='Fast jeden Morgen. Balu kennt hier wahrscheinlich mehr Leute als ich.';
   else if(m.lastTopic==='name')response='Dass man hier meistens noch freundlich miteinander spricht.';
   else response='Ich komme aus der Gegend. Balu zeigt Ihnen bestimmt noch die halbe Stadt.';
  }else if(intent==='thanks')response='Gern geschehen. Schön, dass jemand Neues hergezogen ist.';
  else response='Entschuldigung, ich habe Sie nicht ganz verstanden. Was wollten Sie wissen?';
 }
 const updated:DialogueMemory={asked,repetitions:reps,lastTopic:intent==='bye'||previousAsk||intent==='unknown'?m.lastTopic:intent,closed,turns:m.turns+1};
 return {...s,minute:s.minute+2,greetedMan:s.greetedMan||(npc==='man'&&intent!=='bye'),manLeft,wallet,purchased,knownNames,discovered,recommendations,completedGoals:[...completed],
 dialogues:{...s.dialogues,[npc]:updated},messages:[...s.messages,{who:'player',text:input},{who:'npc',text:response}],journal};
}
