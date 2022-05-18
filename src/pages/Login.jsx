import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../contexts/GameContextProvider";

const Homepage = () => {
	const [username, setUsername] = useState("");
	const [game, setGame] = useState();
	const [customGame, setCustomGame] = useState();
	const [gamelist, setGamelist] = useState([]);
	const { setGameUsername, socket } = useGameContext();
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		// set game username
		setGameUsername(username);

		// redirect to game
		if (customGame) {
			navigate(`/games/${customGame}`);
		} else {
			navigate(`/games/${game}`);
		}
	};

	socket.on("new-game-list", () => {
		socket.emit("get-game-list", (games) => {
			const list = games.filter((game) => game.id);
			setGamelist(list);
		});
	});

	// as soon as the component is mounted, request room list
	useEffect(() => {
		console.log("Requesting game list from server...");

		socket.emit("get-game-list", (games) => {
			const list = games.filter((game) => game.id);
			setGamelist(list);
		});
	}, [socket]);

	return (
		<>
			<div id="login">
				<h1>Battleship Multiplayer Game</h1>
				<Form onSubmit={handleSubmit}>
					<Form.Group className="loginForm" controlId="username">
						<Form.Label>Username</Form.Label>
						<Form.Control
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Enter your username"
							required
							type="text"
							value={username}
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="custom-game">
						<Form.Label>Create custom game</Form.Label>
						<Form.Control
							onChange={(e) => setGame(e.target.value)}
							placeholder="Name of custom game..."
							type="text"
							value={game}
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="game">
						<Form.Label>Open games</Form.Label>
						<Form.Select
							onChange={(e) => setGame(e.target.value)}
							required
							value={game}
						>
							{gamelist.length === 0 && (
								<option disabled>Loading...</option>
							)}

							{/* {customGame && (
								<option disabled>
									Custom game already chosen
								</option>
							)} */}
							{gamelist.length && (
								<>
									<option value="">
										Select a game to join
									</option>
									{gamelist.map((game) => (
										<option key={game.id} value={game.id}>
											{game.name}
										</option>
									))}
								</>
							)}
						</Form.Select>
					</Form.Group>

					<div className="btn-join">
						<Button
							variant="success"
							type="submit"
							className="w-100"
							disabled={!username || !game}
						>
							Join
						</Button>
					</div>
				</Form>
			</div>
		</>
	);
};

export default Homepage;
