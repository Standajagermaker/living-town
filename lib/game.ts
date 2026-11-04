export type Place = 'home' | 'street' | 'bakery' | 'square';
export type CharacterId = 'man' | 'baker';
export type Message = { who: 'npc' | 'player' | 'system'; text: string };
export type GameState = {
  place: Place; minute: number; discovered: Place[];
  knownNames: string[]; greetedMan: boolean; manLeft: boolean;
  messages: Message[]; notifications: string[]; journal: string[];
};
export const initialState:GameState = {
 place:'home', minute: 10*60+30, discovered:['home','street'], knownNames:[], greetedMan:false, manLeft:false,
 messages:[], notifications:['Vítej v novém městečku.'], journal:['Sobota: přistěhoval ses do města.']
};
export function timeLabel(minute:number){return `${Math.floor(minute/60).toString().padStart(2,'0')}:${(minute%60).toString().padStart(2,'0')}`;}
export type DialogueChoice = { label:string; response:string; reveals?:string };
export function choicesFor(s:GameState):DialogueChoice[]{
 if(s.place==='bakery') return [
 {label:'„Guten Morgen. Was ist heute frisch?“',response:'„Die Brezeln sind gerade aus dem Ofen. Und unser Apfelkuchen ist auch beliebt.“'},
 {label:'„Ich bin neu hier. Haben Sie einen Tipp?“',response:'„Am Marktplatz ist heute ein kleiner Markt. Schauen Sie doch mal vorbei.“',reveals:'square'},
 {label:'„Ich schaue mich nur um, danke.“',response:'„Natürlich. Lassen Sie sich Zeit.“'}];
 if(!s.greetedMan) return [
 {label:'„Guten Morgen! Ich bin gerade erst eingezogen.“',response:'„Ach so, ein Neuer! Herzlich willkommen. Kommen Sie von weit her?“'}];
 return [
 {label:'„Ich komme aus einer anderen Stadt. Wohnen Sie schon lange hier?“',response:'„Seit vielen Jahren. Die Gegend hat sich verändert. Ich bin übrigens Herr Weber.“',reveals:'Herr Weber'},
 {label:'„Die Möbel können warten. Wo gibt es hier guten Kaffee?“',response:'„Am Marktplatz gibt es ein kleines Café. Gehen Sie einfach die Straße entlang.“',reveals:'square'},
 {label:'„Wie heißt Ihr Hund eigentlich?“',response:'„Balu. Und ich bin Weber. Wir drehen jeden Samstag unsere Runde.“',reveals:'Herr Weber'},
 {label:'„Danke, ich will Sie nicht aufhalten.“',response:'„Alles Gute beim Einzug. Wir sehen uns.“'}];
}
export function interact(s:GameState, input:string, choice?:DialogueChoice):GameState{
 const greeted = s.greetedMan || s.place==='street' || s.place==='home';
 let answer = choice?.response;
 let name = choice?.reveals==='Herr Weber' ? 'Herr Weber' : undefined;
 let reveal = choice?.reveals==='square' ? 'square' as Place : undefined;
 let manLeft=s.manLeft;
 if(!answer) {
  const low=input.toLowerCase();
  if(low.includes('hund')||low.includes('pes')) {answer='„Er heißt Balu. Ich bin übrigens Weber.“';name='Herr Weber';}
  else if(low.includes('kaffee')||low.includes('café')||low.includes('kavár')) {answer='„Da vorne am Marktplatz gibt es ein Café. Aber jetzt muss ich mit Balu weiter.“';reveal='square';manLeft=true;}
  else if(low.includes('tschüss')||low.includes('auf wiedersehen')) {answer='„Auf Wiedersehen, und viel Erfolg beim Einzug!“';manLeft=true;}
  else answer=s.place==='bakery'?'„Entschuldigung, ich habe Sie nicht ganz verstanden. Können Sie das anders sagen?“':'„Ach so. Entschuldigen Sie, ich muss gleich mit Balu weiter. Viel Erfolg beim Einzug!“';
 }
 if(input.toLowerCase().includes('nicht aufhalten') || input.toLowerCase().includes('tschüss')) manLeft=true;
 return {...s, minute:s.minute+2, greetedMan:greeted,manLeft,
 knownNames:name?[...new Set([...s.knownNames,name])]:s.knownNames,
 discovered:reveal?[...new Set([...s.discovered,reveal])]:s.discovered,
 messages:[...s.messages,{who:'player',text:input},{who:'npc',text:answer}],
 journal:[...s.journal, ...(name?[`Zjistil jsi jméno souseda: ${name}.`]:[]),...(reveal?['Získal jsi informaci o náměstí.']:[])]};
}
