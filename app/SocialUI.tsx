'use client';
import {useState} from 'react';
import type {TownState,Lang} from '../lib/world';
import {byId,callRestaurantStaff,fastTravel} from '../lib/world';
import {StoryExpansionPanel} from './StoryExpansionUI';
import {Living083Panel} from './Living083Panel';
import {destinations,travelToCity,returnFromHoliday,railConversationAvailable,railDelayMinutes,railwayConversation,railwayIncidentTitle,railwayIncidentText,resolveRailIncident} from '../lib/trainTravel';
import {sendText,payRent,payUtilities,gearItems,gearFor,buyGear,dayTrip,holiday,restaurantMeal,restaurantQuote,theatreTicket,sport,seasonFor} from '../lib/social';
type Props={state:TownState;lang:Lang;onState:(s:TownState)=>void};
const dict={
 cs:{contacts:'Kontakty',write:'Napsat zprávu',text:'Co chceš napsat?',send:'Odeslat',call:'Zavolat',wait:'Čeká na odpověď…',reply:'Odpověď',none:'Zatím nemáš žádné telefonní kontakty.',rent:'Nájem',due:'Další splatnost',pay:'Zaplatit nájem · 210 €',unpaid:'Nájem je po splatnosti.',store:'Obchod s vybavením',owned:'Vlastníš',buy:'Koupit',trip:'Výlet do hor',hike:'Vyrazit na túru',bike:'Vyrazit na kolo',swim:'Jít si zaplavat',ski:'Jít lyžovat',downhill:'Jít na downhill',holiday:'Dovolená',travel:'Odjet na dovolenou · 1 200 €',meal:'Jídlo',restaurant:'Najíst se v restauraci',inviteMeal:'Pozvat na jídlo',theatre:'Koupit vstupenku do divadla',season:'Roční období',seasonNames:['Jaro','Léto','Podzim','Zima'],close:'Zavřít',mountains:'V horách',social:'Zprávy',blocked:'Zatím se nechce spojit.',price:'€',confirm:'Potvrdit'},
 de:{contacts:'Kontakte',write:'Nachricht schreiben',text:'Deine Nachricht',send:'Senden',call:'Anrufen',wait:'Wartet auf Antwort…',reply:'Antwort',none:'Noch keine Telefonkontakte.',rent:'Miete',due:'Nächste Fälligkeit',pay:'Miete zahlen · 210 €',unpaid:'Die Miete ist überfällig.',store:'Sport- und Bekleidungsgeschäft',owned:'Vorhanden',buy:'Kaufen',trip:'Ausflug in die Berge',hike:'Wanderung starten',bike:'Radtour machen',swim:'Schwimmen gehen',ski:'Ski fahren',downhill:'Downhill fahren',holiday:'Urlaub',travel:'In den Urlaub fahren · 1.200 €',meal:'Essen',restaurant:'Im Restaurant essen',inviteMeal:'Zum Essen einladen',theatre:'Theaterkarte kaufen',season:'Jahreszeit',seasonNames:['Frühling','Sommer','Herbst','Winter'],close:'Schließen',mountains:'In den Bergen',social:'Nachrichten',blocked:'Noch kein Kontakt möglich.',price:'€',confirm:'Bestätigen'}
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
 const [guest,setGuest]=useState<string>('');
 const friends=social.contacts.filter(id=>state.social.bonds[id]?.warmth>=18);
 return <div className="social-activities"><Living083Panel state={state} lang={lang} onState={onState}/>
 {state.place==='home'&&<div className="life-object"><h4>🏠 {t.rent}</h4>
 <p>{lang==='cs'?'Další první den měsíce':'Nächster Monatserster'}: {Math.floor(state.day/30)*30+31} · 210 €</p>
 {social.rentArrears>0&&<p>{t.unpaid} ({social.rentArrears})</p>}
 <button onClick={()=>onState(payRent(state))} disabled={state.wallet<210||state.day<social.housingPaidThrough||state.housingStatus==='owned'}>{t.pay}</button>
 <p>{lang==='cs'?'Energie a služby':'Nebenkosten'}: {state.utilitiesDue.toFixed(2)} €</p>
 <button disabled={state.utilitiesDue<=0||state.wallet<state.utilitiesDue} onClick={()=>onState(payUtilities(state))}>{lang==='cs'?'Zaplatit energie':'Nebenkosten bezahlen'}</button>
 </div>}
 {state.railIncident&&(state.place==='train'||state.place==='hotel')&&<div className="life-object rail-complication">
 <h4>⚠️ {railwayIncidentTitle(state.railIncident.kind,lang)}</h4>
 <p>{railwayIncidentText(state.railIncident.kind,lang)}</p>
 <div className="market-encounter-actions">
 <button onClick={()=>onState(resolveRailIncident(state,'notify'))}>{lang==='cs'?'📞 Dát vědět předem':'📞 Rechtzeitig Bescheid geben'}</button>
 <button onClick={()=>onState(resolveRailIncident(state,'negotiate'))}>{lang==='cs'?'🤝 Domluvit řešení':'🤝 Eine Lösung aushandeln'}</button>
 <button onClick={()=>onState(resolveRailIncident(state,'improvise'))}>{lang==='cs'?'⚡ Rychle improvizovat':'⚡ Spontan improvisieren'}</button>
 </div>
 </div>}
 {state.place==='train'&&<div className="life-object railway-panel"><h4>🚉 {lang==='cs'?'Vlakové spojení':'Zugverbindungen'}</h4>
 <p>{lang==='cs'?'Dovolená':'Urlaub'}: {state.vacationDays} {lang==='cs'?'dní':'Tage'}</p>
 {railConversationAvailable(state)&&<div className="rail-delay-story">
 <p>⏱ {lang==='cs'?'Hlášení: vlak má zpoždění':'Durchsage: Der Zug hat Verspätung'} {railDelayMinutes(state)} min.</p>
 <p>{lang==='cs'?'U tabule stojí několik cestujících. Jeden z nich nespokojeně zakroutí hlavou. Chceš se zapojit?':'Vor der Anzeigetafel stehen mehrere Reisende. Einer schüttelt verärgert den Kopf. Möchtest du etwas sagen?'}</p>
 <div className="market-encounter-actions">
 <button onClick={()=>onState(railwayConversation(state,'complain'))}>{lang==='cs'?'To snad není možné!':'Das kann doch nicht wahr sein!'}</button>
 <button onClick={()=>onState(railwayConversation(state,'joke'))}>{lang==='cs'?'Ten vlak je asi legenda.':'Der Zug ist wohl eine Legende.'}</button>
 <button onClick={()=>onState(railwayConversation(state,'ask'))}>{lang==='cs'?'Nevíte, kdy pojede?':'Wissen Sie, wann er fährt?'}</button>
 <button onClick={()=>onState(railwayConversation(state,'quiet'))}>{lang==='cs'?'Raději mlčet':'Lieber schweigen'}</button>
 </div></div>}
 {state.railTalkDay===state.day&&state.railTalkOutcome&&<p className="market-followup">{state.railTalkOutcome[lang]}</p>}
 {!state.onHoliday?destinations.map(d=><div className="shop-item" key={d.id}><span><strong>{d[lang]}</strong> · {d.minutes} min<br/>{lang==='cs'?'Jízdenka':'Fahrkarte'} {d.ticket} € + {lang==='cs'?'hotel':'Hotel'} {d.hotel} € · 2 {lang==='cs'?'dny volna':'Urlaubstage'}</span>
 <button disabled={state.wallet<d.ticket+d.hotel||state.vacationDays<2||Boolean(state.railIncident)} onClick={()=>onState(travelToCity(state,d.id))}>{lang==='cs'?'Odjet':'Abfahren'}</button></div>):<button disabled={state.wallet<29} onClick={()=>onState(returnFromHoliday(state))}>{lang==='cs'?'Vrátit se domů (29 €)':'Zurück nach Hause (29 €)'}</button>}
 </div>}
 {state.place==='outfitter'&&<div className="life-object"><h4>🧥 {t.store}</h4>{gearItems.map(item=><div className="shop-item" key={item.id}><span>{item[lang]} · {item.price} €</span><button disabled={social.wardrobe.includes(item.id)||state.wallet<item.price} onClick={()=>onState(buyGear(state,item.id))}>{social.wardrobe.includes(item.id)?t.owned:t.buy}</button></div>)}</div>}
 {state.place==='mountains'&&<div className="life-object"><h4>⛰ {t.trip}</h4><button disabled={!social.wardrobe.includes('hiking')||!social.wardrobe.includes(gearFor(state.day))||state.life.energy<30} onClick={()=>onState(dayTrip(state))}>{t.hike}</button></div>}
 {state.place==='park'&&<div className="life-object"><h4>🌳 {lang==='cs'?'Aktivity v parku':'Aktivitäten im Park'}</h4>
 {(['run','bike'] as const).map(kind=>{const required=kind==='run'?'running-shoes':'bike',owned=social.wardrobe.includes(required);return <div className="park-activity" key={kind}><span>{kind==='run'?'🏃':'🚲'} {kind==='run'?(lang==='cs'?'Běhání':'Joggen'):t.bike}</span>
 {owned?<button disabled={state.life.energy<25} onClick={()=>onState(sport(state,kind))}>{lang==='cs'?'Vyrazit':'Los geht’s'}</button>:<button onClick={()=>onState(fastTravel({...state,discovered:[...new Set([...state.discovered,'outfitter' as const])]},'outfitter'))}>{lang==='cs'?'Koupit vybavení':'Ausrüstung kaufen'} →</button>}</div>})}</div>}
 {state.place==='pool'&&<div className="life-object"><h4>🏊 {lang==='cs'?'Venkovní plovárna':'Freibad'}</h4><button disabled={seasonFor(state.day)!==1||!social.wardrobe.includes('swimsuit')||state.life.energy<25} onClick={()=>onState(sport(state,'swim'))}>🏊 {t.swim}</button></div>}
 {state.place==='resort'&&<div className="life-object"><h4>⛰ {lang==='cs'?'Horské středisko':'Bergsportzentrum'}</h4>
 {seasonFor(state.day)===3?<button disabled={!social.wardrobe.includes('skis')||!social.wardrobe.includes('wintercoat')||state.life.energy<25} onClick={()=>onState(sport(state,'ski'))}>🎿 {t.ski}</button>:<button disabled={(seasonFor(state.day)!==1&&seasonFor(state.day)!==2)||!social.wardrobe.includes('bike')||state.life.energy<25} onClick={()=>onState(sport(state,'downhill'))}>🚵 {t.downhill}</button>}
 </div>}
 {state.place==='hotel'&&<div className="life-object"><h4>🛏 {lang==='cs'?'Pobyt v hotelu':'Hotelaufenthalt'}</h4><p>{lang==='cs'?'V cizím městě můžeš odpočívat a objevovat okolí.':'In einer fremden Stadt kannst du ausruhen und die Umgebung entdecken.'}</p></div>}
 {state.place==='restaurant'&&<div className="life-object"><h4>🍲 {t.meal}</h4>
 <div className="restaurant-staff-actions">
 <button onClick={()=>onState(callRestaurantStaff(state,'chef'))} disabled={state.restaurantStory.chefCalled}>{lang==='cs'?'👨‍🍳 Požádat o kuchaře':'👨‍🍳 Koch rufen'}</button>
 <button onClick={()=>onState(callRestaurantStaff(state,'owner'))} disabled={state.restaurantStory.ownerCalled}>{lang==='cs'?'👔 Požádat o majitele':'👔 Inhaber rufen'}</button>
 </div><button disabled={state.wallet<restaurantQuote(state)} onClick={()=>onState(restaurantMeal(state))}>{t.restaurant} · {restaurantQuote(state).toFixed(2)} €</button>
 {friends.length>0&&<div className="restaurant-invite"><label>{t.inviteMeal}</label><select value={guest} onChange={e=>setGuest(e.target.value)}><option value="">—</option>{friends.map(id=><option key={id} value={id}>{byId(id)?.name}</option>)}</select>
 {guest&&<button disabled={state.wallet<restaurantQuote(state,guest)} onClick={()=>onState(restaurantMeal(state,guest))}>{t.inviteMeal} · {restaurantQuote(state,guest).toFixed(2)} €</button>}</div>}</div>}
 {state.place==='street'&&<div className="life-object"><h4>🎭 {lang==='cs'?'Divadlo':'Theater'}</h4><button onClick={()=>onState(theatreTicket(state))}>{t.theatre}</button></div>}
 <StoryExpansionPanel state={state} lang={lang} onState={onState}/>
 </div>;
}
