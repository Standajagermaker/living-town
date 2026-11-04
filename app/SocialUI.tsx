'use client';
import {useState} from 'react';
import type {TownState,Lang} from '../lib/world';
import {byId} from '../lib/world';
import {sendText,payRent,gearItems,gearFor,buyGear,dayTrip,holiday,restaurantMeal,sport,seasonFor} from '../lib/social';
type Props={state:TownState;lang:Lang;onState:(s:TownState)=>void};
const dict={
 cs:{contacts:'Kontakty',write:'Napsat zprávu',text:'Co chceš napsat?',send:'Odeslat',call:'Zavolat',wait:'Čeká na odpověď…',reply:'Odpověď',none:'Zatím nemáš žádné telefonní kontakty.',rent:'Nájem',due:'Další splatnost',pay:'Zaplatit nájem · 210 €',unpaid:'Nájem je po splatnosti.',store:'Obchod s vybavením',owned:'Vlastníš',buy:'Koupit',trip:'Výlet do hor',hike:'Vyrazit na túru',bike:'Vyrazit na kolo',swim:'Jít si zaplavat',ski:'Jít lyžovat',holiday:'Dovolená',travel:'Odjet na dovolenou · 1 200 €',meal:'Jídlo',restaurant:'Najíst se v restauraci · 18 €',season:'Roční období',seasonNames:['Jaro','Léto','Podzim','Zima'],close:'Zavřít',mountains:'V horách',social:'Zprávy',blocked:'Zatím se nechce spojit.',price:'€',confirm:'Potvrdit'},
 de:{contacts:'Kontakte',write:'Nachricht schreiben',text:'Deine Nachricht',send:'Senden',call:'Anrufen',wait:'Wartet auf Antwort…',reply:'Antwort',none:'Noch keine Telefonkontakte.',rent:'Miete',due:'Nächste Fälligkeit',pay:'Miete zahlen · 210 €',unpaid:'Die Miete ist überfällig.',store:'Sport- und Bekleidungsgeschäft',owned:'Vorhanden',buy:'Kaufen',trip:'Ausflug in die Berge',hike:'Wanderung starten',bike:'Radtour machen',swim:'Schwimmen gehen',ski:'Ski fahren',holiday:'Urlaub',travel:'In den Urlaub fahren · 1.200 €',meal:'Essen',restaurant:'Im Restaurant essen · 18 €',season:'Jahreszeit',seasonNames:['Frühling','Sommer','Herbst','Winter'],close:'Schließen',mountains:'In den Bergen',social:'Nachrichten',blocked:'Noch kein Kontakt möglich.',price:'€',confirm:'Bestätigen'}
};
export function SocialPhone({state,lang,onState}:Props){
 const t=dict[lang],social=state.social;
 const [active,setActive]=useState<string|null>(null),[draft,setDraft]=useState('');
 function send(){if(!active||!draft.trim())return;onState(sendText(state,active,draft));setDraft('');}
 return <div className="social-phone"><h3>💬 {t.contacts}</h3>{social.contacts.length===0?<p>{t.none}</p>:<div className="contact-buttons">{social.contacts.map(id=>{const npc=byId(id);return npc?<button key={id} onClick={()=>setActive(id)} className={active===id?'active':''}>{npc.portrait} {npc.name}</button>:null})}</div>}
 {active&&social.contacts.includes(active)&&<div className="messages-box"><h4>{byId(active)?.name}</h4>{social.messages.filter(m=>m.residentId===active).map(m=><div className="message-pair" key={m.id}><p className="outgoing">{m.body}</p>{m.delivered?<p className="incoming">{lang==='cs'?m.replyCs:m.replyDe}</p>:<small>{t.wait}</small>}</div>)}<label htmlFor="social-draft">{t.text}</label><textarea id="social-draft" maxLength={260} rows={2} value={draft} onChange={e=>setDraft(e.target.value)}/><div className="contact-actions"><button disabled={!draft.trim()} onClick={send}>{t.send}</button><button onClick={()=>onState(sendText(state,active,lang==='cs'?'☎️ Zkoušel jsem ti zavolat.':'☎️ Ich habe versucht, dich anzurufen.'))}>☎️ {t.call}</button></div></div>}</div>;
}
export function SocialActivities({state,lang,onState}:Props){
 const t=dict[lang],social=state.social;
 return <div className="social-activities">
 {state.place==='home'&&<div className="life-object"><h4>🏠 {t.rent}</h4><p>{t.due}: {Math.max(state.day,social.housingPaidThrough)+1} · 210 €</p>{state.day>social.housingPaidThrough&&<p>{t.unpaid}</p>}<button onClick={()=>onState(payRent(state))} disabled={state.wallet<210||state.day<social.housingPaidThrough}>{t.pay}</button></div>}
 {state.place==='outfitter'&&<div className="life-object"><h4>🧥 {t.store}</h4>{gearItems.map(item=><div className="shop-item" key={item.id}><span>{item[lang]} · {item.price} €</span><button disabled={social.wardrobe.includes(item.id)||state.wallet<item.price} onClick={()=>onState(buyGear(state,item.id))}>{social.wardrobe.includes(item.id)?t.owned:t.buy}</button></div>)}</div>}
 {state.place==='mountains'&&<div className="life-object"><h4>⛰ {t.trip}</h4><button disabled={!social.wardrobe.includes('hiking')||!social.wardrobe.includes(gearFor(state.day))||state.life.energy<30} onClick={()=>onState(dayTrip(state))}>{t.hike}</button>{seasonFor(state.day)===3&&<button disabled={!social.wardrobe.includes('skis')||!social.wardrobe.includes('wintercoat')||state.life.energy<25} onClick={()=>onState(sport(state,'ski'))}>🎿 {t.ski}</button>}</div>}
 {state.place==='park'&&<div className="life-object"><h4>🌳 {lang==='cs'?'Aktivity v parku':'Aktivitäten im Park'}</h4><button disabled={!social.wardrobe.includes('bike')||state.life.energy<25} onClick={()=>onState(sport(state,'bike'))}>🚲 {t.bike}</button>{seasonFor(state.day)===1&&<button disabled={!social.wardrobe.includes('swimsuit')||state.life.energy<25} onClick={()=>onState(sport(state,'swim'))}>🏊 {t.swim}</button>}</div>}
 {state.place==='hotel'&&<div className="life-object"><h4>✈ {t.holiday}</h4><button disabled={state.wallet<2000||social.lastHoliday===state.day} onClick={()=>onState(holiday(state))}>{t.travel}</button></div>}
 {state.place==='restaurant'&&<div className="life-object"><h4>🍲 {t.meal}</h4><button disabled={state.wallet<18} onClick={()=>onState(restaurantMeal(state))}>{t.restaurant}</button></div>}
 </div>;
}
