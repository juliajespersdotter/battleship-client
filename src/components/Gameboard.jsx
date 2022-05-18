import Square from "./Square";

const Gameboard = ({squares, onClick}) => {


    return ( 
       
       <>
       {squares.map((square, i) => (
           <Square key={i} value={square} onClick={() => onClick(i)}/>
       ))}
       
       </>  
         );
        }
         
export default Gameboard;