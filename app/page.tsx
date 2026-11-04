'use client';
import { useEffect, useState } from 'react';
import { choicesFor, initialState, interact, timeLabel, type GameState, type Place } from '../lib/game';
const SAVE='living-town-pilot-v1';
const titles:Record<Place,string>={home:'Tvůj nový domov',street:'Ulice před domem',bakery:'Pekárna',square:'Náměstí'};
export default function Page(){
 const [game,setGame]=useState<GameState>(initialState);
 const [ready,setReady]=useState(false);
 const [tab,setTab]=useState<'world'|'dialogue'|'phone'|'map'>('world');
 const [draft,setDraft]=useState('');
 const [phoneTab,setPhoneTab]=useState<'messages'|'contacts'|'diary'>('messages');
 const [toast,setToast]=useState('');
 useEffect(()=>{try{const raw=localStorage.getItem(SAVE);if(raw)setGame({...initialState,...JSON.parse(raw)});}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)localStorage.setItem(SAVE,JSON.stringify(game))},[game,ready]);
 function move(dest:Place){if(dest==='square'&&!game.discovered.includes('square'))return;
  setGame(s=>({...s,place:dest,minute:s.minute+4,discovered:[...new Set([...s.discovered,dest])],messages:[],journal:[...s.journal,`Navštívil jsi: ${titles[dest]}.`]})); setTab('world');setToast(`Nové místo: ${titles[dest]}`);setTimeout(()=>setToast(''),2400);
 }
 function send(text:string, index?:number){if(!text.trim())return;setGame(s=>interact(s,text,index===undefined?undefined:choicesFor(s)[index]));setDraft('');setTab('dialogue');}
 function reset(){if(confirm('Opravdu smazat lokální postup a začít znovu?')){setGame(initialState);setTab('world')}}
 const atHome=game.place==='home'||game.place==='street';
 const character=game.place==='bakery'?'Pekařka':atHome?'Muž se psem':'Kolemjdoucí';
 return <main className="shell">
   <header className="top"><div><div className="brand">LIVING TOWN <span>· pilot 001</span></div><div className="subtitle">Sobota · {timeLabel(game.minute)} · Jaro</div></div><div className="topright"><span className="chip">☀️ 17 °C</span><span className="chip">⭐ 0</span></div></header>
   <div className="mainGrid">
    <section className="worldcard">
      <div className="section-head"><div><small>TVÉ OKOLÍ</small><h1>{titles[game.place]}</h1></div><span className="chip">📍 {game.place==='home'?'Nově přistěhován':'Objeveno'}</span></div>
      <div className="scene" aria-label="Ilustrovaná herní ulice před domem">
        <div className="sky"><span className="sun">☀</span><span className="cloud">☁</span></div>
        <div className="hills"/><div className="ground"/><div className="road"/><div className="path"/>
        <div className="house house-main"><div className="roof"/><div className="wall"><span className="window">▦</span><span className="door">▣</span><span className="window">▦</span></div><div className="sign">DEIN ZUHAUSE</div></div>
        <button className="house bakery" onClick={()=>move('bakery')} aria-label="Jít do pekárny"><div className="roof"/><div className="wall"><span className="window">▦</span><span className="door">▣</span></div><div className="sign">🥨 BÄCKEREI</div></button>
        <div className="tree tree1">🌳</div><div className="tree tree2">🌳</div><div className="boxes">📦 📦</div>
        {atHome&&!game.manLeft&&<button className="npc" onClick={()=>setTab('dialogue')} aria-label="Oslovit muže se psem"><span className="bubble">💬</span><span className="person">🧓🏻</span><span className="dog">🐕</span><span className="npc-label">{game.knownNames.includes('Herr Weber')?'Herr Weber':'???'}</span></button>}
        <span className="avatar">🧍</span>
        <div className="fog fog-left" title="Dosud neobjeveno"/><div className="fog fog-right" title="Dosud neobjeveno"/>
      </div>
      {toast&&<div className="toast">{toast}</div>}
      <div className="actions"><button onClick={()=>setTab('dialogue')} disabled={atHome&&game.manLeft}>{atHome?'💬 Oslovit souseda':game.place==='bakery'?'💬 Promluvit s pekařkou':'💬 Rozhlédnout se'}</button><button onClick={()=>setTab('map')}>🗺️ Osobní mapa</button><button onClick={()=>setTab('phone')}>📱 Telefon</button></div>
      <p className="description">{atHome?game.manLeft?'Muž se psem už odešel. Před domem zůstaly krabice. Přes ulici je pekárna.':'Před domem stojí krabice. Starší muž venčí malého psa. Na protější straně je pekárna.':'Vidíš jen to, co se nachází v bezprostředním okolí. Ostatní život města pokračuje i mimo tvůj pohled.'}</p>
    </section>
    <section className="panel">
      <nav className="tabs"><button className={tab==='world'?'active':''} onClick={()=>setTab('world')}>Okolí</button><button className={tab==='dialogue'?'active':''} onClick={()=>setTab('dialogue')}>Rozhovor</button><button className={tab==='phone'?'active':''} onClick={()=>setTab('phone')}>Telefon</button><button className={tab==='map'?'active':''} onClick={()=>setTab('map')}>Mapa</button></nav>
      {tab==='world'&&<div className="content"><h2>Tvůj první den</h2><p>Vítej v městečku. Neznáš místní obyvatele ani všechny ulice. Poznávej okolí postupně a ve vlastním tempu.</p><div className="notice">💡 Tip: Klepni na muže se psem nebo na pekárnu. Ne každý obyvatel má čas si povídat.</div><h3>Co můžeš udělat?</h3><button className="option" onClick={()=>setTab('dialogue')}>Oslovit člověka poblíž <span>→</span></button><button className="option" onClick={()=>move('bakery')}>Jít do pekárny <span>→</span></button>{game.discovered.includes('square')&&<button className="option" onClick={()=>move('square')}>Jít na náměstí <span>→</span></button>}</div>}
      {tab==='dialogue'&&<div className="content"><h2>{atHome?(game.manLeft?'Nikdo tu právě není':game.knownNames.includes('Herr Weber')?'Herr Weber':'Neznámý muž'):character}</h2>{atHome&&game.manLeft?<p>Muž se psem odešel. Můžeš prozkoumat ulici nebo vstoupit do pekárny.</p>:<><div className="conversation"><div className="message npcmsg">{game.messages.length===0?(game.place==='bakery'?'„Guten Morgen! Was darf es sein?“':atHome?'„Na, Sie sehen nach einem langen Umzug aus. Neu hier?“':'Náměstí je rušné. Zatím tu nikoho neznáš.'):null}</div>{game.messages.map((m,i)=><div className={'message '+(m.who==='player'?'mine':'npcmsg')} key={i}>{m.text}</div>)}</div><h3>Jak odpovíš?</h3>{choicesFor(game).map((c,i)=><button className="option" key={i} onClick={()=>send(c.label,i)}>{c.label}<span>→</span></button>)}<div className="compose"><input value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send(draft)}} placeholder="Napiš vlastní německou odpověď…"/><button onClick={()=>send(draft)} disabled={!draft.trim()}>Odeslat</button></div><small className="muted">Pilot: vlastní text rozpoznává několik základních záměrů; plnohodnotný AI dialog připojíme v další etapě.</small></>}</div>}
      {tab==='phone'&&<div className="content"><h2>📱 Tvůj telefon</h2><div className="subtabs"><button onClick={()=>setPhoneTab('messages')} className={phoneTab==='messages'?'sel':''}>Zprávy</button><button onClick={()=>setPhoneTab('contacts')} className={phoneTab==='contacts'?'sel':''}>Kontakty</button><button onClick={()=>setPhoneTab('diary')} className={phoneTab==='diary'?'sel':''}>Deník</button></div>{phoneTab==='messages'?<div>{game.notifications.map((n,i)=><div className="listrow" key={i}>📩 {n}</div>)}</div>:phoneTab==='contacts'?<div>{game.knownNames.length?game.knownNames.map(n=><div className="listrow" key={n}>👤 {n}</div>):<p className="muted">Zatím nemáš žádný kontakt. Seznamuj se postupně.</p>}</div>:<div className="journal">{game.journal.map((n,i)=><div className="listrow" key={i}>• {n}</div>)}</div>}</div>}
      {tab==='map'&&<div className="content"><h2>🗺️ Osobní mapa</h2><p>Známá místa jsou dostupná. Zbytek městečka zatím zůstává v mlze.</p><div className="minimap"><button onClick={()=>move('home')} className="pin homepin">🏠 Doma</button><button onClick={()=>move('bakery')} className="pin breadpin">🥨 Pekárna</button><button disabled={!game.discovered.includes('square')} onClick={()=>move('square')} className="pin squarepin">{game.discovered.includes('square')?'⛲ Náměstí':'☁️ ???'}</button><div className="mapfog">NEOBJEVENO</div></div><div className="notice">Objeveno {game.discovered.length} míst. Mapa neukazuje soukromé vztahy ani skryté plány obyvatel.</div></div>}
    </section>
   </div><footer><span>Lokální demo · stav uložen v tomto prohlížeči · bez běžícího multiplayer serveru</span><button onClick={reset}>↻ Začít znovu</button></footer>
  </main>
}
