export type Lang='cs'|'de';
export type Place='home'|'street'|'bakery'|'square'|'work'|'library';
export type NpcId='neighbor'|'baker'|'boss'|'librarian';
export type Goal='neighbor'|'recommend'|'purchase'|'work'|'read'|'research';
export type Topic='intro'|'name'|'dog'|'advice'|'product'|'purchase'|'job'|'books'|'website'|'followup'|'generic'|'thanks'|'bye';
export type Message={who:'npc'|'player'|'system';text:string;translations?:Partial<Record<Lang,string>>};
export type Choice={id:string;text:string;topic:Topic};
export type DialogueMemory={asked:string[];topic:Topic|null;turns:number;repeats:number;closed:boolean;history:Message[];customResponses:string[]};
export type Recommendation={place:Place;from:NpcId};
export type GameState={
 place:Place;minute:number;day:number;wallet:number;mindset:number;
 discovered:Place[];recommendations:Recommendation[];knownNames:string[];
 conversations:Record<NpcId,DialogueMemory>;
 completedGoals:Goal[];journal:Record<Lang,string[]>;notifications:Record<Lang,string[]>;
 purchases:number;reads:number;researches:number;lastStudyDay:Record<'read'|'research',number>;shiftsWorked:number;shiftsMissed:number;workStrikes:number;
 employment:'employed'|'warning'|'fired';dayLastWorked:number;
};
const blank=():DialogueMemory=>({asked:[],topic:null,turns:0,repeats:0,closed:true,history:[],customResponses:[]});
const roster:NpcId[]=['neighbor','baker','boss','librarian'];
export const initialState:GameState={
 place:'home',minute:630,day:0,wallet:85,mindset:12,
 discovered:['home','street','work','bakery'],recommendations:[],knownNames:[],
 conversations:{neighbor:blank(),baker:blank(),boss:blank(),librarian:blank()},
 completedGoals:[],journal:{cs:['Přistěhoval ses do městečka.'],de:['Du bist in die Stadt gezogen.']},
 notifications:{cs:['Nový domov. Nová práce. Nové možnosti.'],de:['Neues Zuhause. Neuer Job. Neue Möglichkeiten.']},
 purchases:0,reads:0,researches:0,lastStudyDay:{read:-1,research:-1},shiftsWorked:0,shiftsMissed:0,workStrikes:0,employment:'employed',dayLastWorked:-1
};
const lines:Record<Lang,Record<string,string>>={
 cs:{
 introNeighbor:'Vítej v sousedství! Přistěhoval ses zdaleka?',introBaker:'Vítej v pekárně. Co ti mohu nabídnout?',introBoss:'Tak ty jsi náš nový kolega. Zvládneš dnes směnu?',introLibrarian:'Vítej v knihovně. Hledáš něco konkrétního?',
 name:'Jmenuji se Weber. Bydlím tu už dlouho.',dog:'To je Balu. Naše každodenní procházka je jeho nejoblíbenější část dne.',
 advice:'Na náměstí je útulná kavárna. A v knihovně mají zajímavé knihy.',product:'Dnes máme čerstvé preclíky a jablečný koláč.',purchase:'Jeden preclík, prosím. To je 2,50 €.',noMoney:'Obávám se, že ti na to nezbývá dost peněz.',job:'Zkus se zastavit pravidelně. Mám rád spolehlivé kolegy.',books:'Zkus krátkou knihu o naslouchání. Někdy je důležitější slyšet než odpovídat.',website:'Na našem informačním terminálu najdeš místní průvodce a články.',followup:'To je dobrá otázka. Místní věci pochopíš nejlépe, když je poznáš sám.',thanks:'Rádo se stalo. Třeba se zase uvidíme.',bye:'Rád jsem si popovídal. Měj se hezky!',
 repeated1:'Tohle už jsi mi dnes pokládal. Něco ti na mé odpovědi nesedělo?',repeated2:'Znovu ta samá otázka? Asi mě zkoušíš. Už si ze mě děláš legraci?',repeated3:'Teď si opravdu začínám dělat starosti o tvoji paměť. Radši už půjdu. Ahoj!',
 unavailable:'Teď mám práci, ale rád tě pozdravím později.',unknown0:'To zní zajímavě. Co tě k tomu přivedlo?',unknown1:'To jsem ještě neslyšel. Myslíš to vážně, nebo si děláš legraci?',unknown2:'Hm, na to bych neměl jednoduchou odpověď. Jak to vidíš ty?',unknown3:'Možná bychom si o tom mohli povídat někdy u kávy.',unknown4:'To je nečekaný pohled. Povíš mi o tom trochu víc?',
 questionMore:'A jakou s tím máš zkušenost?',questionWhy:'Proč si to myslíš?',questionOk:'To chápu. A co budeš dělat dál?',
 shift:'Dnes jsi odpracoval směnu a dostal 45 €.',shiftAlready:'Dnešní směnu už máš za sebou.',shiftWeekend:'Dnes nemáš plánovanou směnu.',shiftFired:'Tady už bohužel nepracuješ. Můžeš si najít novou příležitost.',
 read:'Přečetl sis krátký text. Mindset se zvýšil o 3.',research:'Prošel sis článek na městském informačním terminálu. Mindset +2.',
 workWarning:'V práci se ptají, proč jsi nepřišel. Ještě jedna absence může mít následky.',
 fired:'Zaměstnavatel s tebou kvůli opakovaným absencím ukončil pracovní poměr.',
 bossWarning:'Takový tón na pracovišti nepatří. Zkusme se bavit věcně.',bossFired:'To už je potřetí. S takovým jednáním nemůžeme pokračovat. Pracovní poměr končí.',welcomeBack:'Rád tě zase vidím. Kde jsme to posledně skončili?',nextDay:'Začal nový den.',closed:'Rozhovor je ukončený. Příště můžete navázat tam, kde jste skončili.'
 },
 de:{
 introNeighbor:'Willkommen in der Nachbarschaft! Sind Sie von weit her zugezogen?',introBaker:'Willkommen in der Bäckerei! Was darf es sein?',introBoss:'Sie sind also unser neuer Kollege. Schaffen Sie heute Ihre Schicht?',introLibrarian:'Willkommen in der Bibliothek. Suchen Sie etwas Bestimmtes?',
 name:'Ich heiße Weber. Ich wohne schon lange hier.',dog:'Das ist Balu. Unser Spaziergang ist sein liebster Teil des Tages.',
 advice:'Am Marktplatz gibt es ein gemütliches Café. Und in der Bibliothek gibt es interessante Bücher.',product:'Heute haben wir frische Brezeln und Apfelkuchen.',purchase:'Eine Brezel, bitte. Das macht 2,50 €.',noMoney:'Leider reicht Ihr Geld dafür nicht.',job:'Kommen Sie bitte regelmäßig. Ich schätze zuverlässige Kollegen.',books:'Probieren Sie ein kurzes Buch übers Zuhören. Manchmal ist Zuhören wichtiger als Antworten.',website:'An unserem Infoterminal finden Sie lokale Tipps und Artikel.',followup:'Eine gute Frage. Am besten lernen Sie die Stadt kennen, indem Sie selbst auf Entdeckung gehen.',thanks:'Sehr gerne. Vielleicht sehen wir uns wieder.',bye:'Schön, dass wir gesprochen haben. Machen Sie es gut!',
 repeated1:'Das haben Sie mich heute schon gefragt. War meine Antwort nicht hilfreich?',repeated2:'Schon wieder dieselbe Frage? Sie nehmen mich wohl auf den Arm!',repeated3:'Jetzt mache ich mir fast Sorgen um Ihr Gedächtnis. Ich muss dann weiter. Auf Wiedersehen!',
 unavailable:'Ich bin gerade beschäftigt, aber wir können später sprechen.',unknown0:'Das klingt interessant. Wie sind Sie darauf gekommen?',unknown1:'Das habe ich noch nie gehört. Meinen Sie das ernst oder machen Sie Spaß?',unknown2:'Hm, darauf habe ich keine einfache Antwort. Wie sehen Sie das?',unknown3:'Vielleicht können wir uns darüber einmal bei einem Kaffee unterhalten.',unknown4:'Ein unerwarteter Gedanke. Erzählen Sie mir mehr!',
 questionMore:'Und welche Erfahrungen haben Sie damit gemacht?',questionWhy:'Warum denken Sie das?',questionOk:'Verstehe. Und was möchten Sie als Nächstes tun?',
 shift:'Sie haben Ihre Schicht gearbeitet und 45 € verdient.',shiftAlready:'Ihre heutige Schicht ist schon erledigt.',shiftWeekend:'Heute ist keine Schicht geplant.',shiftFired:'Sie arbeiten hier leider nicht mehr. Sie können sich eine neue Stelle suchen.',
 read:'Sie haben einen kurzen Text gelesen. Mindset +3.',research:'Sie haben einen Artikel am städtischen Infoterminal gelesen. Mindset +2.',
 workWarning:'Im Betrieb fragt man sich, warum Sie nicht erschienen sind. Weitere Fehlzeiten können Folgen haben.',
 fired:'Nach wiederholtem unentschuldigtem Fehlen hat der Betrieb das Arbeitsverhältnis beendet.',
 bossWarning:'So sprechen wir hier nicht miteinander. Lassen Sie uns sachlich bleiben.',bossFired:'Das ist nun schon das dritte Mal. So können wir nicht weiterarbeiten. Das Arbeitsverhältnis endet.',welcomeBack:'Schön, Sie wiederzusehen. Wo waren wir zuletzt stehen geblieben?',nextDay:'Ein neuer Tag beginnt.',closed:'Das Gespräch ist beendet. Beim nächsten Treffen können Sie daran anknüpfen.'
 }
};
export const say=(lang:Lang,key:string)=>lines[lang][key]??key;
export function clock(s:GameState){const m=s.minute%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}
export function dayName(lang:Lang,day:number){const cs=['Sobota','Neděle','Pondělí','Úterý','Středa','Čtvrtek','Pátek'],de=['Samstag','Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag'];return(lang==='cs'?cs:de)[day%7];}
export function npcAt(place:Place):NpcId|null{return place==='street'?'neighbor':place==='bakery'?'baker':place==='work'?'boss':place==='library'?'librarian':null;}
export function available(s:GameState){return npcAt(s.place)!==null;}
export function memory(s:GameState,npc:NpcId){return s.conversations?.[npc]??blank();}
export const routes:Record<Place,Place[]>={home:['street'],street:['home','bakery','work','square','library'],bakery:['street'],work:['street'],square:['street','library'],library:['street','square']};
export function canTravel(s:GameState,p:Place){return s.place===p||routes[s.place].includes(p)&&s.discovered.includes(p);}
export function move(s:GameState,p:Place,lang:Lang):GameState{
 if(!canTravel(s,p))return s;
 const names:Record<Place,[string,string]>={home:['Domov','Zuhause'],street:['Ulice','Straße'],bakery:['Pekárna','Bäckerei'],square:['Náměstí','Marktplatz'],work:['Práce','Arbeit'],library:['Knihovna','Bibliothek']};
 return {...s,place:p,minute:s.minute+5,journal:{cs:[...s.journal.cs,'Navštíveno: '+names[p][0]],de:[...s.journal.de,'Besucht: '+names[p][1]]}};
}
export function begin(s:GameState,lang:Lang):GameState{
 const npc=npcAt(s.place);if(!npc)return s;const m=memory(s,npc);
 if(!m.closed)return s;
 const opening=m.turns>0?'welcomeBack':'intro'+({neighbor:'Neighbor',baker:'Baker',boss:'Boss',librarian:'Librarian'}[npc]);const newHistory=[...m.history,{who:'npc' as const,text:say(lang,opening),translations:{cs:say('cs',opening),de:say('de',opening)}}];
 return {...s,conversations:{...s.conversations,[npc]:{...m,closed:false,history:newHistory}}};
}
const prompts:Record<Lang,Record<string,string>>={
 cs:{'name':'Jak se jmenujete?','dog':'Jak se jmenuje váš pes?','advice':'Co byste mi doporučil ve městě?','product':'Co máte dnes čerstvého?','purchase':'Koupím si preclík.','job':'Jaké mám v práci povinnosti?','books':'Doporučíte mi nějakou knihu?','website':'Kde najdu užitečné informace?','followup':'Můžete mi o tom říct víc?','thanks':'Děkuji za informace.','bye':'Děkuji za rozhovor, mějte se hezky.','genericMore':'To je zajímavé. Co tím myslíte?','genericWhy':'Proč si to myslíte?','genericOk':'Rozumím. A co dál?'},
 de:{'name':'Wie heißen Sie?','dog':'Wie heißt Ihr Hund?','advice':'Was empfehlen Sie mir in der Stadt?','product':'Was haben Sie heute frisch?','purchase':'Ich hätte gerne eine Brezel.','job':'Was sind meine Aufgaben bei der Arbeit?','books':'Können Sie mir ein Buch empfehlen?','website':'Wo finde ich nützliche Informationen?','followup':'Können Sie mir mehr darüber erzählen?','thanks':'Vielen Dank für den Hinweis.','bye':'Danke für das Gespräch. Einen schönen Tag noch!','genericMore':'Interessant. Was meinen Sie damit?','genericWhy':'Warum denken Sie das?','genericOk':'Ich verstehe. Wie geht es weiter?'}
};
export function options(s:GameState,lang:Lang):Choice[]{
 const npc=npcAt(s.place);if(!npc)return [];
 const m=memory(s,npc);if(m.closed)return [];
 const offered:Choice[]=[];
 const add=(id:string,topic:Topic,label=id)=>{
  if(!m.asked.includes(id))offered.push({id,topic,text:prompts[lang][label]??label});
 };
 if(npc==='neighbor'){add('name','name');add('dog','dog');add('advice','advice');}
 if(npc==='baker'){add('product','product');add('purchase','purchase');add('advice','advice');}
 if(npc==='boss'){add('job','job');add('advice','advice');}
 if(npc==='librarian'){add('books','books');add('website','website');add('advice','advice');}
 if(m.topic&&m.topic!=='bye'){
  const topicId='followup-'+m.turns;
  add(topicId,'followup','followup');
 }
 if(m.topic==='generic'){
  add('custom-more-'+m.turns,'generic','genericMore');
  add('custom-why-'+m.turns,'generic','genericWhy');
  add('custom-ok-'+m.turns,'generic','genericOk');
 }
 if(m.turns>0)add('thanks-'+m.turns,'thanks');
 // Always offer a fresh, open-ended topic on returning; this is not a repeated question.
 if(m.turns>0)add('catchup-'+m.turns,'generic',(['genericMore','genericWhy','genericOk'][m.turns%3]));
 const selected=offered.slice(0,4);
 selected.push({id:'exit',topic:'bye',text:prompts[lang].bye});
 return selected;
}
export function infer(text:string,npc:NpcId):Topic{
 const v=text.toLocaleLowerCase();
 if(/(auf wiedersehen|tschüss|schönen tag|mějte se|nashledanou|na shledanou|sbohem|bis bald)/.test(v))return 'bye';
 if(/(děkuj|danke|thanks)/.test(v))return 'thanks';
 if(/(pes|hund|balu)/.test(v))return 'dog';
 if(/(jmen|heiß|name)/.test(v))return 'name';
 if(/(kavár|café|cafe|platz|tip|empfehl|doporuč)/.test(v))return 'advice';
 if(/(precl|brezel|koup|kaufen|hätte gerne)/.test(v))return 'purchase';
 if(/(čerstv|frisch|pečiv|brot)/.test(v))return 'product';
 if(/(prác|arbeit|schicht|chef|job)/.test(v))return 'job';
 if(/(knih|buch|lesen|čten)/.test(v))return 'books';
 if(/(web|internet|website|informac|artikel|člán)/.test(v))return 'website';
 if(/(víc|mehr|warum|proč|wieso)/.test(v))return 'followup';
 return 'generic';
}
function hash(s:string){let n=7;for(const c of s)n=(n*31+c.charCodeAt(0))|0;return Math.abs(n);}
export function interact(s:GameState,text:string,lang:Lang,choice?:Choice):GameState{
 const npc=npcAt(s.place);if(!npc)return s;
 const started=s.conversations[npc]?.closed?begin(s,lang):s;
 const m=memory(started,npc);
 const topic=choice?.topic??infer(text,npc),id=choice?.id??topic;
 const repeated=topic!=='generic'&&topic!=='bye'&&topic!=='thanks'&&m.asked.some(k=>k===id||k===topic);
 const repeats=repeated?m.repeats+1:0;
 let response='',responseKey='',closed=false,wallet=started.wallet,mindset=started.mindset;let workStrikes=started.workStrikes??0;let employment=started.employment;
 let discovered=[...started.discovered],recommendations=[...started.recommendations],knownNames=[...started.knownNames];
 const goals=new Set(started.completedGoals);
 const journal={cs:[...started.journal.cs],de:[...started.journal.de]};
 const log=(cs:string,de:string)=>{journal.cs.push(cs);journal.de.push(de)};
 if(npc==='boss'&&/(arschloch|idiot|halt die klappe|blödmann|debil|blbec|drž hubu|hlupák)/i.test(text)){workStrikes++;responseKey=workStrikes>=3?'bossFired':'bossWarning';response=say(lang,responseKey);if(workStrikes>=3){employment='fired';closed=true;}}
 else if(topic==='bye'){responseKey='bye';response=say(lang,responseKey);closed=true;}
 else if(repeats>=3){responseKey='repeated3';response=say(lang,responseKey);closed=true;}
 else if(repeated){responseKey=repeats===1?'repeated1':'repeated2';response=say(lang,responseKey);}
 else if(topic==='generic'){
  const variants=['unknown0','unknown1','unknown2','unknown3','unknown4'];
  responseKey=variants[(hash(text)+m.turns)%variants.length];response=say(lang,responseKey);
 }else {
  const key=topic==='name'?'name':topic==='dog'?'dog':topic==='advice'?'advice':topic==='product'?'product':topic==='purchase'?'purchase':topic==='job'?'job':topic==='books'?'books':topic==='website'?'website':topic==='thanks'?'thanks':'followup';
  responseKey=key;response=say(lang,key);
  if(topic==='name'||topic==='dog'){
   if(!knownNames.includes('Herr Weber')&&npc==='neighbor'){knownNames.push('Herr Weber');goals.add('neighbor');log('Zjistil jsi sousedovo jméno.','Du kennst jetzt den Namen des Nachbarn.');}
  }
  if(topic==='advice'){
   if(!discovered.includes('square'))discovered.push('square');
   if(!discovered.includes('library'))discovered.push('library');
   if(!recommendations.some(x=>x.place==='square'))recommendations.push({place:'square',from:npc});
   if(!recommendations.some(x=>x.place==='library'))recommendations.push({place:'library',from:npc});
   goals.add('recommend');
   log('Dostal jsi tip na náměstí a knihovnu.','Du hast Tipps für Marktplatz und Bibliothek bekommen.');
  }
  if(topic==='purchase'&&npc==='baker'){
   if(wallet>=2.5){wallet-=2.5;goals.add('purchase');log('Koupil sis preclík za 2,50 €.','Du hast eine Brezel für 2,50 € gekauft.');}
   else {responseKey='noMoney';response=say(lang,responseKey);}
  }
 }
 const asked=topic==='generic'||topic==='bye'||topic==='thanks'||repeated?m.asked:[...m.asked,id];
 const mem:DialogueMemory={...m,asked,topic:topic==='bye'?m.topic:topic,turns:m.turns+1,repeats,closed,history:[...m.history,{who:'player',text},{who:'npc',text:response,translations:{cs:say('cs',responseKey),de:say('de',responseKey)}}]};
 return {...started,minute:started.minute+2,wallet,mindset,workStrikes,employment,discovered,recommendations,knownNames,completedGoals:[...goals],journal,conversations:{...started.conversations,[npc]:mem}};
}
export function study(s:GameState,kind:'read'|'research',lang:Lang):GameState{
 if(s.place!=='library'||s.lastStudyDay?.[kind]===s.day)return s;
 const g=new Set(s.completedGoals),journal={cs:[...s.journal.cs],de:[...s.journal.de]};
 const add=kind==='read'?3:2;
 g.add(kind==='read'?'read':'research');
 journal.cs.push(kind==='read'?'Četl jsi v knihovně. Mindset +3.':'Přečetl sis užitečný webový článek. Mindset +2.');
 journal.de.push(kind==='read'?'Du hast in der Bibliothek gelesen. Mindset +3.':'Du hast einen informativen Online-Artikel gelesen. Mindset +2.');
 return {...s,mindset:Math.min(100,s.mindset+add),minute:s.minute+30,
 reads:s.reads+(kind==='read'?1:0),researches:s.researches+(kind==='research'?1:0),lastStudyDay:{...s.lastStudyDay,[kind]:s.day},completedGoals:[...g],journal};
}
export function workShift(s:GameState):GameState{
 if(s.place!=='work'||s.employment==='fired'||s.day%7<2||s.dayLastWorked===s.day)return s;
 const goals=new Set(s.completedGoals);goals.add('work');
 return {...s,wallet:s.wallet+45,minute:s.minute+8*60,dayLastWorked:s.day,shiftsWorked:s.shiftsWorked+1,completedGoals:[...goals],journal:{cs:[...s.journal.cs,'Odpracovaná směna, výdělek 45 €.'],de:[...s.journal.de,'Schicht gearbeitet, 45 € verdient.']}};
}
export function nextDay(s:GameState):GameState{
 const missed=s.day%7>=2&&s.dayLastWorked!==s.day&&s.employment!=='fired'?s.shiftsMissed+1:s.shiftsMissed;
 const employment:GameState['employment']=missed>=3?'fired':missed>=2?'warning':s.employment;
 const journal={cs:[...s.journal.cs],de:[...s.journal.de]};
 if(employment!==s.employment){journal.cs.push(say('cs',employment==='fired'?'fired':'workWarning'));journal.de.push(say('de',employment==='fired'?'fired':'workWarning'));}
 return {...s,day:s.day+1,minute:8*60,shiftsMissed:missed,employment,journal};
}
export function conversationAvailable(s:GameState){return npcAt(s.place)!==null;}
