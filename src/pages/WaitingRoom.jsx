import loading from "../assets/images/water-loading2.gif"
import "../assets/css/WaitingRoom.css"

const WaitingRoom = () => {
	return (
		<div className="loadingRoom">
			<div className="loadingRoom-wrapper">
				<h2 className="loadingRoom-tagline">Waiting for player...</h2>
				<img className="loadingRoom-img" src={loading} alt="waiting img" />
			</div>

			<div className="exitBtn">
				<button className="exitBtn-primary" onClick={() => window.location.reload(false)}>Click to exit</button>
			</div>		
		</div>
	
	);
};

export default WaitingRoom;