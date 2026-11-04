import type {Answer,Lang} from './world';
type Phrase={cs:string;de:string};
const make=(id:string,cs:string,de:string):Answer=>({id,topic:'followup',cs,de});
export function contextualOptions(last:Phrase|undefined,lang:Lang,turn:number):Answer[]|null{
 if(!last)return null;
 const line=(last[lang]||last.cs||'').trim().toLowerCase();
 if(!/[?？][”"']?$/.test(line))return null;
 const options=(list:[string,string,string][])=>list.map(([id,cs,de])=>make(id+'-'+turn,cs,de));
 if(/co bys dělal ty|was würden sie tun|was würdest du tun/.test(line))return options([
 ['situation-facts','Nejdřív bych zjistil, co se skutečně stalo.','Zuerst würde ich herausfinden, was wirklich passiert ist.'],
 ['situation-talk','Zkusil bych si s tím člověkem promluvit.','Ich würde versuchen, mit der Person zu reden.'],
 ['situation-wait','Asi bych nic neuspěchal.','Ich würde lieber nichts überstürzen.']]);
 if(/jsi tu nový|sind sie neu|bist du neu/.test(line))return options([
 ['new-yes','Ano, právě jsem se sem přistěhoval.','Ja, ich bin gerade hergezogen.'],
 ['new-curious','Ano, a chci tu poznat nové lidi.','Ja, ich möchte hier neue Leute kennenlernen.'],
 ['new-unsure','Ano, zatím se tu moc nevyznám.','Ja, ich kenne mich hier noch nicht gut aus.']]);
 if(/jak se ti.*daří|wie gefällt.*stadt|wie geht es dir/.test(line))return options([
 ['town-good','Zatím dobře. Město je docela sympatické.','Ganz gut. Die Stadt gefällt mir bisher.'],
 ['town-lost','Upřímně, ještě se tu trochu ztrácím.','Ehrlich gesagt finde ich mich hier noch nicht zurecht.'],
 ['town-meet','Rád bych tu poznal nové lidi.','Ich würde gerne neue Leute kennenlernen.']]);
 if(/jaký máš dnes den|wie läuft.*tag/.test(line))return options([
 ['day-good','Zatím pohodový. A tvůj?','Bisher ganz entspannt. Und deiner?'],
 ['day-busy','Dnes mám hodně práce, ale chvíli si rád popovídám.','Heute habe ich viel zu tun, aber kurz rede ich gerne.'],
 ['day-fun','Zatím docela veselý.','Bisher ganz lustig.']]);
 if(/co tě.*přivedlo|was führt.*hierher/.test(line))return options([
 ['move-new','Chtěl jsem začít někde znovu.','Ich wollte irgendwo neu anfangen.'],
 ['move-job','Přestěhoval jsem se hlavně kvůli práci.','Ich bin vor allem wegen der Arbeit hergezogen.'],
 ['move-curious','Byl jsem zvědavý na život v malém městě.','Ich war neugierig auf das Leben in einer Kleinstadt.']]);
 if(/co.*myslíš|was meinen|wie sehen sie|jak to vidíš|was denkst du/.test(line))return options([
 ['view-agree','Myslím, že na tom něco je.','Ich glaube, da ist etwas dran.'],
 ['view-different','Já to vidím trochu jinak.','Ich sehe das etwas anders.'],
 ['view-uncertain','Zatím o tom nemám jasno.','Da bin ich mir noch nicht sicher.']]);
 if(/proč|warum|wieso/.test(line))return options([
 ['reason-important','Protože mi na tom záleží.','Weil mir das wichtig ist.'],
 ['reason-experience','Mám s tím nějakou zkušenost.','Ich habe damit eigene Erfahrungen gemacht.'],
 ['reason-unsure','Nejsem si úplně jistý.','Ich bin mir nicht ganz sicher.']]);
 if(/a ty|und sie|und du/.test(line))return options([
 ['self-explore','Já teď hlavně poznávám nové prostředí.','Ich lerne gerade meine neue Umgebung kennen.'],
 ['self-relax','Dnes bych rád trochu odpočíval.','Heute möchte ich mich etwas entspannen.'],
 ['self-people','Doufám, že tu poznám zajímavé lidi.','Ich hoffe, interessante Menschen kennenzulernen.']]);
 return options([
 ['generic-yes','To mě zajímá. Pověz mi o tom víc.','Das interessiert mich. Erzähl mir mehr.'],
 ['generic-unsure','Ještě o tom přemýšlím.','Darüber denke ich noch nach.'],
 ['generic-share','S tím už jsem se taky setkal.','Das habe ich auch schon erlebt.']]);
}
export function contextualResponse(id:string):Phrase|null{
 const prefix=id.replace(/-\d+$/,'');
 const lines:Record<string,Phrase>={
 'situation-facts':{cs:'To je rozumné. Bez faktů bychom si mohli jen domýšlet.',de:'Das klingt vernünftig. Ohne Fakten würden wir nur raten.'},
 'situation-talk':{cs:'Přímý rozhovor obvykle pomůže víc než dohady.','de':'Ein direktes Gespräch hilft oft mehr als Vermutungen.'},
 'situation-wait':{cs:'Rozvaha je fajn. Jen se v ní nesmí člověk schovat před rozhodnutím.',de:'Nachdenken ist gut. Man sollte sich nur nicht dahinter verstecken.'},
 'new-yes':{cs:'Tak vítej! Co tě sem přivedlo?',de:'Dann willkommen! Was hat dich hierhergeführt?'},
 'new-curious':{cs:'To tě čeká pěkná sbírka příběhů. Tady se zná skoro každý.',de:'Da warten einige Geschichten auf dich. Hier kennt fast jeder jeden.'},
 'new-unsure':{cs:'To se časem poddá. Já jsem se tu jednou ztratil cestou z pekárny.',de:'Das kommt mit der Zeit. Ich habe mich hier mal auf dem Weg von der Bäckerei verlaufen.'},
 'town-good':{cs:'To rád slyším. Co se ti líbilo nejvíc?',de:'Das freut mich. Was hat dir bisher am besten gefallen?'},
 'town-lost':{cs:'Mně se tu povedlo zabloudit i na vlastní ulici. Kam ses chtěl dostat?',de:'Ich habe mich sogar schon in meiner eigenen Straße verlaufen. Wohin wolltest du?'},
 'town-meet':{cs:'Pak se třeba zastav v kavárně. Jen nečekej, že každý má vždycky náladu povídat.',de:'Dann schau doch ins Café. Aber nicht jeder hat immer Lust zu reden.'},
 'day-good':{cs:'U mě docela rušno. Ale na chvilku se zastavit můžu.',de:'Bei mir ist einiges los. Aber für einen Moment habe ich Zeit.'},
 'day-busy':{cs:'Tak tě nebudu zdržovat. Co tě dnes ještě čeká?',de:'Dann halte ich dich nicht lange auf. Was steht bei dir heute noch an?'},
 'day-fun':{cs:'Tady se občas stačí vydat pro pečivo a člověk má historku na celý večer.',de:'Hier holt man manchmal nur Brötchen und hat schon eine Geschichte für den ganzen Abend.'},
 'move-new':{cs:'Nový začátek je dobrodružství. Co bys tu chtěl najít?',de:'Ein Neuanfang ist ein Abenteuer. Was möchtest du hier finden?'},
 'move-job':{cs:'Tak ať ti práce dobře vychází. Máš i nějaký koníček?',de:'Dann viel Erfolg bei der Arbeit. Hast du auch ein Hobby?'},
 'move-curious':{cs:'Tak to tě čeká překvapení. Malé město znamená velké příběhy.',de:'Dann wirst du überrascht sein. Eine kleine Stadt hat große Geschichten.'},
 'view-agree':{cs:'Vidíš, aspoň v něčem si rozumíme. Co myslíš, že bude dál?',de:'Da verstehen wir uns wenigstens in einem Punkt. Was passiert wohl als Nächstes?'},
 'view-different':{cs:'To je fér. Zajímá mě, jak ses k tomu názoru dostal.',de:'Das ist fair. Mich interessiert, wie du dazu kommst.'},
 'view-uncertain':{cs:'Nemusíš mít hned odpověď. Někdy se věci ukážou až časem.',de:'Du brauchst nicht sofort eine Antwort. Manches zeigt sich mit der Zeit.'},
 'reason-important':{cs:'To chápu. Pak je dobré vědět, co od toho očekáváš.',de:'Verstehe. Dann hilft es, zu wissen, was du dir davon erhoffst.'},
 'reason-experience':{cs:'Tak to už víš, o čem mluvíš. Jak to dopadlo?',de:'Dann weißt du, wovon du sprichst. Wie ging es aus?'},
 'reason-unsure':{cs:'To je v pořádku. Všichni občas tápeme.',de:'Das ist okay. Wir sind uns alle manchmal unsicher.'},
 'self-explore':{cs:'To je dobrý plán. Na náměstí se pořád něco děje.',de:'Guter Plan. Auf dem Marktplatz ist immer etwas los.'},
 'self-relax':{cs:'To ti přeju. Tady se na klid musí člověk občas taky objednat.',de:'Das wünsche ich dir. Hier muss man Ruhe manchmal ebenfalls reservieren.'},
 'self-people':{cs:'Držím palce. Zajímaví lidé se často objeví tam, kde je člověk nečeká.',de:'Viel Glück. Interessante Menschen tauchen oft ganz unerwartet auf.'},
 'generic-yes':{cs:'Klidně. Každý to má trochu jinak. Co tě na tom zaujalo?',de:'Gerne. Jeder sieht das etwas anders. Was interessiert dich daran?'},
 'generic-unsure':{cs:'To chápu. Někdy není kam spěchat.',de:'Das verstehe ich. Manchmal muss man nicht eilen.'},
 'generic-share':{cs:'Tak to máme něco společného. Jaká byla tvoje zkušenost?',de:'Dann haben wir etwas gemeinsam. Welche Erfahrung hast du gemacht?'}
 };
 return lines[prefix]??null;
}
