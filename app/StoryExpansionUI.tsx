'use client';
import type {TownState,Lang} from '../lib/world';
import {playableScene,applyStoryChoice} from '../lib/storyExpansion';
export function StoryExpansionPanel({state,lang,onState}:{state:TownState;lang:Lang;onState:(s:TownState)=>void}){
 const story=playableScene(state);
 if(!story)return null;
 return <section className="life-object story-expansion">
  <h4>✦ {lang==='cs'?'Něco se právě děje':'Etwas geschieht gerade'}</h4>
  <p>{story[lang]}</p>
  <div className="story-choice-list">{story.choices.map(c=><button key={c.id} onClick={()=>onState(applyStoryChoice(state,story.id,c.id))}>{c[lang]}</button>)}</div>
 </section>;
}
