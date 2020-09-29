import {GameServer} from './GameServer';


test('join a waiting game.', () => {
    let gameServer = new GameServer();
    gameServer.join('PLAYER_ONE','Jack');
    gameServer.join('PLAYER_TWO','Heidrun');
    expect(gameServer.queue.size).toBe(2);
});

test('assign players to game', () => {
    let gameServer = new GameServer();
    GameServer.MAX_PLAYERS = 4;
    
    /* Add some players to the queue.*/
    gameServer.join('PLAYER_0','Jack');
    gameServer.join('PLAYER_1','Heidrun');
    gameServer.join('PLAYER_2','Bill');
    gameServer.join('PLAYER_3','Rene');
    gameServer.join('PLAYER_4','Rainer');
    gameServer.join('PLAYER_5','Erika');
    gameServer.join('PLAYER_6','Alyce');
    gameServer.join('PLAYER_7','Andrew');
    gameServer.join('PLAYER_8','Misha');
    gameServer.join('PLAYER_9','Emily');
    gameServer.join('PLAYER_10','Rachel');
    gameServer.join('PLAYER_11','John');
    expect(gameServer.queue.size).toBe(12);

    /* Move the last set of players to the back of the queue. */
    gameServer.putPlayersOnField();
    expect(gameServer.field.length).toBe(GameServer.MAX_PLAYERS)
    
    expect(gameServer.field[0].uuid).toBe('PLAYER_0');
    expect(gameServer.field[0].inField).toBe(true);
    expect(gameServer.queue.get('PLAYER_0')!.inField).toBe(true);

    expect(gameServer.field[1].uuid).toBe('PLAYER_1');
    expect(gameServer.field[1].inField).toBe(true);
    expect(gameServer.queue.get('PLAYER_1')!.inField).toBe(true);

    expect(gameServer.field[2].uuid).toBe('PLAYER_2');
    expect(gameServer.field[2].inField).toBe(true);
    expect(gameServer.queue.get('PLAYER_2')!.inField).toBe(true);

    expect(gameServer.field[3].inField).toBe(true);
    expect(gameServer.field[3].uuid).toBe('PLAYER_3');
    expect(gameServer.queue.get('PLAYER_3')!.inField).toBe(true);

    expect(gameServer.queue.get('PLAYER_4')!.inField).toBe(false);
});


test('move first n player to back of queue', () => {
    let gameServer = new GameServer();
    GameServer.MAX_PLAYERS = 4;
    
    /* Add some players to the queue.*/
    gameServer.join('PLAYER_0','Jack');
    gameServer.join('PLAYER_1','Heidrun');
    gameServer.join('PLAYER_2','Bill');
    gameServer.join('PLAYER_3','Rene');
    gameServer.join('PLAYER_4','Rainer');
    gameServer.join('PLAYER_5','Erika');
    gameServer.join('PLAYER_6','Alyce');
    gameServer.join('PLAYER_7','Andrew');
    gameServer.join('PLAYER_8','Misha');
    gameServer.join('PLAYER_9','Emily');
    gameServer.join('PLAYER_10','Rachel');
    gameServer.join('PLAYER_11','John');
    
    /* Rotate the current players to the back of the queue. */
    gameServer.putPlayersOnField();
    gameServer.moveToBackOfQueue();

    /* Confirm the last set of player are move to the back of the queue. */
    let i = 0;
    for (let uuid of gameServer.queue.keys()) {
        if(i===0) expect(uuid).toBe('PLAYER_4');
        if(i===1) expect(uuid).toBe('PLAYER_5');
        if(i===2) expect(uuid).toBe('PLAYER_6');
        if(i===3) expect(uuid).toBe('PLAYER_7');
        if(i===4) expect(uuid).toBe('PLAYER_8');
        if(i===5) expect(uuid).toBe('PLAYER_9');
        if(i===6) expect(uuid).toBe('PLAYER_10');
        if(i===7) expect(uuid).toBe('PLAYER_11');
        if(i===8) expect(uuid).toBe('PLAYER_0');
        if(i===9) expect(uuid).toBe('PLAYER_1');
        if(i===10) expect(uuid).toBe('PLAYER_2');
        if(i===11) expect(uuid).toBe('PLAYER_3');
        i++;
    }
});

test('rotate players for the next game', () => {
    let gameServer = new GameServer();
    GameServer.MAX_PLAYERS = 4;
    
    /* Add some players to the queue.*/
    gameServer.join('PLAYER_0','Jack');
    gameServer.join('PLAYER_1','Heidrun');
    gameServer.join('PLAYER_2','Bill');
    gameServer.join('PLAYER_3','Rene');
    gameServer.join('PLAYER_4','Rainer');
    gameServer.join('PLAYER_5','Erika');
    gameServer.join('PLAYER_6','Alyce');
    gameServer.join('PLAYER_7','Andrew');
    gameServer.join('PLAYER_8','Misha');
    gameServer.join('PLAYER_9','Emily');
    gameServer.join('PLAYER_10','Rachel');
    gameServer.join('PLAYER_11','John');
    
    /* Rotate the current players to the back of the queue. */
    gameServer.putPlayersOnField();
    gameServer.nextGame();
    
    expect(gameServer.field.length).toBe(GameServer.MAX_PLAYERS)
    
    expect(gameServer.field[0].uuid).toBe('PLAYER_4');
    expect(gameServer.field[0].inField).toBe(true);
    expect(gameServer.queue.get('PLAYER_4')!.inField).toBe(true);

    expect(gameServer.field[1].uuid).toBe('PLAYER_5');
    expect(gameServer.field[1].inField).toBe(true);
    expect(gameServer.queue.get('PLAYER_5')!.inField).toBe(true);

    expect(gameServer.field[2].uuid).toBe('PLAYER_6');
    expect(gameServer.field[2].inField).toBe(true);
    expect(gameServer.queue.get('PLAYER_6')!.inField).toBe(true);

    expect(gameServer.field[3].inField).toBe(true);
    expect(gameServer.field[3].uuid).toBe('PLAYER_7');
    expect(gameServer.queue.get('PLAYER_7')!.inField).toBe(true);

    expect(gameServer.queue.get('PLAYER_8')!.inField).toBe(false);
});
