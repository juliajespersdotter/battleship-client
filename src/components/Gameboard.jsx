import Square from "./Square";

const Gameboard = ({squares, onClick}) => {


    return ( 
       
       <>
       {squares.map((square, i) => (
           <Square key={i} value={square} onClick={() => onClick(i)}/>
       ))}
        {/* <div className="box"></div>
               <div className="box"></div>
               <div className="box"></div>
               <div className="box"></div>
               <div className="box"></div>
               <div className="box"></div>
               <div className="box"></div>
               <div className="box"></div>
               <div className="box"></div>
               <div className="box"></div> */}
       
       </>  
         );
        }
         
export default Gameboard;