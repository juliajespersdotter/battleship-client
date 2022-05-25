import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameContext } from "../contexts/GameContextProvider";
import Battleboard from "../components/Battleboard";
import 'normalize.css';
import "../assets/css/BattleboardPage.css"

const BattleboardPage = () => {
	// const [players, setPlayers] = useState([]);
	// const [connected, setConnected] = useState(false);
	const [waiting, setWaiting] = useState(true);
	const { gameUsername, socket } = useGameContext();
	const [enemy, setEnemy] = useState();
	const { game_id } = useParams();
	const navigate = useNavigate();

	const handleUpdatePlayers = (playerlist) => {
		console.log("Got new playerlist", playerlist);
		// setPlayers(playerlist);
		
		if (Object.keys(playerlist).length === 2) {
			if(Object.values(playerlist)[0] === gameUsername){
				
					setEnemy(Object.values(playerlist)[1])
				
			}
			else {
				
					setEnemy(Object.values(playerlist)[0])
			
			}
			
			setWaiting(false);
			
			socket.emit("update-list");
			
			
		
		} else if (Object.keys(playerlist).length === 1) {
			setWaiting(true);
			socket.emit("update-list");
		}
	};
	

	// connect to room when component is mounted
	useEffect(() => {
		// if no username, redirect them to the login page
		if (!gameUsername) {
			navigate("/");
			return;
		}

		// emit join request
		socket.emit("player:joined", gameUsername, game_id, (status) => {
			console.log(
				`Successfully joined ${game_id} as ${gameUsername}`,
				status
			);
		
			// setConnected(true);
		});

		// listen for updated userlist
		
		socket.on("player:list", handleUpdatePlayers);
		
		

		return () => {
			console.log("Running cleanup");

			// socket.off("player:list", handleUpdatePlayers);

			// disconnect player
			socket.emit("player:left", gameUsername, game_id);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, game_id, gameUsername, navigate]);

	return (
		<div className="gamewrapper">

			<div className="game-header">
				<h1 className="game-tagline">Let's Battleship</h1>
				{waiting && 
				<p>Waiting for player...</p>}
				{/* <div id="players">
					<h2>Players</h2>
					<ul className="online-players">
						
					<li>You: {gameUsername}</li>
					<li>Enemy: {enemy}</li>
					</ul>
				</div> */}
				
				
			</div>	

			{!waiting && (
				<>
					{/* <p>Game is starting!</p> */}
					<Battleboard yourName={gameUsername} enemy={enemy}/>
				
				</>
			)}
		</div>
	);
};

export default BattleboardPage;
