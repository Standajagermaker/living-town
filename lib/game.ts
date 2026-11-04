export type Lang = 'cs' | 'de';
export type Place = 'home' | 'street' | 'bakery' | 'square';
export type Message = { who: 'npc' | 'player' | 'system'; text: string };
export type Goal = 'meet' | 'tip' | 'buy';
export type GameState = {
 place:Place; minute:number; discovered:Place[]; knownNames:string[];
 greetedMan:boolean; manLeft:boolean; messages:Message[];
 notifications:string[]; journal:string[]; wallet:number; goal:Goal;
 completedGoals:Goal[]; purchased:boolean;
};
export const initialState:GameState={
 place:'home',minute:630,discovered:['home','street'],knownNames:[],
 greetedMan:false,manLeft:false,messages:[],
 notifications:['Vítej v novém městečku.'],journal:['Sobota: přistěhoval ses do města.'],
 wallet:85,goal:'meet',completedGoals:[],purchased:false
};
export function timeLabel(minute:number){const v=minute%(24*60);return String(Math.floor(v/60)).padStart(2,'0')+':'+String(v%60).padStart(2,'0');}
export type Choice={text:string;intent:'hello'|'name'|'tip'|'dog'|'bye'|'shop'|'buy'};
export function choicesFor(s:GameState):Choice[]{
 if(s.place==='bakery') return [
 {text:'Guten Morgen! Was ist heute frisch?',intent:'shop'},
 {text:'Ich bin neu hier. Haben Sie einen Tipp?',intent:'tip'},
 {text:'Eine Brezel, bitte.',intent:'buy'},
 {text:'Danke, ich schaue mich noch um.',intent:'bye'}
 ];
 if(s.place==='square') return [];
 if(!s.greetedMan) return [{text:'Guten Morgen! Ich bin gerade erst eingezogen.',intent:'hello'}];
 return [
 {text:'Wohnen Sie schon lange hier?',intent:'name'},
 {text:'Wo gibt es hier einen guten Kaffee?',intent:'tip'},
 {text:'Wie heißt Ihr Hund eigentlich?',intent:'dog'},
 {text:'Danke, ich will Sie nicht aufhalten.',intent:'bye'}
 ];
}
export function inferIntent(input:string,s:GameState):Choice['intent']|'unknown'{
 const v=input.toLocaleLowerCase('de');
 if(/tschüss|auf wiedersehen|bis bald|nicht aufhalten|děkuji|nashledanou/.test(v))return 'bye';
 if(/hund|pes|heißt er|jmenuje/.test(v))return 'dog';
 if(/kaffee|café|cafe|kavár|platz|empfehl|tipp|tip/.test(v))return 'tip';
 if(/brezel|kaufen|kostet|koup|prosím jednu/.test(v))return 'buy';
 if(/lange hier|wohnen sie|wie heißen sie|name|jmenujete/.test(v))return 'name';
 if(/guten|hallo|neu|eingezogen|zdrav|přistěhoval/.test(v))return 'hello';
 if(s.place==='bakery'&&/frisch|brot|was haben/.test(v))return 'shop';
 return 'unknown';
}
export function interact(s:GameState,input:string,chosen?:Choice):GameState{
 const intent=chosen?.intent??inferIntent(input,s);
 const bakery=s.place==='bakery';
 let response='';let revealsSquare=false;let revealName=false;let manLeft=s.manLeft;
 let wallet=s.wallet;let purchased=s.purchased;
 const completed=new Set(s.completedGoals);
 if(s.place==='square'){
  response='Heute ist auf dem Platz nicht viel los. Du kannst später wiederkommen.';
 }else if(bakery){
  if(intent==='buy'){
   if(wallet>=2.5){wallet-=2.5;purchased=true;completed.add('buy');response='Sehr gern! Eine frische Brezel. Das macht 2,50 Euro.';}
   else response='Tut mir leid, das reicht leider nicht.';
  }else if(intent==='tip'){response='Am Marktplatz ist heute ein kleiner Markt. Gehen Sie die Straße geradeaus.';revealsSquare=true;completed.add('tip');}
  else if(intent==='shop'){response='Die Brezeln sind frisch, und wir haben Apfelkuchen.';}
  else if(intent==='bye'){response='Schönen Tag noch!';}
  else response='Entschuldigung, könnten Sie das bitte noch einmal sagen?';
 }else if(manLeft){
  response='Der Nachbar ist bereits weitergegangen.';
 }else{
  if(intent==='hello'){response='Ach, ein Neuer! Herzlich willkommen. Kommen Sie von weit her?';}
  else if(intent==='name'){response='Ich wohne schon lange hier. Weber heiße ich, übrigens.';revealName=true;completed.add('meet');}
  else if(intent==='dog'){response='Das ist Balu. Und ich bin übrigens Herr Weber.';revealName=true;completed.add('meet');}
  else if(intent==='tip'){response='Versuchen Sie es am Marktplatz. Da gibt es ein nettes Café.';revealsSquare=true;completed.add('tip');}
  else if(intent==='bye'){response='Dann einen schönen Tag und viel Erfolg beim Einzug!';manLeft=true;}
  else response='Entschuldigung, das habe ich nicht ganz verstanden. Aber willkommen in der Nachbarschaft!';
 }
 const journal=[...s.journal];
 if(revealName&&!s.knownNames.includes('Herr Weber'))journal.push('Zjistil jsi jméno souseda: Herr Weber.');
 if(revealsSquare&&!s.discovered.includes('square'))journal.push('Dozvěděl ses o náměstí.');
 if(purchased&&!s.purchased)journal.push('Koupil sis preclík za 2,50 €.');
 return {...s,minute:s.minute+2,greetedMan:s.greetedMan||(!bakery&&!s.manLeft),manLeft,wallet,purchased,
 knownNames:revealName?[...new Set([...s.knownNames,'Herr Weber'])]:s.knownNames,
 discovered:revealsSquare?[...new Set([...s.discovered,'square' as Place])]:s.discovered,
 completedGoals:[...completed],messages:[...s.messages,{who:'player',text:input},{who:'npc',text:response}],journal};
}
