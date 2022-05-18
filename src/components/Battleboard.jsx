import Gameboard from "./Gameboard";
import { useEffect, useState } from 'react'

const Battleboard = ({ socket }) => {


    const [board, setBoard] = useState(Array(100).fill(null));


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

        let isReady = true;

        while (isReady) {
            let boardCopy = [...board];
            const skepp2 = ship2();
            if (boardCopy[skepp2[0]] === null && boardCopy[skepp2[1]] === null) {
                boardCopy[skepp2[0]] = 'green';
                boardCopy[skepp2[1]] = 'green';
            }

            let skepp2Second = ship2();
            if (boardCopy[skepp2Second[0]] === null && boardCopy[skepp2Second[1]] === null) {
                boardCopy[skepp2Second[0]] = 'green';
                boardCopy[skepp2Second[1]] = 'green';
            }

            let skepp3 = ship3();
            if (boardCopy[skepp3[0]] === null && boardCopy[skepp3[1]] === null && boardCopy[skepp3[2]] === null) {
                boardCopy[skepp3[0]] = 'yellow';
                boardCopy[skepp3[1]] = 'yellow';
                boardCopy[skepp3[2]] = 'yellow';
            }

            let skepp4 = ship4();
            if (boardCopy[skepp4[0]] === null && boardCopy[skepp4[1]] === null && boardCopy[skepp4[2]] === null && boardCopy[skepp4[3]] === null) {
                boardCopy[skepp4[0]] = 'orange';
                boardCopy[skepp4[1]] = 'orange';
                boardCopy[skepp4[2]] = 'orange';
                boardCopy[skepp4[3]] = 'orange';
            }

            if (boardCopy[skepp3[0]] === 'yellow' && boardCopy[skepp2Second[0]] === 'green' && boardCopy[skepp4[0]] === 'orange') {
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
        // boardCopy[i] = isNext ? "red" : "blue"
        boardCopy[i] = "lightcoral"
        setBoard(boardCopy);
        // setIsNext(false)
    }




    return (
        <>
            <div className="game-container">
                <div className="game-board game-board-you">
                    <h3 className="game-title game-title-you">You</h3>
                    <div className="game-wrapper game-wrapper-you">
                        <Gameboard squares={board} onClick={handleClick} />
                    </div>
                </div>
                {/* <div className="game-board game-board-enemy">
               <h3 className="game-title game-title-you">Enemy</h3>
               <div className="game-wrapper game-wrapper-enemy">
               <Gameboard  squares={board} onClick={handleClick} color={color}/>
                </div>
               </div> */}
            </div>
        </>
    );
}

export default Battleboard;