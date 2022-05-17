import Gameboard from "./Gameboard";
import { useEffect, useState } from 'react'

const Battleboard = ({socket}) => {

    // const [color, setColor] = useState('blue');
    const [board, setBoard] = useState(Array(100).fill(null));
    // const [isNext, setIsNext] = useState(true);
    // const getRandomPosition = () => {
    //     return Math.floor(Math.random() * 10) + 1;
    // }
    
    
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