export type Weather='sun'|'cloud'|'rain'|'storm'|'snow';
export type Forecast={day:number;kind:Weather;temperature:number;symbol:string};
const symbols:Record<Weather,string>={sun:'☀️',cloud:'⛅',rain:'🌧️',storm:'⛈️',snow:'🌨️'};
export function weatherAt(day:number):Forecast{
 const season=Math.floor(day/14)%4;
 const seed=((day+13)*37+day*day*11)%100;
 const kind:Weather=season===3?(seed<27?'snow':seed<58?'cloud':seed<85?'sun':'rain'):seed<12?'storm':seed<35?'rain':seed<62?'cloud':'sun';
 const baseline=[15,25,12,-1][season];
 const temperature=baseline+((day*7+19)%11)-5;
 return {day,kind,temperature,symbol:symbols[kind]};
}
export const forecast=(day:number)=>Array.from({length:10},(_,i)=>weatherAt(day+i));
export const weatherLabel=(kind:Weather,lang:'cs'|'de')=>{
 const names={cs:{sun:'Slunečno',cloud:'Oblačno',rain:'Déšť',storm:'Bouřka',snow:'Sněžení'},de:{sun:'Sonnig',cloud:'Bewölkt',rain:'Regen',storm:'Gewitter',snow:'Schnee'}};
 return names[lang][kind];
};
