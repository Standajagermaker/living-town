'use client';
import {useState} from 'react';
import type {TownState,Lang} from '../lib/world';
export function DeepDialogue083({state,lang,onSend,busy}:{state:TownState;lang:Lang;onSend:(t:string)=>Promise<void>;busy:boolean}){
 const [open,setOpen]=useState(false);const id=state.selectedNpc,c=id?state.conversations[id]:null;if(!c?.open||!id)return null;
 const intro=c.asked.includes('name')&&(c.asked.includes('about')||c.asked.includes('job'));
 const trust=state.social.bonds[id]?.trust??0;
 const arr=intro?[['Na co jsi v životě nejvíc hrdý?','Worauf bist du am meisten stolz?'],['Co bys chtěl jednou změnit?','Was würdest du gern ändern?'],['Kdy jsi naposledy pochyboval?','Wann hast du zuletzt gezweifelt?'],['Chceš o tom vůbec mluvit?','Möchtest du überhaupt darüber reden?'],['Co ti pomáhá, když toho máš moc?','Was hilft dir bei Stress?']]:[['Co tě sem přivedlo?','Was führt dich hierher?'],['Jak dlouho tady pracuješ?','Wie lange arbeitest du hier?'],['Co děláš ve volném čase?','Was machst du in deiner Freizeit?']];
 return <div className="dialogue-extra"><button disabled={busy} onClick={()=>setOpen(v=>!v)}>{open?'− ':'+ '}{lang==='cs'?'Další témata':'Weitere Themen'}</button>{open&&<div className="story-choice-list">{arr.slice(0,trust>=15?5:3).map(([cs,de],i)=><button key={i} disabled={busy} onClick={()=>onSend(lang==='cs'?cs:de)}>{lang==='cs'?cs:de}</button>)}</div>}</div>;
}
