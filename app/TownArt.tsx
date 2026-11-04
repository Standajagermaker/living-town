'use client';
import type {Place,Lang} from '../lib/world';
import {placeNames} from '../lib/world';
export const glyph:Record<Place,string>={home:'⌂',street:'🚶',bakery:'☕',square:'♜',work:'▣',library:'▤',market:'🛒',cafe:'☕',park:'🌳',church:'⛪',hotel:'🛏',gym:'🏋',mountains:'⛰',restaurant:'🍽',outfitter:'🧥'};
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
 {place:'mountains',x:72,y:18},{place:'restaurant',x:43,y:49},{place:'outfitter',x:24,y:59}
];
export function StreetView({place,lang,season}:{place:Place;lang:Lang;season:number}){
 return <div className={'player-street scene-'+place+' season-'+season}>
 <div className="player-sky"/><div className="player-mountains"/><div className="player-left"><i/><i/><b/></div><div className="player-right"><i/><i/><b/></div><div className="player-road"/><span className="player-tree">🌳</span><div className="perspective-label">{glyph[place]} {placeNames[place][lang]}</div></div>;
}
