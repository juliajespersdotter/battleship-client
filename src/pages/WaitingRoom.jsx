import loading from "../assets/images/water_loader.gif"
import "../assets/css/WaitingRoom.css"

const WaitingRoom = () => {
	return (
		<div className="loadingRoom">
			<h2 className="loadingRoom-tagline">Waiting for player...</h2>
			<img className="loadingRoom-img" src={loading} alt="waiting img" />
		</div>
	
	);
};

export default WaitingRoom;
