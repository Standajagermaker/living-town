'use client';
import {useState} from 'react';
import type {TownState,Lang} from '../lib/world';
import {residentsAt} from '../lib/residents';
import {byId} from '../lib/residents';
import {officeScene089,officeProgress089,chooseOffice089} from '../lib/office089';
import {v083,level083,levelName083,hint083,workload083,recover083,meeting083,workBlock083,answer083,skipMeeting083,lunch083,finish083,role083,visitor083,beat083,chooseBeat083,BOSS083} from '../lib/living083';
export function Living083Panel({state,lang,onState}:{state:TownState;lang:Lang;onState:(s:TownState)=>void}){
 const p=v083(state),lv=level083(state),work=state.place==='work',meeting=meeting083(state);
 const [priority,setPriority]=useState<'work'|'health'|'relationships'>(p.priority??'work');
 const lunch=work&&state.minute>=720&&state.minute<780&&!p.lunches.includes(state.day);
 const people=work?[...new Set([...residentsAt('work',state.day,state.minute).map(x=>x.id),...(visitor083(state)?[visitor083(state)!.id]:[])])]:[];
 const beat=beat083(state);
 return <div className="living083">
 <section className="life-object"><h4>🧭 {lang==='cs'?'Životní výzva':'Lebensaufgabe'} · {lv}/20</h4><p><strong>{levelName083(state,lang)}</strong></p><p>💡 {hint083(state,lang)}</p><small>Resilience {p.resilience} · {lang==='cs'?'Empatie':'Empathie'} {p.empathy} · {lang==='cs'?'Organizace':'Organisation'} {p.organization} · {lang==='cs'?'Zátěž':'Belastung'} {workload083(state)}/100</small><div className="story-choice-list">
 <button onClick={()=>onState(recover083(state,'rest'))}>{lang==='cs'?'15 minut klidu':'15 Minuten Ruhe'}</button><label className="priority-picker">{lang==='cs'?'Dnešní priorita':'Tagespriorität'} <select value={priority} onChange={e=>setPriority(e.target.value as 'work'|'health'|'relationships')}><option value="work">{lang==='cs'?'Práce':'Arbeit'}</option><option value="health">{lang==='cs'?'Zdraví a odpočinek':'Gesundheit und Ruhe'}</option><option value="relationships">{lang==='cs'?'Vztahy a přátelé':'Beziehungen'}</option></select></label><button onClick={()=>onState(recover083(state,'plan',priority))}>{lang==='cs'?'Potvrdit prioritu · 30 min':'Priorität festlegen · 30 Min'}</button><button onClick={()=>onState(recover083(state,'support'))}>{lang==='cs'?'Požádat o pomoc · 30 min':'Um Hilfe bitten · 30 Min'}</button></div></section>
 <section className="life-object"><h4>🌱 {lang==='cs'?'Tvůj příběh':'Deine Lebensgeschichte'}</h4><p>{lang==='cs'?'Začínáš s prací a vlastním bydlením. Poznávej lidi, pečuj o přátelství, najdi partnera a časem vytvoř rodinu. Šetři na auto a dovolenou a udržuj si koníčky. Nemusíš stihnout všechno dnes — důležité je, jaký život si postupně vytvoříš.':'Du beginnst mit Arbeit und einer eigenen Wohnung. Baue Freundschaften auf, finde eine Partnerschaft und gründe später eine Familie. Spare für Auto und Urlaub und pflege deine Hobbys.'}</p><p>{lang==='cs'?'Domov je tvoje soukromí: návštěvy budou možné až na vyšší úrovni a jen po výslovném pozvání.':'Dein Zuhause ist privat: Besuche sind erst später und nur auf Einladung möglich.'}</p></section>
 {work&&<section className="life-object office-module office089">
 <div className="office089-top"><h4>🏢 {lang==='cs'?'Pracovní den':'Arbeitstag'} · {String(Math.floor(state.minute/60)).padStart(2,'0')}:{String(state.minute%60).padStart(2,'0')}</h4><small>{lang==='cs'?'Důvěra v práci':'Vertrauen im Team'} · {p.reputation}</small></div>
 {officeScene089(state)?<><div className="office089-progress" aria-label={lang==='cs'?'Průběh směny':'Schichtfortschritt'}><div style={{width:(officeProgress089(state)/10*100)+'%'}}/></div><small>{lang==='cs'?'Situace':'Szene'} {officeProgress089(state)+1}/10 · {lang==='cs'?'Dnes potkáš různé úkoly a překvapení.':'Heute erwarten dich verschiedene Aufgaben und Überraschungen.'}</small>
 <div className="office089-scene"><h3>{officeScene089(state)!.title[lang]}</h3><p>{officeScene089(state)!.story[lang]}</p>
 <div className="office089-actions">{officeScene089(state)!.choices.map((answer,i)=><button key={i} disabled={officeScene089(state)!.kind==='lunch'&&i!==2&&state.wallet<6.5} onClick={()=>onState(chooseOffice089(state,i))}>{answer[lang]} <span>↗</span></button>)}</div></div>
 {state.office089?.day===state.day&&officeProgress089(state)>0&&<p className="office089-feedback">💬 {state.office089.last[lang]}</p>}
 </>:<p>{state.lastShift===state.day?(lang==='cs'?'Dnešní směna je hotová.':'Die Schicht ist abgeschlossen.'):state.employment==='fired'?(lang==='cs'?'Zde už nejsi zaměstnaný.':'Du arbeitest nicht mehr hier.'):(lang==='cs'?'Pracovní modul je dostupný ve všední den během směny.':'Das Arbeitsmodul ist werktags während der Arbeitszeit verfügbar.')}</p>}
 </section>}
 {beat&&<section className="life-object"><h4>🎭 {lang==='cs'?'Nečekaná situace':'Unerwartete Situation'}</h4><p>{beat[lang]}</p><div className="story-choice-list">{beat.options.map((o,i)=><button key={i} onClick={()=>onState(chooseBeat083(state,beat.id,i))}>{o[lang==='cs'?0:1]}</button>)}</div></section>}
 {p.last&&<section className="life-object"><p>{p.last[lang]}</p></section>}
 </div>;
}
