import type {TownState,Lang,Place} from './world';
export type GuideAction='travel'|'eat'|'sleep'|'shift';
export type Guide={cs:string;de:string;actionCs:string;actionDe:string;action:GuideAction;destination?:Place};
export function nextSuggestion(s:TownState):Guide|null{
 const {energy,hunger,groceries}=s.life;
 const hour=Math.floor(s.minute/60),workingDay=s.day%7>=2;
 const sinceMeal=s.life.lastMeal>=0?s.day*1440+s.minute-s.life.lastMeal:s.day*1440+s.minute-420;
 if(energy<=35){
  if(s.place==='home')return {cs:'Energie klesá. Postel vypadá čím dál lákavěji.',de:'Deine Energie sinkt. Das Bett sieht immer gemütlicher aus.',actionCs:'Jít spát',actionDe:'Schlafen',action:'sleep'};
  return {cs:'Docházejí ti síly. Doma si můžeš odpočinout.',de:'Deine Kräfte lassen nach. Zu Hause kannst du dich ausruhen.',actionCs:'Jít domů',actionDe:'Nach Hause',action:'travel',destination:'home'};
 }
 if(hunger>=65||sinceMeal>=480&&hunger>=40){
  if(s.place==='home'&&groceries>0)return {cs:'Už dlouho jsi nejedl. V ledničce ještě něco je.',de:'Du hast lange nichts gegessen. Im Kühlschrank ist noch etwas.',actionCs:'Připravit jídlo',actionDe:'Essen zubereiten',action:'eat'};
  if(groceries===0&&s.wallet>=12)return {cs:'Lednička je prázdná. Je čas doplnit zásoby.',de:'Der Kühlschrank ist leer. Zeit für einen Einkauf.',actionCs:'Do supermarketu',actionDe:'Zum Supermarkt',action:'travel',destination:'market'};
  if(s.wallet>=18)return {cs:'Od posledního jídla uplynulo dost času.',de:'Deine letzte Mahlzeit liegt schon eine Weile zurück.',actionCs:'Do restaurace',actionDe:'Ins Restaurant',action:'travel',destination:'restaurant'};
  if(s.wallet>=2.5)return {cs:'Máš hlad. V pekárně něco rychlého seženeš.',de:'Du hast Hunger. In der Bäckerei gibt es einen kleinen Imbiss.',actionCs:'Do pekárny',actionDe:'Zur Bäckerei',action:'travel',destination:'bakery'};
  return {cs:'Máš hlad a peníze jsou skoro pryč. Máš doma něco k jídlu?',de:'Du hast Hunger und kaum Geld. Ist zu Hause noch etwas zu essen?',actionCs:'Jít domů',actionDe:'Nach Hause',action:'travel',destination:'home'};
 }
 if(workingDay&&s.employment!=='fired'&&s.lastShift!==s.day&&hour>=7&&hour<=16){
  if(s.place==='work')return {cs:'Začíná pracovní den. Na stole už čekají úkoly.',de:'Der Arbeitstag beginnt. Auf dem Schreibtisch wartet Arbeit.',actionCs:'Začít směnu',actionDe:'Schicht beginnen',action:'shift'};
  if(energy>=40)return {cs:'Dnes máš pracovní den. Šéf si všimne, když nepřijdeš.',de:'Heute ist Arbeitstag. Der Chef merkt, wenn du fehlst.',actionCs:'Jít do práce',actionDe:'Zur Arbeit',action:'travel',destination:'work'};
 }
 if(hour>=21&&s.place!=='home')return {cs:'Už je pozdě. Doma můžeš nabrat síly na další den.',de:'Es ist spät. Zu Hause kannst du Kräfte für morgen sammeln.',actionCs:'Jít domů',actionDe:'Nach Hause',action:'travel',destination:'home'};
 return null;
}
