'use client';
import {useState,useEffect} from 'react';
import type {Place,Lang} from '../lib/world';
import {placeNames} from '../lib/world';
export const glyph:Record<Place,string>={bank:'🏦',home:'⌂',street:'🚶',bakery:'☕',square:'♜',work:'▣',library:'▤',market:'🛒',cafe:'☕',park:'🌳',church:'⛪',hotel:'🛏',gym:'🏋',mountains:'⛰',restaurant:'🍽',outfitter:'🧥',pool:'🏊',resort:'🎿'};
export function ArtTown({season}:{season:number}){
 return <svg className={'town-art season-'+season} viewBox="0 0 1000 680" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
 <defs><linearGradient id="sky-art" x2="0" y2="1"><stop stopColor="#e2cba9"/><stop offset=".72" stopColor="#b5d1c8"/><stop offset="1" stopColor="#839c88"/></linearGradient><linearGradient id="river-art" x2="0" y2="1"><stop stopColor="#b4ddcb"/><stop offset="1" stopColor="#3b7c91"/></linearGradient></defs>
 <rect width="1000" height="680" fill="url(#sky-art)"/><path d="M0 210L120 88 226 179 350 35 450 155 570 58 681 172 807 55 930 180 1000 110V340H0Z" fill="#8094a0"/><path d="M0 230L123 118 223 202 355 62 450 180 572 88 680 197 806 88 926 196 1000 149V355H0Z" fill="#e1e9e2"/><path d="M0 276Q130 190 300 257T675 249T1000 225V680H0Z" fill="#547b65"/><path d="M0 336Q150 268 305 328T645 320T1000 293V680H0Z" fill="#8fa875"/><path d="M1000 217Q840 250 803 357T639 458T360 512T110 680" fill="none" stroke="#567c86" strokeWidth="95"/><path d="M1000 217Q840 250 803 357T639 458T360 512T110 680" fill="none" stroke="url(#river-art)" strokeWidth="81"/>
 <path d="M0 473Q210 326 453 392T830 301L1000 357" stroke="#dec5a0" strokeWidth="45" fill="none"/><path d="M0 628Q200 554 395 489T768 573" stroke="#dec5a0" strokeWidth="30" fill="none"/>
 {Array.from({length:24},(_,i)=>{const x=18+(i*83)%944,y=277+(i*61)%290,w=37+(i%4)*11,h=37+(i%3)*13;return <g key={i}><rect x={x} y={y} width={w} height={h} fill={['#e8cda4','#efddbd','#d7bfab','#bacdb4'][i%4]} stroke="#6d5b4d" strokeWidth="2"/><polygon points={`${x-8},${y} ${x+w/2},${y-24} ${x+w+8},${y}`} fill={['#a45d4e','#986653','#b0765b'][i%3]} stroke="#65514b" strokeWidth="2"/><rect x={x+8} y={y+10} width="10" height="14" fill="#7ba2ad"/><rect x={x+w-19} y={y+10} width="10" height="14" fill="#7ba2ad"/></g>})}
 <g transform="translate(596 279)"><rect x="-33" y="-22" width="88" height="105" fill="#f0dfbf" stroke="#86725b" strokeWidth="3"/><polygon points="-46,-22 10,-65 66,-22" fill="#a96956"/><rect y="-113" width="27" height="91" fill="#f0e0bd"/><polygon points="-8,-113 14,-169 36,-113" fill="#68564d"/><circle cx="14" cy="-78" r="8" fill="#729aa4"/><rect x="1" y="25" width="22" height="58" fill="#8c7358"/></g>
 <g transform="translate(490 390)"><ellipse rx="79" ry="24" fill="#ead8b5"/><ellipse rx="38" ry="17" fill="#6cb7c7"/><path d="M0-42V-8" stroke="#efe8d0" strokeWidth="4"/><path d="M-22-15Q0-58 22-15" stroke="#c9eeee" strokeWidth="3" fill="none"/></g>
 {Array.from({length:44},(_,i)=>{const x=(i*91+40)%992,y=320+(i*47)%345;return <g key={i}><path d={`M${x} ${y+20}v20`} stroke="#6b553c" strokeWidth="4"/><circle cx={x} cy={y+5} r={11+i%7} fill={['#557e4f','#83a967','#c48c6a','#8b9d5a','#df9ca0'][i%5]}/></g>})}
 <path d="M519 536Q587 476 661 514" fill="none" stroke="#e6d6b6" strokeWidth="15"/><path d="M519 536Q587 476 661 514" fill="none" stroke="#988979" strokeWidth="2"/>
 </svg>;
}
export const landmarks:{place:Place;x:number;y:number}[]=[
 {place:'home',x:14,y:73},{place:'street',x:48,y:59},{place:'bakery',x:34,y:69},
 {place:'square',x:51,y:43},{place:'work',x:78,y:39},{place:'library',x:31,y:42},
 {place:'market',x:71,y:58},{place:'cafe',x:60,y:52},{place:'park',x:81,y:66},
 {place:'church',x:59,y:30},{place:'hotel',x:17,y:54},{place:'gym',x:86,y:24},
 {place:'mountains',x:72,y:18},{place:'restaurant',x:43,y:49},{place:'outfitter',x:24,y:59},
 {place:'pool',x:19,y:33},{place:'resort',x:86,y:13}
];
export function StreetView({place,lang,season,hour=12}:{place:Place;lang:Lang;season:number;hour?:number}){
 const named:Partial<Record<Place,string>>={home:'home',street:'street',square:'square',library:'library',bakery:'bakery',market:'mall',outfitter:'outfitter',cafe:'cafe',bank:'bank',work:'work'};
 const asset=named[place]??null;
 const [format,setFormat]=useState<'webp'|'svg'>('webp');
 useEffect(()=>setFormat('webp'),[place]);
 if(asset)return <div className={'player-photo-scene season-'+season+' '+(hour>=20||hour<6?'is-night':'')} role="img" aria-label={placeNames[place][lang]}>
   <img src={`/scenes/${asset}.${format}`} alt={placeNames[place][lang]} onError={()=>{if(format==='webp')setFormat('svg')}}/>
   <div className="perspective-label">{glyph[place]} {placeNames[place][lang]}</div>
 </div>;
 const indoor=(['home','bakery','library','market','restaurant','cafe','hotel','work','gym','outfitter'] as Place[]).includes(place);
 const hills=place==='mountains'||place==='resort';
 const pool=place==='pool';
 const sky=season===3?'#bdd5dc':season===2?'#c8bac0':'#b5dce3';
 const label=placeNames[place][lang];
 return <div className={'player-scene-v071 scene-'+place} role="img" aria-label={label}>
  <svg viewBox="0 0 880 380" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
  <defs>
   <linearGradient id="perspectiveSky" x2="0" y2="1"><stop stopColor={sky}/><stop offset="1" stopColor="#f5dfb7"/></linearGradient>
   <linearGradient id="floorPersp" x2="0" y2="1"><stop stopColor="#c7b49a"/><stop offset="1" stopColor="#857969"/></linearGradient>
   <linearGradient id="wallPersp" x2="0" y2="1"><stop stopColor="#e8d3b6"/><stop offset="1" stopColor="#af967c"/></linearGradient>
  </defs>
  {indoor?<g>
   <rect width="880" height="380" fill="url(#wallPersp)"/>
   <path d="M0 0L180 88V268L0 380Z M880 0L700 88V268L880 380Z" fill="#ae937b"/>
   <rect x="180" y="88" width="520" height="200" fill="#ebdac1"/>
   <path d="M0 380L180 268H700L880 380Z" fill="url(#floorPersp)"/>
   <path d="M390 120h115v166H390Z" fill="#a17f5e" stroke="#665849" strokeWidth="9"/>
   <path d="M405 136h85v116h-85Z" fill="#a2c6c4"/>
   <rect x="215" y="125" width="135" height="112" fill="#c3d4d1" stroke="#f5eddc" strokeWidth="11"/>
   <path d="M282 135v96M218 185h129" stroke="#f4efdd" strokeWidth="8"/>
   <rect x="553" y="145" width="102" height="150" fill="#957459" rx="5"/>
   <g fill="#e3cfad">{Array.from({length:3},(_,i)=><rect key={i} x="562" y={154+i*40} width="82" height="8" />)}</g>
   {place==='home'?<g><rect x="255" y="268" width="252" height="70" rx="9" fill="#a5aea1"/><rect x="265" y="249" width="105" height="30" rx="14" fill="#f4ebe0"/><rect x="525" y="238" width="64" height="86" fill="#c9d9d4" stroke="#6f807b" strokeWidth="5"/></g>:<g><rect x="265" y="268" width="360" height="55" rx="7" fill="#8c6c53"/><rect x="292" y="257" width="96" height="18" rx="5" fill="#e1be7f"/><rect x="504" y="255" width="87" height="20" rx="5" fill="#e1be7f"/></g>}
   {place==='library'&&<text x="568" y="208" fontSize="40">📚</text>}
   {place==='restaurant'&&<text x="447" y="288" fontSize="45" textAnchor="middle">🍽️</text>}
   {place==='market'&&<text x="445" y="288" fontSize="45" textAnchor="middle">🛒</text>}
   {place==='work'&&<text x="443" y="284" fontSize="42" textAnchor="middle">💻</text>}
  </g>:<g>
   <rect width="880" height="380" fill="url(#perspectiveSky)"/>
   <path d="M0 190L150 80 285 180 440 70 575 185 730 86 880 170V285H0Z" fill="#819fa0"/>
   <path d="M0 220L150 115 280 204 437 100 573 203 730 125 880 190V300H0Z" fill={season===3?'#e7f0ed':'#a2bc9d'}/>
   <path d="M0 263Q200 220 440 252T880 228V380H0Z" fill="#88a77e"/>
   {hills?<g><path d="M0 325Q230 245 430 318T880 270V380H0Z" fill={season===3?'#e5e9e2':'#537c61'}/><path d="M0 345Q400 276 880 332" stroke="#ccb99a" strokeWidth="21" fill="none"/></g>:
    <g><polygon points="315,240 565,240 805,380 75,380" fill="#ad9d89"/><path d="M440 240V380" stroke="#d2c6b1" strokeWidth="3" strokeDasharray="15 19"/>
     <g><rect x="0" y="132" width="260" height="238" fill="#d4ae82"/><polygon points="-20,132 125,78 280,132" fill="#a16b50"/><rect x="48" y="184" width="57" height="72" fill="#88b9ba" stroke="#f4e6c9" strokeWidth="9"/><rect x="153" y="186" width="60" height="70" fill="#88b9ba" stroke="#f4e6c9" strokeWidth="9"/></g>
     <g><rect x="615" y="127" width="265" height="250" fill="#e6cb9e"/><polygon points="600,127 750,69 903,127" fill="#ad7053"/><rect x="648" y="176" width="61" height="78" fill="#8fc2c8" stroke="#f4e5ca" strokeWidth="9"/><rect x="769" y="183" width="64" height="75" fill="#8fc2c8" stroke="#f4e5ca" strokeWidth="9"/></g>
     <rect x="401" y="178" width="77" height="87" fill="#eddbb5"/><polygon points="392,178 440,134 486,178" fill="#ae7359"/><path d="M430 134V65H453V134" fill="#e4d6ba"/><polygon points="419,66 442,15 465,66" fill="#716a65"/>
    </g>}
   {pool&&<g><ellipse cx="440" cy="305" rx="240" ry="52" fill="#79bdd0" stroke="#e4e7d6" strokeWidth="11"/><path d="M245 307h390" stroke="#ccebe8" strokeWidth="6" strokeDasharray="25 24"/></g>}
   {place==='resort'&&<text x="430" y="297" textAnchor="middle" fontSize="64">{season===3?'🎿':'🚵'}</text>}
   {place==='mountains'&&<text x="432" y="303" textAnchor="middle" fontSize="54">🥾</text>}
  </g>}
  </svg>
  <div className="perspective-label">{glyph[place]} {label}</div>
 </div>;
}
