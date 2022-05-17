import Gameboard from "./Gameboard";

const Battleboard = () => {
    return ( 
        <>
           <div className="game-container">
               <div className="game-board game-board-you">
               <h3 className="game-title game-title-you">You</h3>
               <div className="game-wrapper game-wrapper-you">
               <Gameboard />
                </div>
               </div>
               <div className="game-board game-board-enemy">
               <h3 className="game-title game-title-you">Enemy</h3>
               <div className="game-wrapper game-wrapper-enemy">
               <Gameboard />
                </div>
               </div>
            </div>
        </>
     );
}
 
export default Battleboard;