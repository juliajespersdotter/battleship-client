import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGameContext } from "../contexts/GameContextProvider";
import Battleboard from "../components/Battleboard";
import WaitingRoom from "./WaitingRoom";
import Logo from "../assets/images/logo.png";
// import useSound from "use-sound";
// import waves from "../assets/sounds/waves.mp3";
import "normalize.css";
import "../assets/css/BattleboardPage.css";

const BattleboardPage = () => {
	// const [wavesSound, { stop }] = useSound(waves);

	const [disconnectedMsg, setDisconnectedMsg] = useState(false);
	const [disconnected, setDisconnected] = useState("");
	const [waiting, setWaiting] = useState(true);
	const { gameUsername, socket } = useGameContext();
	const [enemy, setEnemy] = useState();
	const { game_id } = useParams();
	const navigate = useNavigate();
	const [turn, setTurn] = useState();

	// connect to room when component is mounted
	useEffect(() => {
		const handleUpdatePlayers = (playerlist) => {
			// set turn to be the first player in player list
			setTurn(Object.values(playerlist)[0]);

			if (Object.keys(playerlist).length === 2) {
				if (Object.values(playerlist)[0] === gameUsername) {
					setEnemy(Object.values(playerlist)[1]);
				} else {
					setEnemy(Object.values(playerlist)[0]);
				}

				setWaiting(false);
				setDisconnectedMsg(false);

				// update list of games on server to update Login page that this room is closed
				socket.emit("update-list");

				// if player leaves update games on server that this room is now open
			} else if (Object.keys(playerlist).length === 1) {
				setWaiting(true);
				socket.emit("update-list");
			}
		};

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
		});

		// listen for updated userlist
		socket.on("player:list", handleUpdatePlayers);

		socket.on("player:disconnected", (username) => {
			setDisconnected(username);
			setDisconnectedMsg(true);
		});
		return () => {
			// disconnect player
			socket.emit("player:left", gameUsername, game_id);
		};
	}, [socket, game_id, gameUsername, navigate]);

	return (
		<div className="gamewrapper">
			<div className="game-header">
				<div className="game-header-title">
					<div className="game-tagline">
						<img src={Logo} alt="" />
					</div>

					<div className="room-name">
						<p className="room-name-tagline">{game_id}</p>
					</div>
					{disconnectedMsg && <p>{disconnected} disconnected</p>}
				</div>
			</div>

			{waiting && (
				<div>
					<WaitingRoom />
				</div>
			)}

			{!waiting && (
				<>
					<Battleboard
						yourName={gameUsername}
						enemy={enemy}
						WhoseTurn={turn}
					/>
				</>
			)}
		</div>
	);
};

export default BattleboardPage;
