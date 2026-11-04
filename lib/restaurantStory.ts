// Hidden slice-of-life story: no objectives, progress bars, or spoilers in the UI.
export const restaurantCast={waitress:'npc-47',chef:'npc-48',owner:'npc-50'} as const;
export type RestaurantStory={
 chefCalled:boolean;ownerCalled:boolean;mealComplaint:boolean;mealDay:number;
 lastDrinkDay:number;conversationsAtTable:number;gossipHeard:boolean;secretHeard:boolean;
};
export const initialRestaurantStory=():RestaurantStory=>({
 chefCalled:false,ownerCalled:false,mealComplaint:false,mealDay:-1,
 lastDrinkDay:-1,conversationsAtTable:0,gossipHeard:false,secretHeard:false
});
export function restaurantOpen(minute:number){return minute>=11*60&&minute<22*60;}
export function foodTrouble(day:number,minute:number){
 // A real incident with an occasional long-running consequence, not a guaranteed daily quest.
 return ((day*13+Math.floor(minute/60)*7+5)%6)===2;
}
