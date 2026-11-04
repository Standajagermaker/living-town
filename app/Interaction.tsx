'use client';
import {useState} from 'react';
import {byId,choices,quizzes,solve,residents,type TownState,type Lang,type Answer} from '../lib/world';
import {EventCalendar} from './DailyLife';
type Props={state:TownState;lang:Lang;onState:(next:TownState)=>void;onApproach:(id:string)=>void;onExit:()=>void;onSend:(text:string,choice?:Answer)=>Promise<void>;busy:boolean};
const tx={
 cs:{title:'Interakce s postavou',people:'Obyvatelé',dialogue:'Rozhovor',noNpc:'Oslov někoho poblíž a rozhovor začne.',your:'Vlastní odpověď',placeholder:'Napiš, co chceš opravdu říct…',send:'Odeslat',waiting:'Postava přemýšlí…',goodbye:'Rozloučit se',again:'Navázat na další rozhovor',resume:'Rozhovor navazuje na předchozí setkání.',undiscovered:'Neznámý obyvatel',silent:'Postava je právě pryč. Můžeš odejít a vrátit se jindy.',goBack:'Zpět do okolí'},
 de:{title:'Gespräch mit einer Person',people:'Bewohner',dialogue:'Gespräch',noNpc:'Sprich jemanden in deiner Nähe an.',your:'Eigene Antwort',placeholder:'Schreibe, was du wirklich sagen möchtest…',send:'Senden',waiting:'Die Person überlegt…',goodbye:'Freundlich verabschieden',again:'Erneut ansprechen',resume:'Das Gespräch knüpft an eure bisherigen Treffen an.',undiscovered:'Unbekannte Person',silent:'Die Person ist nicht mehr hier. Du kannst später zurückkommen.',goBack:'Zurück zur Umgebung'}
};
export function Interaction({state,lang,onApproach,onExit,onSend,busy}:Omit<Props,'onState'>){
 const [draft,setDraft]=useState('');
 const current=state.selectedNpc?byId(state.selectedNpc):null;
 const m=state.selectedNpc?state.conversations[state.selectedNpc]:null;
 const t=tx[lang];
 const send=async(text:string,choice?:Answer)=>{if(!text.trim()||busy)return;setDraft('');await onSend(text,choice);};
 return <div className="interaction-content">{current&&m?<><div className="character-head"><div className="character-portrait">{current.portrait}</div><div><strong>{state.known.includes(current.id)?current.name:t.undiscovered}</strong><small>{t.resume}</small></div></div>
 <div className="message-history">{m.turns.slice(-12).map((turn,i)=><div className={turn.role==='player'?'user-message':'character-message'} key={i}>{turn.role==='player'?(turn.raw||turn[lang]):turn[lang]}</div>)}</div>
 {m.open?<><div className="answer-list">{choices(state,lang).map(opt=><button key={opt.id} disabled={busy} className={opt.topic==='bye'?'exit-option':''} onClick={()=>opt.topic==='bye'?onExit():send(opt[lang],opt)}>{opt.topic==='bye'?'↩ ':''}{opt[lang]}</button>)}</div><label className="input-label" htmlFor="custom-reply">{t.your}</label><textarea id="custom-reply" value={draft} onChange={e=>setDraft(e.target.value)} rows={3} placeholder={t.placeholder} onKeyDown={e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')send(draft)}}/><div className="text-actions"><button disabled={!draft.trim()||busy} onClick={()=>send(draft)}>{busy?t.waiting:t.send}</button><button onClick={onExit}>{t.goodbye}</button></div></>:<button className="action-link" onClick={()=>onApproach(current.id)}>{t.again} →</button>}</>:<p className="muted-panel">{t.noNpc}</p>}</div>;
}
export function Quizzes({state,lang,onState}:{state:TownState;lang:Lang;onState:(s:TownState)=>void}){
 const [selected,setSelected]=useState<string|null>(null);const [feedback,setFeedback]=useState<{id:string;right:boolean}|null>(null);
 const t=lang==='cs'?{headline:'Mini kvízy a hádanky',hint:'',done:'Vyřešeno',right:'Správně! Znalost sis osvojil.',wrong:'Zatím ne. Přečti vysvětlení a zkus to znovu.',back:'Další výzva'}:{headline:'Quizfragen und Rätsel',hint:'',done:'Gelöst',right:'Richtig! Das hast du gelernt.',wrong:'Noch nicht. Lies die Erklärung und versuche es erneut.',back:'Weitere Frage'};
 const quiz=quizzes.find(q=>q.id===selected);
 function answer(index:number){if(!quiz||state.completedQuiz.includes(quiz.id))return;const right=index===quiz.correct;setFeedback({id:quiz.id,right});if(right)onState(solve(state,quiz,index));}
 return <div className="panel-scroll"><h3>🧩 {t.headline}</h3><p>{t.hint}</p>{quiz?<><h4>{quiz[lang].question}</h4>{quiz[lang].options.map((op,i)=><button className="answer-item" onClick={()=>answer(i)} disabled={state.completedQuiz.includes(quiz.id)} key={i}>{op}</button>)}{feedback?.id===quiz.id&&<div className={'feedback '+(feedback.right?'right':'')}><strong>{feedback.right?t.right:t.wrong}</strong><p>{quiz[lang].explanation}</p></div>}<button className="action-link" onClick={()=>{setSelected(null);setFeedback(null)}}>{t.back} →</button></>:quizzes.map(q=><button className="quiz-list-item" key={q.id} onClick={()=>{setSelected(q.id);setFeedback(null)}}><span>{state.completedQuiz.includes(q.id)?'✓':'✧'}</span><span>{q[lang].question}</span><b>+{q.points}</b></button>)}</div>;
}
export function Missions({state,lang}:{state:TownState;lang:Lang}){
 const tasks=[['meet','Poznej prvního obyvatele','Lerne die erste Person kennen'],['discover','Objev doporučené místo','Entdecke einen empfohlenen Ort'],['work','Odpracuj směnu','Arbeite eine Schicht'],['buy','Nakup v pekárně','Kaufe eine Brezel'],['read','Přečti knihu','Lies ein Buch'],['research','Prostuduj webový článek','Lies einen Online-Artikel'],['quiz','Vyřeš hádanku','Löse ein Rätsel']] as const;
 return <div className="panel-scroll"><h3>🎯 {lang==='cs'?'Mise a cíle':'Missionen und Ziele'}</h3>{tasks.filter(x=>x[0]==='meet'||x[0]==='work'||x[0]==='buy'||x[0]==='quiz'||state.discovered.includes('library')).map(([id,cs,de])=><div key={id} className={'mission-line '+(state.completed.includes(id)?'done':'')}><span>{state.completed.includes(id)?'✓':'○'}</span><span>{lang==='cs'?cs:de}</span></div>)}{state.employment==='warned'&&<div className="feedback">{lang==='cs'?'Pozor, v práci evidují absence.':'Achtung, Fehlzeiten wurden registriert.'}</div>}{state.employment==='fired'&&<div className="feedback">{lang==='cs'?'Zaměstnavatel tě propustil.':'Dein Arbeitgeber hat dich entlassen.'}</div>}</div>;
}
export function Phone({state,lang,onState,onAttend}:{state:TownState;lang:Lang;onState:(s:TownState)=>void;onAttend:(s:TownState)=>void}){
 const [tab,setTab]=useState<'events'|'contacts'|'journal'>('events');
 const labels=lang==='cs'?{events:'Události',contacts:'Kontakty',journal:'Deník'}:{events:'Ereignisse',contacts:'Kontakte',journal:'Tagebuch'};
 return <div className="panel-scroll"><div className="phone-tabs">{(['events','contacts','journal'] as const).map(k=><button className={tab===k?'active':''} key={k} onClick={()=>setTab(k)}>{labels[k]}</button>)}</div>
 {tab==='events'?<EventCalendar state={state} lang={lang} onState={onState} onAttend={onAttend}/>:tab==='contacts'?residents.filter(r=>state.known.includes(r.id)).map(r=><div key={r.id} className="phone-line">{r.portrait} {r.name}</div>):(state.journal[lang]||[]).map((s,i)=><div key={i} className="phone-line">{s}</div>)}</div>;
}
