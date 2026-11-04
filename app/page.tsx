'use client';
import {useEffect,useState} from 'react';
import {initialTown,restoreTown,clock,dayLabel,placeNames,links,go,fastTravel,goRecommended,canGo,travelMinutes,startConversation,exitConversation,reply,doShift,canWork,buy,read,occupant,residents,type TownState,type Place,type Lang,type Answer} from '../lib/world';
import {phoneOpened,phoneClosed,bossInterruption} from '../lib/life';
import {DailyLife} from './DailyLife';
import {SocialActivities} from './SocialUI';
import {seasonFor,collectReplies} from '../lib/social';
import {weatherAt} from '../lib/weather';
import {eventsForDay,eat,rest} from '../lib/life';
import {nextSuggestion} from '../lib/guide';
import {lifeSatisfaction,happinessLabel} from '../lib/happiness';
import {ArtTown,StreetView,landmarks,glyph} from './TownArt';
import {Interaction,Quizzes,Missions,Phone} from './Interaction';
import './world.css';
import './panels.css';
const VERSION='v0.8.1-dev',SAVE='living-town-v0.5';
type Panel='town'|'dialogue'|'phone'|'missions'|'quiz'|'people';
const ui={
 cs:{town:'Město',people:'Vztahy',quiz:'Výzvy',missions:'Cíle',phone:'Deník',map:'Mapa městečka',view:'Pohled hráče',dialogue:'Interakce s postavou',phoneTitle:'Telefon – centrum společenského života',season:'Roční období – město se mění',events:'Události ve městě',spring:'Jaro',summer:'Léto',autumn:'Podzim',winter:'Zima',weather:'Polojasno',wallet:'Peněženka',mindset:'Mindset',here:'Právě jsi zde',near:'Lidé poblíž',none:'Teď tu nikoho nevidíš. Zkus přijít v jinou hodinu.',meet:'Oslovit',go:'Jít',back:'Ven / zpět na ulici',home:'Domov',sleep:'Přespat do dalšího dne',shift:'Odpracovat směnu 08:00–16:30 (oběd hrazen)',buy:'Koupit preclík (2,50 €)',book:'Přečíst krátký text',web:'Přečíst užitečný článek',bookTitle:'Proč naslouchat?',bookText:'Když ti někdo něco vypráví, zkus nejdřív pochopit, co skutečně říká. Shrň vlastními slovy jeho zkušenost a zeptej se, zda chce radu. Respektování hranic druhého člověka není prohra. Vztahy vznikají z důvěry, nikoliv z přesvědčování.',webTitle:'Jak rozpoznat důvěryhodnou informaci',webText:'Ověř si autora, datum a původ důležitých tvrzení. Hledej nezávislé potvrzení. Rozlišuj fakta a názory. Silně emotivní titulek není sám o sobě důkaz pravdivosti.',finish:'Dočetl jsem a rozumím',done:'Dnes už jsi tento text četl.',recommended:'Doporučená místa',fog:'Neznámá místa zůstávají zahalená mlhou.',residents:'Obyvatelé města',known:'Poznaní lidé',unknown:'Neznámý člověk',unknownColleague:'Neznámý kolega',mood:'Každý obyvatel má vlastní práci, směny, dovolené i momentální náladu.',noContact:'Vyber osobu z okolí a oslov ji.',event1:'Sportovní turnaj',event2:'Městská slavnost',event3:'Narozeniny',event4:'Farmářský trh',phone1:'Zprávy',phone2:'Kontakty',phone3:'Pozvánky',phone4:'Sociální kruh',reset:'Začít znovu',resetConfirm:'Opravdu chceš smazat místní herní postup?',notWorking:'Dnes není naplánovaná směna nebo už jsi ji odpracoval.',fired:'Zaměstnavatel tě propustil.',local:'Místní herní simulace. Skutečné AI dialogy vyžadují serverový klíč; sdílený multiplayer ještě neběží.',game:'Živé městečko',where:'Kudy dál?',available:'V okolí',reading:'Čtení',learn:'Kvíz a hádanky',schedule:'Další lidé se mohou objevit později.',head:'Živé město, které si pamatuje své příběhy.'},
 de:{town:'Stadt',people:'Beziehungen',quiz:'Aufgaben',missions:'Ziele',phone:'Tagebuch',map:'Stadtkarte',view:'Spielerperspektive',dialogue:'Gespräch mit einer Person',phoneTitle:'Handy – Zentrum des sozialen Lebens',season:'Jahreszeiten – die Stadt verändert sich',events:'Veranstaltungen in der Stadt',spring:'Frühling',summer:'Sommer',autumn:'Herbst',winter:'Winter',weather:'Leicht bewölkt',wallet:'Geldbörse',mindset:'Mindset',here:'Du bist hier',near:'Menschen in der Nähe',none:'Gerade ist niemand hier. Versuche es später.',meet:'Ansprechen',go:'Gehen',back:'Nach draußen / zurück zur Straße',home:'Zuhause',sleep:'Bis morgen schlafen',shift:'Schicht 08:00–16:30 (Mittagessen wird abgezogen)',buy:'Brezel kaufen (2,50 €)',book:'Kurzen Text lesen',web:'Informativen Artikel lesen',bookTitle:'Warum Zuhören wichtig ist',bookText:'Wenn dir jemand etwas erzählt, versuche zunächst zu verstehen, was wirklich gemeint ist. Fasse das Gehörte in eigenen Worten zusammen und frage, ob Rat erwünscht ist. Die Grenzen anderer zu achten ist keine Niederlage. Beziehungen entstehen durch Vertrauen und nicht durch Überredung.',webTitle:'Verlässliche Informationen erkennen',webText:'Prüfe Autor, Datum und Ursprung einer wichtigen Aussage. Suche nach unabhängiger Bestätigung. Unterscheide Fakten von Meinungen. Eine emotional formulierte Überschrift ist allein noch kein Beweis.',finish:'Gelesen und verstanden',done:'Diesen Text hast du heute schon gelesen.',recommended:'Empfohlene Orte',fog:'Unbekannte Orte bleiben im Nebel verborgen.',residents:'Stadtbewohner',known:'Bekannte Personen',unknown:'Unbekannte Person',unknownColleague:'Unbekannter Kollege',mood:'Jeder Bewohner hat Arbeit, Schichten, Urlaub und eine eigene Tagesstimmung.',noContact:'Wähle jemanden aus deiner Nähe und sprich die Person an.',event1:'Sportturnier',event2:'Stadtfest',event3:'Geburtstag',event4:'Bauernmarkt',phone1:'Nachrichten',phone2:'Kontakte',phone3:'Einladungen',phone4:'Sozialer Kreis',reset:'Neu beginnen',resetConfirm:'Lokalen Spielfortschritt wirklich löschen?',notWorking:'Heute steht keine Schicht an oder du hast sie schon gearbeitet.',fired:'Dein Arbeitgeber hat dich entlassen.',local:'Lokale Spielsimulation. Echte KI-Dialoge benötigen einen Server-Schlüssel; Multiplayer ist noch nicht aktiv.',game:'Lebendige Kleinstadt',where:'Wohin als Nächstes?',available:'In der Nähe',reading:'Lektüre',learn:'Quiz und Rätsel',schedule:'Andere Menschen können später auftauchen.',head:'Eine lebendige Stadt, die sich an ihre Geschichten erinnert.'}
};
const seasonNames=['spring','summer','autumn','winter'] as const;
const eventSymbols=['⚽','🎆','🎂','🧺'];
export default function Page(){
 const [state,setState]=useState<TownState>(initialTown);
 const [lang,setLang]=useState<Lang>('cs');
 const [panel,setPanel]=useState<Panel>('town');
 const season=seasonFor(state.day);
 const [reading,setReading]=useState<'book'|'web'|null>(null);
 const [ready,setReady]=useState(false);
 const [seasonNotice,setSeasonNotice]=useState<number|null>(null);
 const [busy,setBusy]=useState(false);
 const [homeFocus,setHomeFocus]=useState<'room'|'tv'|'phone'>('room');
 const [walletOpen,setWalletOpen]=useState(false);
 const [happinessOpen,setHappinessOpen]=useState(false);
 const [draftAge,setDraftAge]=useState(25);
 useEffect(()=>{try{const old=localStorage.getItem(SAVE);if(old)setState(restoreTown(JSON.parse(old)));const locale=localStorage.getItem('living-town-lang');if(locale==='cs'||locale==='de')setLang(locale);}catch{}setReady(true);},[]);
 useEffect(()=>{if(ready){localStorage.setItem(SAVE,JSON.stringify(state));localStorage.setItem('living-town-lang',lang);}},[ready,state,lang]);
 useEffect(()=>{if(ready&&state.day>0&&state.day%14===0&&state.social.seasonAnnounced===seasonFor(state.day)){setSeasonNotice(state.day);}},[state.day,ready]);
 const t=ui[lang],present=occupant(state),ways=links[state.place].filter(p=>canGo(state,p));
 const currentWeather=weatherAt(state.day),guide=nextSuggestion(state),todayEvents=eventsForDay(state.day);
 const happiness=lifeSatisfaction(state);
 useEffect(()=>{if(panel!=='phone'||state.place!=='work')return;const interval=window.setInterval(()=>setState(s=>bossInterruption(s,lang)),15000);return ()=>window.clearInterval(interval)},[panel,state.place,lang]);
 function changePanel(p:Panel){setPanel(p);setState(s=>p==='phone'&&s.place==='work'?phoneOpened(s):s.life.phoneOpenedAt!==null?phoneClosed(s):s);}
 function navigate(to:Place){setState(s=>go(s,to));setPanel('town');setReading(null);setHomeFocus('room');}
 function jump(to:Place){setState(s=>goRecommended(s,to));setPanel('town');setReading(null);setHomeFocus('room');}
 function jumpAnywhere(to:Place){setState(s=>fastTravel(s,to));setPanel('town');setReading(null);setHomeFocus('room');}
 function approach(id:string){setState(s=>startConversation(s,id));setPanel('dialogue');}
 function farewell(){setState(s=>exitConversation(s));setPanel('town');}
 async function send(input:string,choice?:Answer){
  const id=state.selectedNpc;if(!id||busy||!input.trim())return;
  setBusy(true);let generated:undefined|{cs:string;de:string};
  try{const response=await fetch('/api/dialogue',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,lang,text:input,topic:choice?.topic,day:state.day,minute:state.minute,history:state.conversations[id]?.turns.slice(-10)??[]})});if(response.ok){const data=await response.json();if(typeof data.cs==='string'&&typeof data.de==='string')generated={cs:data.cs,de:data.de};}}catch{}
  setState(s=>reply(s,input,lang,choice,generated));setBusy(false);
 }
 function reset(){if(confirm(t.resetConfirm)){setState(initialTown());setPanel('town');setReading(null);setHomeFocus('room');}}
 const level=1+Number(['meet','buy','work'].every(x=>state.completed.includes(x)))+Number(['meet','buy','work','read','quiz','discover'].every(x=>state.completed.includes(x)));
 return <main className="world-page">
  <header className="world-header"><div className="wordmark"><span>✥</span><div><strong>Living Town</strong><small>{t.game} · {VERSION}</small></div></div><nav className="world-topnav">{([['town',t.town],['people',t.people],['missions',t.missions],['phone',t.phone]] as [Panel,string][]).map(([p,label])=><button key={p} onClick={()=>changePanel(p)} className={panel===p?'active':''}>{label}</button>)}</nav><div className="top-stats"><span>{currentWeather.symbol} {currentWeather.temperature} °C</span><button className="gold-stat wallet-toggle" onClick={()=>setWalletOpen(x=>!x)} aria-expanded={walletOpen} aria-label={lang==='cs'?'Otevřít pohyby na účtu':'Geldbewegungen anzeigen'}>◉ {state.wallet.toFixed(2)} € ▾</button><span className="mind-stat">✦ {t.mindset} {state.mindset}</span><button className="happiness-toggle" onClick={()=>setHappinessOpen(v=>!v)} aria-expanded={happinessOpen}>💛 {happiness.score}/98</button><span>⚡ {Math.round(state.life.energy)}%</span><span>🍽 {Math.round(state.life.hunger)}%</span><span>Lv. {level}</span><div className="lang-choice"><button className={lang==='cs'?'active':''} onClick={()=>setLang('cs')}>CZ</button><button className={lang==='de'?'active':''} onClick={()=>setLang('de')}>DE</button></div></div></header>
  {happinessOpen&&<section className="happiness-panel">
  <div className="happiness-head"><strong>💛 {lang==='cs'?'Životní spokojenost':'Lebenszufriedenheit'} · {happiness.score}/98</strong><button onClick={()=>setHappinessOpen(false)}>×</button></div>
  <p>{happinessLabel(happiness.score,lang)} · {lang==='cs'?'Experimentální model, který společně doladíme.':'Experimentelles Modell, das wir gemeinsam verfeinern.'}</p>
  {happiness.factors.map(f=><div className="happiness-factor" key={f.id}><span>{f[lang]}</span><meter min={0} max={100} value={f.value}/><small>{Math.round(f.value)} %</small></div>)}
  <small>{lang==='cs'?'Peníze mají klesající přínos. Vyšší znalosti mohou zvýšit očekávání, ne automaticky snížit štěstí. Dokonalých 100 bodů záměrně neexistuje.':'Geld wirkt mit abnehmendem Nutzen. Mehr Wissen kann Erwartungen erhöhen, senkt aber nicht automatisch das Glück. Perfekte 100 Punkte gibt es bewusst nicht.'}</small>
  </section>}
  {walletOpen&&<section className="wallet-ledger"><div className="ledger-header"><strong>◉ {t.wallet}</strong><button onClick={()=>setWalletOpen(false)}>×</button></div><strong className="ledger-balance">{state.wallet.toFixed(2)} €</strong><div className="ledger-lines">{state.walletHistory.slice(1).map((balance,i)=>{const previous=state.walletHistory[i]??balance;const delta=Math.round((balance-previous)*100)/100;return <div className="ledger-line" key={i}><span>{lang==='cs'?(delta>=0?'Příjem':'Výdaj'):(delta>=0?'Einnahme':'Ausgabe')} #{i+1}</span><b className={delta>=0?'ledger-plus':'ledger-minus'}>{delta>0?'+':''}{delta.toFixed(2)} €</b></div>}).reverse()}</div></section>}
  <nav className="route-bar"><strong>⌖ {t.here}: {glyph[state.place]} {placeNames[state.place][lang]} <small>· {dayLabel(state.day,lang)} {clock(state.minute)}</small></strong><div>{ways.map(p=><button key={p} onClick={()=>navigate(p)}>{glyph[p]} {placeNames[p][lang]} {p!==state.place&&<small>· {travelMinutes(state.place,p,state.day)} min</small>}</button>)}{state.place!=='street'&&<button onClick={()=>navigate('street')}>↩ {t.back}</button>}</div></nav>
  {guide&&<div className="life-guide"><span>✦ {guide[lang]}</span><button onClick={()=>{if(guide.action==='travel'&&guide.destination)jumpAnywhere(guide.destination);else if(guide.action==='eat')setState(x=>eat(x));else if(guide.action==='sleep')setState(x=>rest(x));else if(guide.action==='shift')setState(x=>doShift(x));}}>{lang==='cs'?guide.actionCs:guide.actionDe} ↗</button></div>}
  <div className="world-columns">
   <section className="map-column">
    <div className="town-card"><ArtTown season={season}/><div className="fog-layer fog-a"/><div className="fog-layer fog-b"/><div className="map-badge"><h2>{t.map}</h2><small>{['🌷','☀️','🍂','❄️'][season]} {t[seasonNames[season]]}</small></div><div className="compass">N<br/>✦</div>
    {landmarks.map(point=>{const known=state.discovered.includes(point.place),reachable=canGo(state,point.place);return <button key={point.place} className={'place-pin '+(!known?'hidden-place':'')+(state.place===point.place?' current':'')} style={{left:point.x+'%',top:point.y+'%'}} onClick={()=>{if(known)jumpAnywhere(point.place)}} title={known?placeNames[point.place][lang]+(state.place===point.place?'':' · '+travelMinutes(state.place,point.place,state.day)+' min'):t.fog}><span>{known?glyph[point.place]:'?'}</span>{known&&<b>{placeNames[point.place][lang]}</b>}{state.recommended.includes(point.place)&&<em>★</em>}</button>})}
    </div>
    {seasonNotice===state.day&&<div className="season-notice" onClick={()=>setSeasonNotice(null)} role="status">{['🌷','☀️','🍂','❄️'][season]} {t[seasonNames[season]]} <button onClick={()=>setSeasonNotice(null)}>×</button></div>}
    <div className="map-bottom compact-events"><section className="events-box"><h3>☆ {t.events}</h3><div className="event-list">{todayEvents.length?todayEvents.slice(0,4).map(ev=><button key={ev.id} onClick={()=>changePanel('phone')}><span>{ev.emoji}</span><b>{ev[lang]}</b></button>):<button onClick={()=>changePanel('phone')}><span>📅</span><b>{lang==='cs'?'Dnes bez událostí':'Heute keine Termine'}</b></button>}</div></section></div>
   </section>
   <aside className="world-side">
    <section className="view-card"><h2>✥ {t.view}</h2><StreetView place={state.place} lang={lang} season={season} hour={Math.floor(state.minute/60)} homeFocus={state.place==='home'?homeFocus:'room'}/>{state.place==='home'&&homeFocus!=='room'&&<button className="camera-return" onClick={()=>setHomeFocus('room')}>{lang==='cs'?'↩ Zpět do pokoje':'↩ Zurück ins Zimmer'}</button>}<div className="local-people"><strong>{t.near} ({present.length})</strong><div>{present.length?present.slice(0,6).map(p=><button key={p.id} onClick={()=>approach(p.id)}><span>{p.portrait}</span><small>{state.known.includes(p.id)?p.name:(state.place==='work'?t.unknownColleague:t.unknown)}</small></button>):<p>{t.none}</p>}</div></div></section>
    <section className="activity-card"><h2>✥ {panel==='town'?t.dialogue:panel==='dialogue'?t.dialogue:panel==='quiz'?t.learn:panel==='missions'?t.missions:panel==='people'?t.residents:t.phoneTitle}</h2>
    {panel==='dialogue'?<Interaction state={state} lang={lang} onApproach={approach} onExit={farewell} onSend={send} busy={busy}/>:
     panel==='quiz'?<Quizzes state={state} lang={lang} onState={setState}/>:
     panel==='missions'?<Missions state={state} lang={lang}/>:
     panel==='phone'?<Phone state={state} lang={lang} onState={setState} onAttend={next=>{setState(next);setPanel('town')}}/>:
     panel==='people'?<div className="residents-box"><p>{residents.length} {t.residents} · {state.known.length} {t.known}</p><div className="people-wall">{residents.map(p=><button key={p.id} disabled={!present.some(x=>x.id===p.id)} onClick={()=>approach(p.id)}><span>{state.known.includes(p.id)?p.portrait:'◌'}</span><small>{state.known.includes(p.id)?p.name:'?'}</small></button>)}</div></div>:
     <div className="local-actions"><h3>{placeNames[state.place][lang]}</h3>{present.map(p=><button className="action-row" key={p.id} onClick={()=>approach(p.id)}>💬 {state.known.includes(p.id)?p.name:(state.place==='work'?t.unknownColleague:t.meet+' · ?')} <span>↗</span></button>)}
     {state.place==='work'&&<button className="action-row" disabled={!canWork(state)||Math.max(state.minute,8*60)>15*60+30} onClick={()=>setState(s=>doShift(s))}>💼 {t.shift}</button>}
{state.place==='work'&&state.life.lastBossEvent===state.day&&<div className="feedback">{state.journal[lang].slice(-1)[0]}</div>}
     {state.place==='bakery'&&<button className="action-row" disabled={state.wallet<2.5} onClick={()=>setState(s=>buy(s))}>🥨 {t.buy}</button>}
     {state.place==='library'&&<button className="action-row" onClick={()=>setReading('web')}>🌐 {t.web}</button>}
     {state.place==='home'&&!state.ageConfirmed&&<div className="age-setup"><strong>{lang==='cs'?'🧑 Nastavení věku postavy':'🧑 Alter der Spielfigur'}</strong><p>{lang==='cs'?'Věk určuje typy rozhovorů a vztahů. Pod 18 let nejsou dostupné dospělé romantické scénáře.':'Das Alter beeinflusst Gespräche und Beziehungen. Unter 18 gibt es keine romantischen Erwachsenenszenarien.'}</p><label>{lang==='cs'?'Věk':'Alter'} <input type="number" min={10} max={90} value={draftAge} onChange={e=>setDraftAge(Number(e.target.value))}/></label><button disabled={draftAge<10||draftAge>90||!Number.isInteger(draftAge)} onClick={()=>setState(x=>({...x,playerAge:draftAge,ageConfirmed:true}))}>{lang==='cs'?'Potvrdit věk':'Alter bestätigen'}</button></div>}
     <DailyLife state={state} lang={lang} onState={setState} onFocus={setHomeFocus}/><SocialActivities state={state} lang={lang} onState={setState}/>
{state.recommended.length>0&&<section className="recommended-shortcuts">{state.recommended.map(r=><button key={r} onClick={()=>jump(r)}>★ {placeNames[r][lang]} ↗</button>)}</section>}
     {reading&&<div className="reading-card"><h4>{reading==='book'?t.bookTitle:t.webTitle}</h4><p>{reading==='book'?t.bookText:t.webText}</p><button disabled={(reading==='book'?state.lastRead:state.lastResearch)===state.day} onClick={()=>{setState(s=>read(s,reading));setReading(null);}}>{t.finish} · +{reading==='book'?'3':'2'} {t.mindset}</button></div>}
     {state.place==='library'&&<button className="action-row" onClick={()=>changePanel('quiz')}>🧩 {t.learn} →</button>}</div>}
    </section>
    <section className="handy-card"><h2>✥ {t.phoneTitle}</h2><div className="phone-bg"><div className="handset"><div className="notch"/><div className="handset-clock">{clock(state.minute)} ·●●</div><button onClick={()=>changePanel('phone')}>💬 {t.phone1}</button><button onClick={()=>changePanel('phone')}>▦ {t.phone2}</button><button onClick={()=>changePanel('phone')}>♟ {t.phone3}</button><button onClick={()=>changePanel('phone')}>♡ {t.phone4}</button><button onClick={()=>changePanel('quiz')}>✦ {t.mindset} <b>{state.mindset}</b></button></div></div></section>
   </aside>
  </div>
  <footer className="world-footer"><small>{VERSION}</small><button onClick={reset}>{t.reset}</button></footer><button className="phone-shortcut" onClick={()=>changePanel('phone')}>▣</button>
 </main>;
}
