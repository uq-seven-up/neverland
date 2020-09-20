export interface Timezone {
    id:number,
    label:string,
    name:string,
}

export interface GameTile{
	id:string,
	x:number,
	y:number,
	class:string
}

export type GameMap = Map<string,GameTile>;
