import type {TownState,Lang} from './world';
import {addTime} from './life';
import {v083,officeQuizzes} from './living083';
type Line={cs:string;de:string};
type Scene={kind:string;title:Line;story:Line;choices:Line[];minutes:number;best:number;result:Line[]};
const L=(cs:string,de:string):Line=>({cs,de});
const scene=(kind:string,cs:string,de:string,storyCs:string,storyDe:string,choices:Line[],minutes:number,best:number,result:Line[]):Scene=>({kind,title:L(cs,de),story:L(storyCs,storyDe),choices,minutes,best,result});
const incidents:Scene[]=[
 scene('incident','Záhadně zmizel důležitý soubor','Eine wichtige Datei fehlt','Pět minut před předáním chybí poslední verze projektu. Kolega se začíná potit.','Kurz vor der Abgabe fehlt eine Datei.',[L('Prohledám historii verzí.','Versionsverlauf prüfen.'),L('Obviním kolegu.','Kollegen beschuldigen.'),L('Oznámím riziko a požádám o pomoc.','Problem melden und Hilfe erbitten.')],60,0,[L('Našel jsi obnovitelnou verzi souboru.','Dateiversion wiederhergestellt.'),L('Kolega se ohradil. Problém trvá.','Der Kollege ist verärgert.'),L('Tým se pustil do společného řešení.','Das Team hilft zusammen.')]),
 scene('incident','Tiskárna vyhlásila stávku','Der Drucker streikt','Šéf nutně potřebuje podklady. Tiskárna hlásí „papír zaseknutý“, přestože v ní žádný papír není.','Der Drucker meldet einen Papierstau ohne Papier.',[L('Pošlu dokument elektronicky.','Dokument digital senden.'),L('Zkusím tiskárnu třikrát restartovat.','Dreimal neu starten.'),L('Řeknu šéfovi, že technika má vlastní odbory.','Der Chef bekommt einen Druckerwitz.')],45,0,[L('Dokument dorazil včas.','Das Dokument kam rechtzeitig.'),L('Tiskárna stále vzdoruje.','Der Drucker streikt weiterhin.'),L('Šéf se usmál, ale dokument stále chybí.','Der Chef lächelt, die Datei fehlt.')]),
 scene('incident','Neočekávaný telefonát klienta','Unerwarteter Kundenanruf','Klient chce výsledek dnes, ačkoli termín je až zítra.','Der Kunde fordert das Ergebnis früher.',[L('Domluvím reálný termín a rozsah.','Realistischen Termin vereinbaren.'),L('Slíbím všechno okamžitě.','Alles sofort versprechen.'),L('Hovor raději nepřijmu.','Anruf ignorieren.')],60,0,[L('Klient souhlasil s rozumným plánem.','Der Kunde akzeptiert den Plan.'),L('Přidal sis zbytečný tlak.','Du hast zusätzlichen Druck erzeugt.'),L('Klient volá šéfovi.','Der Kunde ruft den Chef an.')]),
 scene('incident','Nedorozumění v týmu','Missverständnis im Team','Dva kolegové si vykládají stejný e-mail úplně opačně.','Kollegen verstehen eine Mail völlig unterschiedlich.',[L('Požádám autora o vysvětlení.','Den Autor fragen.'),L('Přikloním se k hlasitějšímu.','Dem Lauteren zustimmen.'),L('Nechám je hádat se.','Den Streit laufen lassen.')],60,0,[L('Vyjasnili jste původní zadání.','Die Aufgabe ist geklärt.'),L('Tým teď pracuje různými směry.','Das Team ist uneins.'),L('Hádka zabrala celé dopoledne.','Die Diskussion kostet Zeit.')]),
 scene('incident','Náhlá kontrola vedení','Überraschungsbesuch der Leitung','Vedoucí chce právě teď vidět průběh projektu.','Die Leitung will einen spontanen Status.',[L('Ukážu výsledky i otevřená rizika.','Ergebnisse und Risiken zeigen.'),L('Budu předstírat, že je hotovo.','So tun, als wäre alles fertig.'),L('Pošlu ho za někým jiným.','An jemand anderen verweisen.')],75,0,[L('Vedoucí ocenil transparentnost.','Transparenz kommt gut an.'),L('Nesrovnalost rychle vyšla najevo.','Die Unstimmigkeit fällt auf.'),L('Kolega není nadšený.','Der Kollege ist nicht begeistert.')]),
 scene('incident','Kolegyně potřebuje pomoc','Kollegin braucht Hilfe','Kolegyně ztrácí přehled v úkolech a požádá tě o radu.','Eine Kollegin bittet um Rat.',[L('Pomohu jí stanovit priority.','Prioritäten gemeinsam klären.'),L('Převezmu za ni všechno.','Alles für sie erledigen.'),L('Řeknu, ať si poradí sama.','Sie soll es selbst lösen.')],60,0,[L('Zvládla se zorientovat a poděkovala.','Sie bedankt sich für die Hilfe.'),L('Tvůj vlastní úkol teď stojí.','Deine eigene Arbeit bleibt liegen.'),L('Kolegyně je zklamaná.','Die Kollegin ist enttäuscht.')]),
 scene('incident','Projektor během porady zhasl','Projektor fällt aus','Prezentace je připravená, ale obrazovka zůstává černá.','Die Präsentation ist bereit, aber der Beamer bleibt schwarz.',[L('Vysvětlím hlavní body bez prezentace.','Ohne Folien präsentieren.'),L('Počkám, až někdo přijde projektor opravit.','Auf Reparatur warten.'),L('Poradu bez vysvětlení zruším.','Meeting absagen.')],45,0,[L('Porada překvapivě odsýpala.','Das Meeting war erstaunlich effizient.'),L('Čekání se protáhlo.','Das Warten dauert.'),L('Kolegové neví, co dál.','Die Kollegen sind ratlos.')]),
 scene('incident','Příliš mnoho priorit','Zu viele Prioritäten','Přišly tři nové požadavky a každý je údajně neodkladný.','Drei neue Aufgaben sind angeblich dringend.',[L('Vyjasním s vedoucím skutečné pořadí.','Reihenfolge mit Chef klären.'),L('Začnu vše najednou.','Alles gleichzeitig anfangen.'),L('Zavřu e-mail a budu ignorovat nové úkoly.','Neue Aufgaben ignorieren.')],75,0,[L('Znáš pořadí a termíny.','Reihenfolge und Fristen sind klar.'),L('Rozpracoval jsi vše, nedokončil nic.','Viel begonnen, nichts beendet.'),L('Vedoucí čeká na odpověď.','Der Chef wartet.')])
];
const regular:Scene[]=[
 scene('arrival','Ranní nástup','Ankunft im Büro','V kanceláři to hučí. Šéf čeká na ranní výsledky a kolegové si připravují kávu.','Im Büro herrscht Betrieb.',[L('Pozdravím tým a zkontroluji úkoly.','Team begrüßen und Aufgaben prüfen.'),L('Nejdřív si dám kávu.','Erst einen Kaffee trinken.'),L('Rovnou začnu pracovat.','Direkt arbeiten.')],30,0,[L('Začal jsi připravený.','Du bist gut vorbereitet.'),L('Káva pomohla, úkoly počkají.','Der Kaffee wirkt.'),L('Pustil ses do práce.','Du beginnst sofort.')]),
 scene('meeting','Projektová porada','Projektbesprechung','Na poradě se řeší termín, rozpočet a rozdělení práce. Každý vidí jinou prioritu.','Es geht um Termine und Prioritäten.',[L('Nejdřív společně vyjasníme priority.','Prioritäten gemeinsam klären.'),L('Přislíbím rychlé dodání.','Schnelle Lieferung versprechen.'),L('Nechám rozhodnout ostatní.','Die anderen entscheiden lassen.')],90,0,[L('Tým ví, co dělat.','Das Team hat einen Plan.'),L('Vzniklo nereálné očekávání.','Die Erwartung ist unrealistisch.'),L('Porada skončila bez jasného závěru.','Das Ergebnis bleibt offen.')]),
 scene('chat','Krátký pokec','Kurzer Plausch','Kolega tě zastaví u kávovaru. Říká, že o víkendu bude grilování, a ptá se na tvé plány.','Ein Kollege spricht über das Wochenende.',[L('Zeptám se na podrobnosti grilování.','Nach dem Grillabend fragen.'),L('Popovídám si krátce o víkendu.','Kurz über das Wochenende sprechen.'),L('Dnes potřebuji soustředění.','Heute brauche ich Ruhe.')],30,0,[L('Dozvěděl ses víc o víkendovém setkání.','Du erfährst mehr über den Grillabend.'),L('Prohodili jste pár příjemných vět.','Ein nettes Gespräch.'),L('Kolega to respektuje.','Der Kollege respektiert es.')]),
 scene('lunch','Obědová přestávka','Mittagspause','Je poledne. Někteří kolegové míří na oběd, jiní zůstali u stolu.','Es ist Mittagspause.',[L('Najím se s kolegy (6,50 €).','Mit Kollegen essen (6,50 €).'),L('Dám si klidný oběd (6,50 €).','Ruhig essen (6,50 €).'),L('Oběd vynechám.','Mittagessen auslassen.')],45,0,[L('Při obědě padl dobrý nápad.','Beim Essen entsteht eine Idee.'),L('Trochu sis odpočinul.','Du hast dich erholt.'),L('Hlad se později připomene.','Der Hunger meldet sich.')]),
 scene('training','Psychologické školení','Psychologisches Training','Kolega tě veřejně obvinil z chyby, za kterou zodpovídal celý tým. Co uděláš?','Du wirst vor anderen für einen Teamfehler beschuldigt.',[L('Navrhnu vyjasnění faktů a rolí.','Fakten und Rollen klären.'),L('Okamžitě ho obviním zpět.','Sofort zurückbeschuldigen.'),L('Bez slova odejdu.','Wortlos gehen.')],60,0,[L('Školitel: „Klid a fakta pomáhají předejít eskalaci.“','Trainer: „Ruhe und Fakten können Konflikte entschärfen.“'),L('Školitel: „Protiútok konflikt často přiživí.“','Trainer: „Gegenangriffe verschärfen oft Konflikte.“'),L('Školitel: „Odstup může pomoci, problém ale nezmizí.“','Trainer: „Abstand hilft, löst aber nicht alles.“')]),
 scene('project','Dokončení projektu','Projektarbeit','Zbývá několik důležitých úkolů. Kolegyně upozornila na možnou chybu ve výpočtu.','Eine Kollegin entdeckt einen möglichen Rechenfehler.',[L('Zkontroluji výpočet před odevzdáním.','Vor Abgabe nachrechnen.'),L('Odevzdám to ihned.','Sofort abgeben.'),L('Odložím odevzdání bez vysvětlení.','Abgabe ohne Erklärung verschieben.')],90,0,[L('Chybu jsi opravil před předáním.','Fehler rechtzeitig korrigiert.'),L('Klient reklamoval nesrovnalost.','Der Kunde reklamiert.'),L('Tým neví, na čem je.','Das Team ist unsicher.')]),
 scene('wrap','Uzavření směny','Feierabend','Poslední úkol je dokončený. Šéf chce krátké shrnutí a pak můžeš domů.','Die Arbeit ist erledigt. Der Chef will ein Update.',[L('Předám výsledky a případná rizika.','Ergebnisse und Risiken übergeben.'),L('Řeknu jen, že je vše hotové.','Nur „fertig“ sagen.'),L('Odejdu bez rozloučení.','Ohne Übergabe gehen.')],75,0,[L('Šéf poděkoval za přehledné předání.','Der Chef bedankt sich.'),L('Šéf si vyžádal podrobnosti.','Der Chef fragt nach.'),L('Šéf postrádá závěrečné informace.','Der Chef vermisst Infos.')])
];
const plan=[regular[0],'quiz',regular[1],'incident',regular[2],regular[3],'incident',regular[4],regular[5],regular[6]] as const;
const hash=(value:string)=>{let n=2166136261;for(const c of value)n=Math.imul(n^c.charCodeAt(0),16777619);return n>>>0;};
const quizScene=(s:TownState):Scene=>{const q=officeQuizzes[hash('quiz'+s.day)%officeQuizzes.length];return scene('quiz','Ranní kvíz','Morgenquiz',q.cs,q.de,q.answers.map(x=>L(x,x)),45,q.correct,q.answers.map((_,i)=>L((i===q.correct?'Správně. ':'Tentokrát ne. ')+q.explanation,(i===q.correct?'Richtig. ':'Nicht ganz. ')+q.explanation)));};
export function officeScene089(s:TownState):Scene|null{
 if(s.place!=='work'||s.day%7<2||s.employment==='fired'||s.lastShift===s.day)return null;
 const step=s.office089?.day===s.day?s.office089.step:0;
 if(step<0||step>=plan.length||s.minute>1020)return null;
 const def=plan[step];if(def==='quiz')return quizScene(s);
 if(def==='incident')return incidents[hash('event'+s.day+':'+step+':'+s.workShifts)%incidents.length];
 return def;
}
export function officeProgress089(s:TownState){return s.office089?.day===s.day?s.office089.step:0;}
export function chooseOffice089(s:TownState,choice:number):TownState{
 const current=officeScene089(s);if(!current||choice<0||choice>=current.choices.length)return s;
 if(current.kind==='lunch'&&choice!==2&&s.wallet<6.5)return s;
 const old=officeProgress089(s),late=Math.max(0,s.minute-480),remaining=Math.max(0,990-s.minute);
 const minutes=Math.min(current.minutes,remaining);
 const after=addTime(s,minutes);
 const good=choice===current.best,previous=v083(after);
 const cost=current.kind==='lunch'&&choice!==2?6.5:0;
 const balance=Math.round((after.wallet-cost)*100)/100;
 let next:TownState={...after,wallet:balance,walletHistory:cost?[...after.walletHistory,balance]:after.walletHistory,
 stress:Math.max(0,Math.min(100,after.stress+(good?-1:2))),mindset:after.mindset+(good?2:0),
 life:current.kind==='lunch'&&choice!==2?{...after.life,hunger:Math.max(0,after.life.hunger-38),lastMeal:after.day*1440+after.minute}:after.life,
 office089:{day:after.day,step:old+1,last:current.result[choice]},
 v083:{...previous,officeStarted:s.day,reputation:Math.max(0,Math.min(100,previous.reputation+(good?2:-1))),last:current.result[choice]}};
 if(old+1===plan.length){
  const pay=Math.round(45*(1+s.careerRank*.22)*100)/100,total=Math.round((next.wallet+pay)*100)/100;
  next={...next,minute:Math.max(next.minute,990),place:'street',selectedNpc:null,wallet:total,
  walletHistory:[...next.walletHistory,total],lastShift:s.day,workShifts:s.workShifts+1,
  careerRank:s.workShifts+1>=15?2:s.workShifts+1>=6?1:s.careerRank,
  completed:[...new Set([...s.completed,'work'])],v083:{...next.v083!,officeStarted:-1,last:L('Pracovní den je za tebou. Vyšel jsi na ulici.','Feierabend! Du stehst auf der Straße.')}};
 }
 return next;
}
