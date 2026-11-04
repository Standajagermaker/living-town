import type {Answer,Lang} from './world';
type Phrase={cs:string;de:string};
const make=(id:string,cs:string,de:string):Answer=>({id,topic:'followup',cs,de});
export function contextualOptions(last:Phrase|undefined,lang:Lang,turn:number):Answer[]|null{
 if(!last)return null;
 const line=(last[lang]||last.cs||'').trim().toLowerCase();
 if(!/[?？][”"']?$/.test(line))return null;
 const options=(list:[string,string,string][])=>list.map(([id,cs,de])=>make(id+'-'+turn,cs,de));
 if(/to byl vtip|jak jsi to myslel|jak jsi to myslela|das war ein witz|wie meinst du das|co tím myslíš|was meinst du damit/.test(line))return options([
 ['misunderstand-explain','Promiň, byl to jen pokus o vtip.','Entschuldige, das war nur ein Scherz.'],
 ['misunderstand-clarify','Myslel jsem to jinak. Zkusím to vysvětlit jednodušeji.','Ich meinte es anders. Ich versuche es einfacher zu erklären.'],
 ['misunderstand-accept','Asi máme jiný smysl pro humor, a to je v pořádku.','Wir haben wohl einen anderen Humor, das ist völlig okay.']]);
 if(/co to bude|co jste si vybral|was darf.s sein|was hätten sie gern|was darf ich ihnen geben/.test(line))return options([
 ['bakery-pretzel','Jeden preclík, prosím.','Eine Brezel, bitte.'],
 ['bakery-bread','Máte čerstvý chléb?','Haben Sie frisches Brot?'],
 ['bakery-wait','Ještě si vybírám, hned to bude.','Ich schaue noch kurz, gleich bin ich so weit.']]);
 if(/co bys tu chtěl najít|co bys tady chtěl najít|was möchtest du hier finden|was würdest du hier gern finden/.test(line))return options([
 ['find-friends','Rád bych tu poznal lidi, se kterými si budu rozumět.','Ich möchte Menschen kennenlernen, mit denen ich mich gut verstehe.'],
 ['find-peace','Hlavně klid a pocit, že sem patřím.','Vor allem Ruhe und das Gefühl, hier dazuzugehören.'],
 ['find-purpose','Možná nový začátek. Ještě přesně nevím jaký.','Vielleicht einen Neuanfang. Ich weiß noch nicht genau, wie.']]);
 if(/máš i nějaký koníček|hast du auch ein hobby|co tě baví|was machst du gern/.test(line))return options([
 ['hobbies-sport','Rád sportuju, nejradši venku.','Ich mache gern Sport, am liebsten draußen.'],
 ['hobbies-books','Rád si čtu a učím se nové věci.','Ich lese gern und lerne Neues.'],
 ['hobbies-explore','Teprve zkouším najít něco, co mě opravdu chytne.','Ich probiere noch aus, was mich wirklich begeistert.']]);
 if(/co se ti líbilo nejvíc|was hat dir bisher am besten gefallen/.test(line))return options([
 ['liked-park','Zatím mě nejvíc zaujal park a okolí.','Bisher gefallen mir der Park und die Umgebung am besten.'],
 ['liked-people','Líbí se mi, že se tu lidé občas zastaví a prohodí pár slov.','Mir gefällt, dass die Leute hier manchmal miteinander reden.'],
 ['liked-quiet','Ten klid. Oproti velkému městu je to změna.','Die Ruhe. Das ist anders als in der Großstadt.']]);
 if(/co tě dnes ještě čeká|was steht bei dir heute noch an/.test(line))return options([
 ['plans-work','Ještě musím něco dokončit v práci.','Ich muss noch etwas bei der Arbeit erledigen.'],
 ['plans-home','Půjdu nakoupit a pak domů.','Ich gehe noch einkaufen und dann nach Hause.'],
 ['plans-free','Zatím nemám nic v plánu. Uvidím, co se naskytne.','Noch habe ich nichts vor. Mal sehen, was sich ergibt.']]);
 if(/kam ses chtěl dostat|wohin wolltest du/.test(line))return options([
 ['lost-square','Hledal jsem náměstí.','Ich habe den Marktplatz gesucht.'],
 ['lost-library','Chtěl jsem dojít do knihovny.','Ich wollte zur Bibliothek.'],
 ['lost-wander','Vlastně nikam konkrétně. Jen se tu rozhlížím.','Eigentlich nirgendwohin. Ich schaue mich nur um.']]);
 if(/co máš dnes na stole za úkoly|was steht heute bei dir an|už jsi vyřídil dnešní úkoly|hast du deine aufgaben/.test(line))return options([
 ['work-ready','Mám své úkoly připravené, můžu se do nich pustit.','Ich habe meine Aufgaben vorbereitet und kann loslegen.'],
 ['work-stuck','Na jednom úkolu jsem se zasekl.','Bei einer Aufgabe komme ich nicht weiter.'],
 ['work-progress','Něco už mám hotové, zbytek mě ještě čeká.','Einiges ist erledigt, der Rest wartet noch.']]);
 if(/hledáte něco konkrétního ke čtení|suchen sie etwas bestimmtes zum lesen/.test(line))return options([
 ['read-story','Rád bych si půjčil nějaký dobrý příběh.','Ich würde gern eine gute Geschichte ausleihen.'],
 ['read-learn','Hledám něco, z čeho se něco dozvím.','Ich suche etwas, aus dem ich etwas lernen kann.'],
 ['read-browse','Zatím nevím, chci se nejdřív porozhlédnout.','Ich weiß noch nicht, ich möchte erst stöbern.']]);
 if(/přejete si poradit s účtem|geht es um ihr konto/.test(line))return options([
 ['bank-account','Rád bych se podíval na svůj účet.','Ich möchte mein Konto ansehen.'],
 ['bank-loan','Zajímají mě podmínky půjčky.','Ich interessiere mich für die Bedingungen eines Kredits.'],
 ['bank-notnow','Děkuji, zatím se jen informuji.','Danke, ich informiere mich erst einmal.']]);
 if(/co si dáte|ká(vu|vu).*čaj|was darf es sein.*kaffee|kaffee oder tee/.test(line))return options([
 ['cafe-coffee','Kávu, prosím.','Einen Kaffee, bitte.'],
 ['cafe-tea','Dám si čaj, děkuji.','Ich nehme einen Tee, danke.'],
 ['cafe-decide','Ještě se podívám na nabídku.','Ich schaue erst auf die Karte.']]);
 if(/co myslíš, že bude dál|was passiert wohl als nächstes/.test(line))return options([
 ['future-hope','Doufám, že se věci vyvinou dobře.','Ich hoffe, dass sich alles gut entwickelt.'],
 ['future-uncertain','To teď opravdu nevím.','Das weiß ich im Moment wirklich nicht.'],
 ['future-action','Záleží také na tom, co pro to uděláme.','Es hängt auch davon ab, was wir dafür tun.']]);
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
 'misunderstand-explain':{cs:'Aha, už chápu. Promiň, humor mi dnes nějak nedochází.',de:'Ach so, verstehe. Entschuldige, heute bin ich wohl nicht in Witzlaune.'},
 'misunderstand-clarify':{cs:'Teď je to jasnější. Dík, že jsi to upřesnil.',de:'Jetzt verstehe ich es besser. Danke für die Erklärung.'},
 'misunderstand-accept':{cs:'To je fér. Aspoň se nemusíme smát všemu stejně.',de:'Das ist fair. Wir müssen nicht über dieselben Dinge lachen.'},
 'bakery-pretzel':{cs:'Prosím. Dva padesát. Chcete ještě něco?',de:'Bitte schön. Zwei fünfzig. Darf es noch etwas sein?'},
 'bakery-bread':{cs:'Ano, právě jsme dopekli žitný. Chcete celý bochník?',de:'Ja, das Roggenbrot ist frisch aus dem Ofen. Ein ganzes Brot?'},
 'bakery-wait':{cs:'Dobře, ale za vámi už čeká fronta.',de:'In Ordnung, aber hinter Ihnen warten schon Leute.'},
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
 'find-friends':{cs:'To se mi líbí. Tady se lidé znají dlouho, ale nová přátelství vznikají taky.','de':'Das gefällt mir. Viele kennen sich hier lange, aber neue Freundschaften entstehen auch.'},
 'find-peace':{cs:'To chápu. Klid se tu najde, i když někdy za rohem překvapí soused s vrtačkou.',de:'Verstehe. Ruhe findet man hier, außer wenn der Nachbar seine Bohrmaschine auspackt.'},
 'find-purpose':{cs:'Někdy člověk nemusí všechno vědět hned. Co bys chtěl zkusit jako první?',de:'Man muss nicht gleich alles wissen. Was möchtest du zuerst ausprobieren?'},
 'hobbies-sport':{cs:'V okolí je fajn park. Běháš, nebo radši jezdíš na kole?',de:'Hier gibt es einen schönen Park. Läufst du lieber oder fährst du Rad?'},
 'hobbies-books':{cs:'Tak to se ti bude líbit knihovna. Mají tam i zajímavé besedy.',de:'Dann wird dir die Bibliothek gefallen. Dort gibt es auch interessante Lesungen.'},
 'hobbies-explore':{cs:'To znám. Já jsem jednou zkusil jógu. Tři dny jsem pak hledal svoje záda.',de:'Das kenne ich. Ich habe einmal Yoga ausprobiert. Danach habe ich drei Tage meinen Rücken gesucht.'},
 'liked-park':{cs:'V parku bývá nejhezčí ráno, když tam ještě není moc lidí.',de:'Im Park ist es morgens besonders schön, bevor viele Leute kommen.'},
 'liked-people':{cs:'To je pravda. Jen záleží, koho zrovna potkáš.',de:'Stimmt. Es kommt nur darauf an, wem man begegnet.'},
 'liked-quiet':{cs:'Tak to sis vybral dobře. Tedy pokud zrovna nejsou slavnosti.',de:'Dann bist du hier richtig. Solange nicht gerade Stadtfest ist.'},
 'plans-work':{cs:'Tak ať ti to uteče. Já už mám dnes hlavu jako pátrací balón.',de:'Dann viel Erfolg. Mein Kopf ist heute schon ganz voll.'},
 'plans-home':{cs:'Tak to máš docela obyčejný den. Někdy jsou ty nejlepší.',de:'Das klingt nach einem normalen Tag. Manchmal sind das die besten.'},
 'plans-free':{cs:'Tak si den užij. Někdy je nejlepší plán nemít žádný.',de:'Dann genieß den Tag. Manchmal ist kein Plan der beste Plan.'},
 'lost-square':{cs:'Náměstí je kousek odsud, po hlavní ulici.',de:'Der Marktplatz ist nicht weit, einfach die Hauptstraße entlang.'},
 'lost-library':{cs:'Knihovna je za náměstím. Není moc velká, ale mají dobrý výběr.',de:'Die Bibliothek liegt hinter dem Marktplatz. Klein, aber gut sortiert.'},
 'lost-wander':{cs:'Pak se klidně nech překvapit. Jen se nenech zavřít v obchodě po pracovní době.',de:'Dann lass dich überraschen. Lass dich nur nicht nach Ladenschluss einschließen.'},
 'work-ready':{cs:'Super. Tak ať nám to dnes odsýpá.',de:'Prima. Hoffentlich kommen wir heute gut voran.'},
 'work-stuck':{cs:'Co se děje? Můžu se na to po přestávce podívat.',de:'Woran liegt es? Ich kann nach der Pause mal schauen.'},
 'work-progress':{cs:'Tak to jsme na tom podobně. Hlavně ať nepřibude další naléhavý úkol.',de:'Dann geht es uns ähnlich. Hoffentlich kommt nichts Dringendes mehr dazu.'},
 'read-story':{cs:'Máme nové romány v zadní polici. Chcete se podívat?',de:'Wir haben neue Romane im hinteren Regal. Möchten Sie schauen?'},
 'read-learn':{cs:'Máme několik dobrých knih o historii i mezilidských vztazích.',de:'Wir haben gute Bücher über Geschichte und menschliche Beziehungen.'},
 'read-browse':{cs:'Samozřejmě, podívejte se. Kdybyste potřeboval poradit, jsem u pultu.',de:'Natürlich, schauen Sie sich um. Falls Sie Hilfe brauchen, bin ich am Schalter.'},
 'bank-account':{cs:'K účtu vám mohu vysvětlit dostupné služby.',de:'Ich kann Ihnen erklären, welche Kontodienste verfügbar sind.'},
 'bank-loan':{cs:'Záleží na vašich příjmech a splácení. Můžeme probrat podmínky.',de:'Das hängt von Einkommen und Rückzahlung ab. Wir können die Bedingungen besprechen.'},
 'bank-notnow':{cs:'Samozřejmě. Pokud budete něco potřebovat, ozvěte se.',de:'Natürlich. Falls Sie Fragen haben, melden Sie sich gern.'},
 'cafe-coffee':{cs:'Hned to bude. Přejete si mléko?',de:'Kommt sofort. Möchten Sie Milch dazu?'},
 'cafe-tea':{cs:'Jasně, máme černý a bylinkový. Který chcete?',de:'Gern, wir haben schwarzen Tee und Kräutertee. Welchen möchten Sie?'},
 'cafe-decide':{cs:'Jistě, dejte si čas. Až budete vědět, stačí říct.',de:'Natürlich, lassen Sie sich Zeit. Sagen Sie Bescheid, wenn Sie sich entschieden haben.'},
 'future-hope':{cs:'To bych si taky přál. Uvidíme, co přinesou další dny.',de:'Das wünsche ich mir auch. Mal sehen, was die nächsten Tage bringen.'},
 'future-uncertain':{cs:'Tak to jsme dva. Ještě chvíli tomu dejme.',de:'Dann sind wir schon zwei. Geben wir dem Ganzen etwas Zeit.'},
 'future-action':{cs:'Přesně. Jen je někdy těžké poznat, co změnit jako první.',de:'Genau. Manchmal ist nur schwer zu erkennen, was man zuerst ändern sollte.'},
 'generic-yes':{cs:'Klidně. Každý to má trochu jinak. Co tě na tom zaujalo?',de:'Gerne. Jeder sieht das etwas anders. Was interessiert dich daran?'},
 'generic-unsure':{cs:'To chápu. Někdy není kam spěchat.',de:'Das verstehe ich. Manchmal muss man nicht eilen.'},
 'generic-share':{cs:'Tak to máme něco společného. Jaká byla tvoje zkušenost?',de:'Dann haben wir etwas gemeinsam. Welche Erfahrung hast du gemacht?'}
 };
 return lines[prefix]??null;
}
