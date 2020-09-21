import * as React from 'react';
import {GameMap} from '@7up/common-types';



interface GameBoardProp {
	rows:number, /* The game boards row count. */
	cols:number,  /* The game boards column count. */
	gameMap:GameMap,
	id?:string
}

/**
 * Renders the game board.
 */
class GameBoard extends React.Component<GameBoardProp> {
	/**
	 * Render one row of the game board.
	 */
	private createRow(row,n) {
		var td = [];
		for(var i = 0; i < n; i++){
			let id = "g_" + i + '_' + row;
			let className = null;
			let tile = this.props.gameMap.get(id);
			if(tile)
			{
				className = tile.class;
			}
			
			td.push(<td key={id} id={id} className={className}>{`${i}, ${row}`}</td>)
		}

		return (<tr key={`r_${row}`}>{td}</tr>)
	}

	public render() {		
		var rows = [];
		for(var i = 0; i < this.props.rows; i++){
			rows.push(this.createRow(i,this.props.cols));
		}
				
		return(
		<div id={this.props.id} className="gameMap">
        	<table>
				<tbody>
					{rows}
				</tbody>			
			</table>						
		</div>
        )
    }
}

export default GameBoard;