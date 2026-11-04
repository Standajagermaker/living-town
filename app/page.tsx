'use client';
import {useEffect,useState} from 'react';
import {initialTown,restoreTown,clock,dayLabel,placeNames,links,go,canGo,startConversation,exitConversation,reply,doShift,buy,read,sleep,occupant,residents,moodOf,byId,type TownState,type Place,type Lang,type Answer} from '../lib/world';
import {ArtTown,StreetView,landmarks,glyph} from './TownArt';
import {Interaction,Quizzes,Missions,Phone} from './Interaction';
import './world.css';
const VERSION='v0.5.0',SAVE='living-town-v0.5';
type Panel='town'|'dialogue'|'phone'|'missions'|'quiz'|'people';
const ui={
 cs:{town:'Město',people:'Vztahy',quiz:'Výzvy',missions:'Cíle',phone:'Deník',map:'Mapa městečka',view:'Pohled hráče',dialogue:'Interakce s postavou',phoneTitle:'Telefon – centrum společenského života',season:'Roční období – město se mění',events:'Události ve městě',spring:'Jaro',summer:'Léto',autumn:'Podzim',winter:'Zima',weather:'Polojasno',wallet:'Peněženka',mindset:'Mindset',here:'Právě jsi zde',near:'Lidé poblíž',none:'Teď tu nikoho nevidíš. Zkus přijít v jinou hodinu.',meet:'Oslovit',go:'Jít',back:'Ven / zpět na ulici',home:'Domov',sleep:'Přespat do dalšího dne',shift:'Odpracovat směnu (+45 €)',buy:'Koupit preclík (2,50 €)',book:'Přečíst krátký text',web:'Přečíst užitečný článek',bookTitle:'Proč naslouchat?',bookText:'Když ti někdo něco vypráví, zkus nejdřív pochopit, co skutečně říká. Shrň vlastními slovy jeho zkušenost a zeptej se, zda chce radu. Respektování hranic druhého člověka není prohra. Vztahy vznikají z důvěry, nikoliv z přesvědčování.',webTitle:'Jak rozpoznat důvěryhodnou informaci',webText:'Ověř si autora, datum a původ důležitých tvrzení. Hledej nezávislé potvrzení. Rozlišuj fakta a názory. Silně emotivní titulek není sám o sobě důkaz pravdivosti.',finish:'Dočetl jsem a rozumím',done:'Dnes už jsi tento text četl.',recommended:'Doporučená místa',fog:'Neznámá místa zůstávají zahalená mlhou.',residents:'Obyvatelé města',known:'Poznaní lidé',unknown:'Neznámý člověk',mood:'Každý obyvatel má vlastní práci, směny, dovolené i momentální náladu.',noContact:'Vyber osobu z okolí a oslov ji.',event1:'Sportovní turnaj',event2:'Městská slavnost',event3:'Narozeniny',event4:'Farmářský trh',phone1:'Zprávy',phone2:'Kontakty',phone3:'Pozvánky',phone4:'Sociální kruh',reset:'Začít znovu',resetConfirm:'Opravdu chceš smazat místní herní postup?',notWorking:'Dnes není naplánovaná směna nebo už jsi ji odpracoval.',fired:'Zaměstnavatel tě propustil.',local:'Místní herní simulace. Skutečné AI dialogy vyžadují serverový klíč; sdílený multiplayer ještě neběží.',game:'Živé městečko',where:'Kudy dál?',available:'V okolí',reading:'Čtení',learn:'Kvíz a hádanky',schedule:'Další lidé se mohou objevit později.',head:'Živé město, které si pamatuje své příběhy.'},
 de:{town:'Stadt',people:'Beziehungen',quiz:'Aufgaben',missions:'Ziele',phone:'Tagebuch',map:'Stadtkarte',view:'Spielerperspektive',dialogue:'Gespräch mit einer Person',phoneTitle:'Handy – Zentrum des sozialen Lebens',season:'Jahreszeiten – die Stadt verändert sich',events:'Veranstaltungen in der Stadt',spring:'Frühling',summer:'Sommer',autumn:'Herbst',winter:'Winter',weather:'Leicht bewölkt',wallet:'Geldbörse',mindset:'Mindset',here:'Du bist hier',near:'Menschen in der Nähe',none:'Gerade ist niemand hier. Versuche es später.',meet:'Ansprechen',go:'Gehen',back:'Nach draußen / zurück zur Straße',home:'Zuhause',sleep:'Bis morgen schlafen',shift:'Schicht arbeiten (+45 €)',buy:'Brezel kaufen (2,50 €)',book:'Kurzen Text lesen',web:'Informativen Artikel lesen',bookTitle:'Warum Zuhören wichtig ist',bookText:'Wenn dir jemand etwas erzählt, versuche zunächst zu verstehen, was wirklich gemeint ist. Fasse das Gehörte in eigenen Worten zusammen und frage, ob Rat erwünscht ist. Die Grenzen anderer zu achten ist keine Niederlage. Beziehungen entstehen durch Vertrauen und nicht durch Überredung.',webTitle:'Verlässliche Informationen erkennen',webText:'Prüfe Autor, Datum und Ursprung einer wichtigen Aussage. Suche nach unabhängiger Bestätigung. Unterscheide Fakten von Meinungen. Eine emotional formulierte Überschrift ist allein noch kein Beweis.',finish:'Gelesen und verstanden',done:'Diesen Text hast du heute schon gelesen.',recommended:'Empfohlene Orte',fog:'Unbekannte Orte bleiben im Nebel verborgen.',residents:'Stadtbewohner',known:'Bekannte Personen',unknown:'Unbekannte Person',mood:'Jeder Bewohner hat Arbeit, Schichten, Urlaub und eine eigene Tagesstimmung.',noContact:'Wähle jemanden aus deiner Nähe und sprich die Person an.',event1:'Sportturnier',event2:'Stadtfest',event3:'Geburtstag',event4:'Bauernmarkt',phone1:'Nachrichten',phone2:'Kontakte',phone3:'Einladungen',phone4:'Sozialer Kreis',reset:'Neu beginnen',resetConfirm:'Lokalen Spielfortschritt wirklich löschen?',notWorking:'Heute steht keine Schicht an oder du hast sie schon gearbeitet.',fired:'Dein Arbeitgeber hat dich entlassen.',local:'Lokale Spielsimulation. Echte KI-Dialoge benötigen einen Server-Schlüssel; Multiplayer ist noch nicht aktiv.',game:'Lebendige Kleinstadt',where:'Wohin als Nächstes?',available:'In der Nähe',reading:'Lektüre',learn:'Quiz und Rätsel',schedule:'Andere Menschen können später auftauchen.',head:'Eine lebendige Stadt, die sich an ihre Geschichten erinnert.'}
};
const seasonNames=['spring','summer','autumn','winter'] as const;
const eventSymbols=['⚽','🎆','🎂','🧺'];
export default function Page(){
 const [state,setState]=useState<TownState>(initialTown);
 const [lang,setLang]=useState<Lang>('cs');
 const [panel,setPanel]=useState<Panel>('town');
 const [season,setSeason]=useState(0);
 const [reading,setReading]=useState<'book'|'web'|null>(null);
 const [ready,setReady]=useState(false);
 const [busy,setBusy]=useState(false);
 useEffect(()=>{try{const old=localStorage.getItem(SAVE);if(old)setState(restoreTown(JSON.parse(old)));const locale=localStorage.getItem('living-town-lang');if(locale==='cs'||locale==='de')setLang(locale);}catch{}setReady(true);},[]);
 useEffect(()=>{if(ready){localStorage.setItem(SAVE,JSON.stringify(state));localStorage.setItem('living-town-lang',lang);}},[ready,state,lang]);
 const t=ui[lang],present=occupant(state),ways=links[state.place].filter(p=>canGo(state,p));
 function navigate(to:Place){setState(s=>go(s,to));setPanel('town');setReading(null);}
 function approach(id:string){setState(s=>startConversation(s,id));setPanel('dialogue');}
 function farewell(){setState(s=>exitConversation(s));setPanel('town');}
 async function send(input:string,choice?:Answer){
  const id=state.selectedNpc;if(!id||busy||!input.trim())return;
  setBusy(true);let generated:undefined|string;
  try{const response=await fetch('/api/dialogue',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,lang,text:input,topic:choice?.topic,day:state.day,minute:state.minute,history:state.conversations[id]?.turns.slice(-10)??[]})});if(response.ok){const data=await response.json();if(typeof data.text==='string')generated=data.text;}}catch{}
  setState(s=>reply(s,input,lang,choice,generated));setBusy(false);
 }
 function reset(){if(confirm(t.resetConfirm)){setState(initialTown());setPanel('town');setReading(null);setSeason(0);}}
 const level=1+Math.floor(state.mindset/40);
 return <main className="world-page">
  <header className="world-header"><div className="wordmark"><span>✥</span><div><strong>Sonnenthal</strong><small>{t.game} · {VERSION}</small></div></div><nav className="world-topnav">{([['town',t.town],['people',t.people],['quiz',t.quiz],['missions',t.missions],['phone',t.phone]] as [Panel,string][]).map(([p,label])=><button key={p} onClick={()=>setPanel(p)} className={panel===p?'active':''}>{label}</button>)}</nav><div className="top-stats"><span>⛅ 17 °C</span><span className="gold-stat">◉ {state.wallet.toFixed(2)} €</span><span className="mind-stat">✦ {t.mindset} {state.mindset}</span><span>Lv. {level}</span><div className="lang-choice"><button className={lang==='cs'?'active':''} onClick={()=>setLang('cs')}>CZ</button><button className={lang==='de'?'active':''} onClick={()=>setLang('de')}>DE</button></div></div></header>
  <nav className="route-bar"><strong>⌖ {t.here}: {glyph[state.place]} {placeNames[state.place][lang]} <small>· {dayLabel(state.day,lang)} {clock(state.minute)}</small></strong><div>{ways.map(p=><button key={p} onClick={()=>navigate(p)}>{glyph[p]} {placeNames[p][lang]}</button>)}{state.place!=='street'&&<button onClick={()=>navigate('street')}>↩ {t.back}</button>}</div></nav>
  <div className="world-columns">
   <section className="map-column">
    <div className="town-card"><ArtTown season={season}/><div className="fog-layer fog-a"/><div className="fog-layer fog-b"/><div className="map-badge"><h2>{t.map}</h2><p>{t.fog}</p></div><div className="compass">N<br/>✦</div>
    {landmarks.map(point=>{const known=state.discovered.includes(point.place),reachable=canGo(state,point.place);return <button key={point.place} className={'place-pin '+(!known?'hidden-place':'')+(state.place===point.place?' current':'')} style={{left:point.x+'%',top:point.y+'%'}} onClick={()=>{if(reachable)navigate(point.place)}} title={known?placeNames[point.place][lang]:t.fog}><span>{known?glyph[point.place]:'?'}</span>{known&&<b>{placeNames[point.place][lang]}</b>}{state.recommended.includes(point.place)&&<em>★</em>}</button>})}
    </div>
    <div className="map-bottom"><section className="seasons-box"><h3>❀ {t.season}</h3><div className="season-list">{seasonNames.map((name,i)=><button key={name} onClick={()=>setSeason(i)} className={'season-card season-'+i+(season===i?' active':'')}><span>{['🌷','☀️','🍂','❄️'][i]}</span><b>{t[name]}</b></button>)}</div></section><section className="events-box"><h3>☆ {t.events}</h3><div className="event-list">{eventSymbols.map((e,i)=><button key={i} onClick={()=>setPanel(i===0?'people':i===1?'missions':'phone')}><span>{e}</span><b>{t[('event'+(i+1)) as 'event1'|'event2'|'event3'|'event4']}</b></button>)}</div></section></div>
   </section>
   <aside className="world-side">
    <section className="view-card"><h2>✥ {t.view}</h2><StreetView place={state.place} lang={lang} season={season}/><div className="local-people"><strong>{t.near} ({present.length})</strong><div>{present.length?present.slice(0,6).map(p=><button key={p.id} onClick={()=>approach(p.id)}><span>{p.portrait}</span><small>{state.known.includes(p.id)?p.name:t.unknown}</small></button>):<p>{t.none}</p>}</div></div></section>
    <section className="activity-card"><h2>✥ {panel==='town'?t.dialogue:panel==='dialogue'?t.dialogue:panel==='quiz'?t.learn:panel==='missions'?t.missions:panel==='people'?t.residents:t.phoneTitle}</h2>
    {panel==='dialogue'?<Interaction state={state} lang={lang} onApproach={approach} onExit={farewell} onSend={send} busy={busy}/>:
     panel==='quiz'?<Quizzes state={state} lang={lang} onState={setState}/>:
     panel==='missions'?<Missions state={state} lang={lang}/>:
     panel==='phone'?<Phone state={state} lang={lang}/>:
     panel==='people'?<div className="residents-box"><p>{t.mood}</p><p>{residents.length} {t.residents} · {state.known.length} {t.known}</p><div className="people-wall">{residents.map(p=><button key={p.id} disabled={!present.some(x=>x.id===p.id)} onClick={()=>approach(p.id)}><span>{state.known.includes(p.id)?p.portrait:'◌'}</span><small>{state.known.includes(p.id)?p.name:'?'}</small></button>)}</div></div>:
     <div className="local-actions"><p>{t.mood}</p><h3>{placeNames[state.place][lang]}</h3>{present.map(p=><button className="action-row" key={p.id} onClick={()=>approach(p.id)}>💬 {state.known.includes(p.id)?p.name:t.meet+' · ?'} <span>↗</span></button>)}
     {state.place==='work'&&<button className="action-row" disabled={state.employment==='fired'||state.day%7<2||state.lastShift===state.day} onClick={()=>setState(s=>doShift(s))}>💼 {t.shift}</button>}
     {state.place==='bakery'&&<button className="action-row" disabled={state.wallet<2.5} onClick={()=>setState(s=>buy(s))}>🥨 {t.buy}</button>}
     {state.place==='library'&&<><button className="action-row" onClick={()=>setReading('book')}>📖 {t.book}</button><button className="action-row" onClick={()=>setReading('web')}>🌐 {t.web}</button></>}
     {state.place==='home'&&<button className="action-row" onClick={()=>setState(s=>sleep(s))}>🌙 {t.sleep}</button>}
     {reading&&<div className="reading-card"><h4>{reading==='book'?t.bookTitle:t.webTitle}</h4><p>{reading==='book'?t.bookText:t.webText}</p><button disabled={(reading==='book'?state.lastRead:state.lastResearch)===state.day} onClick={()=>{setState(s=>read(s,reading));setReading(null);}}>{t.finish} · +{reading==='book'?'3':'2'} {t.mindset}</button></div>}
     <button className="action-row" onClick={()=>setPanel('quiz')}>🧩 {t.learn} →</button><p className="small-note">{t.schedule}</p></div>}
    </section>
    <section className="handy-card"><h2>✥ {t.phoneTitle}</h2><div className="phone-bg"><div className="handset"><div className="notch"/><div className="handset-clock">{clock(state.minute)} ·●●</div><button onClick={()=>setPanel('phone')}>💬 {t.phone1}</button><button onClick={()=>setPanel('phone')}>▦ {t.phone2}</button><button onClick={()=>setPanel('phone')}>♟ {t.phone3}</button><button onClick={()=>setPanel('phone')}>♡ {t.phone4}</button><button onClick={()=>setPanel('quiz')}>✦ {t.mindset} <b>{state.mindset}</b></button></div></div></section>
   </aside>
  </div>
  <footer className="world-footer"><small>{t.local} · {VERSION}</small><button onClick={reset}>{t.reset}</button></footer><button className="phone-shortcut" onClick={()=>setPanel('phone')}>▣</button>
 </main>;
}
