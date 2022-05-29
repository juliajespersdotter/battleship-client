
const Square = ({value,onClick}) => {
   
    return (
        <div className={`box ${value}`} onClick={onClick}></div>
    )
}
  
export default Square;

