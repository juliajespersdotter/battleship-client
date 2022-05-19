import Gameboard from "./Gameboard";
import { useEffect, useState } from 'react'

const Battleboard = ({ socket }) => {


    const [board, setBoard] = useState(Array(100).fill(null));
    const [shipTwo, setShipTwo] = useState([]);
    const [shipTwoSecond, setShipTwoSecond] = useState([]);
    const [shipThree, setShipThree] = useState([]);
    const [shipFour, setShipFour] = useState([]);
    const [shipRemain, setShipRemain] = useState([]);
    const [winner, setWinner] = useState('hide');

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
                isReady = false;
            }

        }
    }

    useEffect(() => {

        setShips()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handleClick = i => {

        const boardCopy = [...board];
        
        if(boardCopy[i] !== null) {
           
            if(boardCopy[i] === 'ship3'){
                boardCopy[i] = "hitShip";
                const index = shipThree.indexOf(i);
                shipThree.splice(index,1);
                if(shipThree.length === 0){
                    shipRemain.pop();
                }
            }
            if(boardCopy[i] === 'ship4'){
                boardCopy[i] = "hitShip";
                const index = shipFour.indexOf(i);
                shipFour.splice(index,1);
                if(shipFour.length === 0){
                    shipRemain.pop();
                } 
            }
            if(boardCopy[i] === 'ship2'){
                boardCopy[i] = "hitShip";
                const index = shipTwo.indexOf(i);
                shipTwo.splice(index,1);
                if(shipTwo.length === 0){
                    shipRemain.pop();
                } 
            }
            if(boardCopy[i] === 'ship2Second'){
                boardCopy[i] = "hitShip";
                const index = shipTwoSecond.indexOf(i);
                shipTwoSecond.splice(index,1);
                if(shipTwoSecond.length === 0){
                    shipRemain.pop();
                } 
            }
            if(shipRemain.length === 0) {
                    setWinner('winner')
            }
        }
        else {
            boardCopy[i] = "missShip";
        }
        
        setBoard(boardCopy);
    }

    return (
        <>
            <div className="game-container">
                <div className="game-board game-board-you">
                    <h3 className="game-title game-title-you">You</h3>
                    <p className={winner}>Congrats! You win!</p>
                    <p className="ships-remain-text">Ships remaining: <span className="ships-remain-text-bold">{shipRemain.length}</span></p>
                    <div className="game-wrapper game-wrapper-you">
                        <Gameboard squares={board} onClick={handleClick} />
                    </div>
                    
                </div>
                {/* <div className="game-board game-board-enemy">
               <h3 className="game-title game-title-you">Enemy</h3>
               <div className="game-wrapper game-wrapper-enemy">
               <Gameboard  squares={board} onClick={handleClick}/>
                </div>
               </div> */}
            </div>
        </>
    );
}

export default Battleboard;