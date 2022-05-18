
const Square = ({value,onClick}) => {
   
    return (
        <div className='box' onClick={onClick} style={{backgroundColor:value}}></div>
    )
}
  
export default Square;

