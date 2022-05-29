import Gameboard from "./Gameboard";
import { useEffect, useState } from 'react'
import { useGameContext } from "../contexts/GameContextProvider";
import { useParams } from "react-router-dom";

const Battleboard = ({yourName, enemy, WhoseTurn}) => {
    const { socket } = useGameContext();
    const { game_id } = useParams();
    
   
    const [yourTurn, setTurn] = useState();
    const [disabled, setDisabled] = useState(true);


  
    const [board, setBoard] = useState(Array(100).fill(null));
    const [shipTwo, setShipTwo] = useState([]);
    const [shipTwoSecond, setShipTwoSecond] = useState([]);
    const [shipThree, setShipThree] = useState([]);
    const [shipFour, setShipFour] = useState([]);
    const [shipRemain, setShipRemain] = useState([]);
    // const [winner, setWinner] = useState('hide');

    const [boardEnemy, setBoardEnemy] = useState(Array(100).fill(null));
    const [shipTwoEnemy, setShipTwoEnemy] = useState([]);
    const [shipTwoSecondEnemy, setShipTwoSecondEnemy] = useState([]);
    const [shipThreeEnemy, setShipThreeEnemy] = useState([]);
    const [shipFourEnemy, setShipFourEnemy] = useState([]);
    const [shipRemainEnemy, setShipRemainEnemy] = useState([]);
    const [winnerEnemy, setWinnerEnemy] = useState('hide');
  
    const [hitShip, setHitShip] = useState([]);
    const [missedShip] = useState([]);
    
    // const [missedShip, setMissedShip] = [{}];

    const [startGame, setStartGame] = useState(false);

    // const players = [yourName, enemy];

    // let randomPlayer =  Math.floor(Math.random() * 1);

    const getRandomPosition = (array) => {

        let random = Math.floor(Math.random() * 100);
        if (array.length === 10) {
            if (array.indexOf(random) !== -1) {
                return ++random;
            }
            else {
                return random;
            }
        }
        if (array.length === 20) {
            if (array.indexOf(random) !== -1) {
                random++;
                if (array.indexOf(random) !== -1) {
                    return ++random;
                }
            }
            else {
                return random;
            }
        }
        if (array.length === 30) {
            if (array.indexOf(random) !== -1) {
                random++;
                if (array.indexOf(random) !== -1) {
                    random++;
                }
                if (array.indexOf(random) !== -1) {
                    return ++random;
                }
            }
            else {
                return random;
            }
        }
    }

    const ship2 = () => {
        const startPos = getRandomPosition([9, 19, 29, 39, 49, 59, 69, 79, 89, 99]);
        return [startPos, startPos + 1]
    }
    const ship3 = () => {
        const startPos = getRandomPosition([8, 9, 18, 19, 28, 29, 38, 39, 48, 49, 58, 59, 68, 69, 78, 79, 88, 89, 98, 99]);
        return [startPos, startPos + 1, startPos + 2];
    }
    const ship4 = () => {
        const startPos = getRandomPosition([7, 8, 9, 17, 18, 19, 27, 28, 29, 37, 38, 39, 47, 48, 49, 57, 58, 59, 67, 68, 69, 77, 78, 79, 87, 88, 89, 97, 98, 99]);
        return [startPos, startPos + 1, startPos + 2, startPos + 3];
    }

    
   
    const setShips = () => {
        setShipRemain([1,2,3,4])
        setShipRemainEnemy([1,2,3,4])
        let isReady = true;
        while (isReady) {
            let boardCopy = [...board];
            const skepp2 = ship2();
            if (boardCopy[skepp2[0]] === null && boardCopy[skepp2[1]] === null) {
                boardCopy[skepp2[0]] = 'ship2';
                boardCopy[skepp2[1]] = 'ship2';
            }

            let skepp2Second = ship2();
            if (boardCopy[skepp2Second[0]] === null && boardCopy[skepp2Second[1]] === null) {
                boardCopy[skepp2Second[0]] = 'ship2Second';
                boardCopy[skepp2Second[1]] = 'ship2Second';
            }

            let skepp3 = ship3();
            if (boardCopy[skepp3[0]] === null && boardCopy[skepp3[1]] === null && boardCopy[skepp3[2]] === null) {
                boardCopy[skepp3[0]] = 'ship3';
                boardCopy[skepp3[1]] = 'ship3';
                boardCopy[skepp3[2]] = 'ship3';
            }

            let skepp4 = ship4();
            if (boardCopy[skepp4[0]] === null && boardCopy[skepp4[1]] === null && boardCopy[skepp4[2]] === null && boardCopy[skepp4[3]] === null) {
                boardCopy[skepp4[0]] = 'ship4';
                boardCopy[skepp4[1]] = 'ship4';
                boardCopy[skepp4[2]] = 'ship4';
                boardCopy[skepp4[3]] = 'ship4';
            }

            if (boardCopy[skepp3[0]] === 'ship3' && boardCopy[skepp2Second[0]] === 'ship2Second' && boardCopy[skepp4[0]] === 'ship4') {
                setShipTwo([ skepp2[0], skepp2[1]]);
                setShipTwoSecond([skepp2Second[0],skepp2Second[1]]);
                setShipThree([skepp3[0],skepp3[1], skepp3[2]]);
                setShipFour([skepp4[0],skepp4[1], skepp4[2], skepp4[3]]);
                setBoard(boardCopy);
                setStartGame(true);
                isReady = false;
            }
        }
    }


const handleEnemyClick = (index) => {
   
    let boardCopy = [...board];
    const whichShip = boardCopy[index];
    console.log('whichship', whichShip)
    if(boardCopy[index] !== null){
        boardCopy[index] = "hitShip";
        if(whichShip === 'ship3'){
            if(shipThree.indexOf(index) !== -1){
    
                const shipIndex = shipThree.indexOf(index);
                shipThree.splice(shipIndex,1);
                if(shipThree.length === 0){
                    shipRemain.pop();
                }
              }
              console.log('shipThree', shipThree)
              console.log('shipremain', shipRemain)
            }
    }
    if(boardCopy[index] === null){
        boardCopy[index] = "missShip";
    }
  
       setBoard(boardCopy);
       setHitShip([]);
       setTurn(yourName);
       setDisabled(false);
}

socket.on('get-enemy-click-hit', handleEnemyClick)

    const handleClick = i => {
        if(disabled === false) {
        const boardCopy = [...boardEnemy];
        if(boardCopy[i] !== null) {
            hitShip[0] = game_id;
            hitShip[1] = i;
            if(boardCopy[i] === 'ship3Enemy'){
                boardCopy[i] = "hitShip";
                const index = shipThreeEnemy.indexOf(i);
                shipThreeEnemy.splice(index,1);
                if(shipThreeEnemy.length === 0){
                    shipRemainEnemy.pop();
                }
            }
            if(boardCopy[i] === 'ship4Enemy'){
                boardCopy[i] = "hitShip";
                const index = shipFourEnemy.indexOf(i);
                shipFourEnemy.splice(index,1);
                if(shipFourEnemy.length === 0){
                    shipRemainEnemy.pop();
                } 
            }
            if(boardCopy[i] === 'ship2Enemy'){
                boardCopy[i] = "hitShip";
                const index = shipTwoEnemy.indexOf(i);
                shipTwoEnemy.splice(index,1);
                if(shipTwoEnemy.length === 0){
                    shipRemainEnemy.pop();
                } 
            }
            if(boardCopy[i] === 'ship2SecondEnemy'){
                boardCopy[i] = "hitShip";
                const index = shipTwoSecondEnemy.indexOf(i);
                shipTwoSecondEnemy.splice(index,1);
                if(shipTwoSecondEnemy.length === 0){
                    shipRemainEnemy.pop();
                } 
            }
            if(shipRemainEnemy.length === 0) {
                    setWinnerEnemy('winner')
            }
            
            socket.emit('click-data-hit', hitShip);
            
        }
        else {
            boardCopy[i] = "missShip";
            socket.emit('click-data-hit', missedShip);
        }
        setBoardEnemy(boardCopy);
        setTurn(enemy);
        setDisabled(true);
        }
        
    }



   useEffect(() => {

    if(startGame === false) {
        setShips()
    }

   if(startGame === true) {
    socket.on('get-ship-data', (shipp1, shipp2, shipp3, shipp4) => {
        let boardCopyEnemy = [...boardEnemy];
        setShipTwoEnemy(shipp1);
        boardCopyEnemy[shipp1[0]] = 'ship2Enemy';
        boardCopyEnemy[shipp1[1]] = 'ship2Enemy';
        setShipTwoSecondEnemy(shipp2);
        boardCopyEnemy[shipp2[0]] = 'ship2SecondEnemy';
        boardCopyEnemy[shipp2[1]] = 'ship2SecondEnemy';
        setShipThreeEnemy(shipp3);
        boardCopyEnemy[shipp3[0]] = 'ship3Enemy';
        boardCopyEnemy[shipp3[1]] = 'ship3Enemy';
        boardCopyEnemy[shipp3[2]] = 'ship3Enemy';
        setShipFourEnemy(shipp4);
        boardCopyEnemy[shipp4[0]] = 'ship4Enemy';
        boardCopyEnemy[shipp4[1]] = 'ship4Enemy';
        boardCopyEnemy[shipp4[2]] = 'ship4Enemy';
        boardCopyEnemy[shipp4[3]] = 'ship4Enemy';
        setBoardEnemy(boardCopyEnemy);
    })
    
    setStartGame(null);
   }
   socket.emit('ship-data', game_id, shipTwo, shipTwoSecond, shipThree, shipFour)
    // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [startGame])

   useEffect(() => {
    setTurn(WhoseTurn);
    if(WhoseTurn === yourName) {
        setDisabled(false);
    }
   }, [WhoseTurn, yourName]);

  
    

    return (
        <>
            <h2 className="whose-turn">Whose turn? {yourTurn}</h2>
            <div className="game-container">
               
            <div className="game-board game-board-enemy">
               <h3 className="game-title game-title-you">Enemy: {enemy}</h3>
               <p className={winnerEnemy}>Congrats! You win!</p>
               <p className="ships-remain-text">Ships remaining: <span className="ships-remain-text-bold">{shipRemainEnemy.length}</span></p>
               <div className="game-wrapper game-wrapper-enemy">
               <Gameboard  squares={boardEnemy} onClick={handleClick}/>
                </div>
               </div>
                <div className="game-board game-board-you">
                    <h3 className="game-title game-title-you">You: {yourName}</h3>
                    {/* <p className={winner}>Congrats! You win!</p> */}
                    <p className="ships-remain-text">Ships remaining: <span className="ships-remain-text-bold">{shipRemain.length}</span></p>
                    <div className="game-wrapper game-wrapper-you">
                        <Gameboard squares={board}/>
                    </div>
                    
                </div>
               
            </div>
        </>
    );
}

export default Battleboard;

// onClick={ disabled ? null : handleClick}/>