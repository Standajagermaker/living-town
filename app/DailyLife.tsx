'use client';
import {useState} from 'react';
import type {TownState,Lang} from '../lib/world';
import {eat,groceries,groceryOffers,watchTv,browseHome,rest,borrow,readLoan,returnLoan,lookAround,catalog,eventsForDay,registerEvent,attendEvent,type TownEvent} from '../lib/life';
type Props={state:TownState;lang:Lang;onState:(s:TownState)=>void;onAttend?:(s:TownState)=>void;onFocus?:(focus:'room'|'tv'|'phone')=>void};
const l={
 cs:{home:'Domov',fridge:'Lednička',meal:'Uvařit a najíst se',empty:'V ledničce už skoro nic není.',tv:'Televize',watch:'Pustit televizi',browse:'Prohlížet novinky v telefonu',bed:'Postel',sleep:'Vyspat se',books:'Knihovna',read:'Číst doma',finished:'Dočteno',library:'Výpůjčky',borrow:'Vypůjčit',return:'Vrátit knihu',shop:'Obchod',stock:'Koupit zásoby · 12 €',look:'Rozhlédnout se',events:'Kalendář událostí',join:'Zúčastním se',attend:'Jít na událost',registered:'V kalendáři',attended:'Zúčastnil ses',limit:'Na tento den už máš dvě události.',noLoans:'Žádné vypůjčené knihy.',study:'Kniha',explanation:'',energy:'Energie',hunger:'Hlad',groceries:'Jídlo',day:'Den',time:'Čas',close:'Zavřít',soon:'Událost je plánovaná na jiný den.',bookFirst:'Kniha čeká na přečtení.',afterNight:'Knihu už máš přečtenou.',last:'Co se přihodilo',feels:'Dnes ještě chvíli zůstaneš doma.'},
 de:{home:'Zuhause',fridge:'Kühlschrank',meal:'Kochen und essen',empty:'Der Kühlschrank ist fast leer.',tv:'Fernseher',watch:'Fernsehen',browse:'Neuigkeiten am Handy lesen',bed:'Bett',sleep:'Schlafen',books:'Bücherregal',read:'Zu Hause lesen',finished:'Fertig gelesen',library:'Ausleihe',borrow:'Ausleihen',return:'Buch zurückgeben',shop:'Supermarkt',stock:'Lebensmittel kaufen · 12 €',look:'Umschauen',events:'Veranstaltungskalender',join:'Teilnehmen',attend:'Zur Veranstaltung',registered:'Im Kalender',attended:'Teilgenommen',limit:'Du hast für diesen Tag schon zwei Veranstaltungen.',noLoans:'Keine ausgeliehenen Bücher.',study:'Buch',explanation:'',energy:'Energie',hunger:'Hunger',groceries:'Lebensmittel',day:'Tag',time:'Uhrzeit',close:'Schließen',soon:'Die Veranstaltung ist an einem anderen Tag.',bookFirst:'Das Buch wartet darauf, gelesen zu werden.',afterNight:'Du hast das Buch schon gelesen.',last:'Was passiert ist',feels:'Heute bleibst du noch ein bisschen zu Hause.'}
};
export function DailyLife({state,lang,onState,onFocus}:Props){
 const t=l[lang],life=state.life;
 const [openBook,setOpenBook]=useState<string|null>(null);
 const book=catalog.find(b=>b.id===openBook);
 return <div className="daily-life">
  {state.place==='home'&&<><div className="home-furniture">
   <section><h4>🧊 {t.fridge}</h4><p>{t.groceries}: {life.groceries}</p><button disabled={life.groceries<1} onClick={()=>onState(eat(state))}>🍳 {t.meal}</button>{life.groceries===0&&<small>{t.empty}</small>}</section>
   <section><h4>📺 {t.tv}</h4><button onClick={()=>{onState(watchTv(state));onFocus?.('tv')}}>{t.watch}</button><button onClick={()=>{onState(browseHome(state));onFocus?.('phone')}}>📱 {t.browse}</button></section>
   <section><h4>🛏 {t.bed}</h4><button onClick={()=>onState(rest(state))}>{t.sleep}</button></section>
   <section><h4>📚 {t.books}</h4>{life.loans.length?life.loans.map(b=><button key={b.id} disabled={b.readDay!==null} onClick={()=>setOpenBook(b.id)}>{catalog.find(x=>x.id===b.id)?.[lang]} {b.readDay!==null?'✓':''}</button>):<small>{t.noLoans}</small>}</section>
   </div>
   {book&&<div className="reading-card"><h4>{book[lang]}</h4><p>{lang==='cs'?book.csText:book.deText}</p><button onClick={()=>{onState(readLoan(state,book.id));setOpenBook(null)}}>{t.finished}</button><button onClick={()=>setOpenBook(null)}>{t.close}</button></div>}
   </>}
  {state.place==='market'&&<div className="life-object"><h4>🛒 {t.shop}</h4><p>{lang==='cs'?'Dnešní nabídka – ceny se mění':'Heutige Angebote – wechselnde Preise'}</p>{groceryOffers(state.day).map(item=><div className="shop-item" key={item.id}><span>{item[lang]} · {item.portions} {lang==='cs'?'porce':'Portionen'} · {item.price.toFixed(2)} €</span><button disabled={state.wallet<item.price} onClick={()=>onState(groceries(state,item.id))}>{lang==='cs'?'Koupit':'Kaufen'}</button></div>)}</div>}
  {state.place==='library'&&<div className="life-object"><h4>📚 {t.library}</h4>{catalog.map(b=>{const loan=life.loans.find(x=>x.id===b.id);return <div className="book-row" key={b.id}><span>{b[lang]}</span>{loan?<button onClick={()=>onState(returnLoan(state,b.id))}>{t.return}</button>:<button disabled={life.readBooks.includes(b.id)} onClick={()=>onState(borrow(state,b.id))}>{t.borrow}</button>}</div>})}</div>}
  {(state.place==='street'||state.place==='square')&&<button className="action-row" onClick={()=>onState(lookAround(state))}>👁 {t.look}</button>}
 </div>;
}
export function EventCalendar({state,lang,onState,onAttend}:Props){
 const t=l[lang];
 const events=Array.from({length:7},(_,offset)=>eventsForDay(state.day+offset)).flat();
 const dayNames=lang==='cs'?['So','Ne','Po','Út','St','Čt','Pá']:['Sa','So','Mo','Di','Mi','Do','Fr'];
 return <div className="event-calendar"><h3>🗓 {lang==='cs'?'Kalendář na 7 dní':'7-Tage-Kalender'}</h3><div className="calendar-week-strip">{Array.from({length:7},(_,i)=><div key={i}><b>{dayNames[(state.day+i)%7]}</b><span>{state.day+i+1}</span><small>{eventsForDay(state.day+i).length} {lang==='cs'?'akcí':'Termine'}</small></div>)}</div>
 {events.map(ev=>{
 const booked=state.life.calendar.find(x=>x.eventId===ev.id),dayCount=state.life.calendar.filter(x=>x.day===ev.day).length;
 const canAttend=booked?.status==='going'&&ev.day===state.day&&state.minute<=ev.end;
 return <article className="calendar-card" key={ev.id}>
  <div><strong>{ev.emoji} {ev[lang]}</strong><small>{t.day} {ev.day+1} · {t.time} {String(Math.floor(ev.start/60)).padStart(2,'0')+':'+String(ev.start%60).padStart(2,'0')}</small></div>
  <p>{lang==='cs'?ev.detailCs:ev.detailDe}</p>
  {booked?.status==='attended'?<span>✓ {t.attended}</span>:booked?<button disabled={!canAttend} onClick={()=>onAttend?.(attendEvent(state,ev))}>{canAttend?t.attend:t.registered}</button>:<button disabled={dayCount>=2} onClick={()=>onState(registerEvent(state,ev))}>{dayCount>=2?t.limit:t.join}</button>}
 </article>;
 })}
 </div>;
}
