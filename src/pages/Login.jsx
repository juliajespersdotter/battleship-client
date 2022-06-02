import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../contexts/GameContextProvider";
import { uniqueNamesGenerator, animals } from "unique-names-generator";
import "../assets/css/login.css";

const Login = () => {
	const [username, setUsername] = useState("");
	const [game, setGame] = useState();
	const [generateRoom, setGenerateRoom] = useState(false);
	const [gamelist, setGamelist] = useState([]);
	const { setGameUsername, socket } = useGameContext();
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		// set game username
		setGameUsername(username);

		// generate random room name
		if (generateRoom) {
			const randomName = uniqueNamesGenerator({
				dictionaries: [animals],
				separator: "-",
				length: 1,
			});
			navigate(`/games/${randomName}`);
		} else if (game) {
			navigate(`/games/${game}`);
		}

		socket.emit("update-list");
	};

	// as soon as the component is mounted, request game list
	useEffect(() => {
		// update game list on Login screen
		socket.on("new-game-list", () => {
			socket.emit("get-game-list", (games) => {
				const list = games.filter((game) => game.id);
				setGamelist(list);
			});
		});

		socket.emit("get-game-list", (games) => {
			const list = games.filter((game) => game.id);
			setGamelist(list);
		});
	}, [socket]);

	return (
		<div className="loginPage">
			<div id="login">
				<h1 className="login-header">Battleship Multiplayer Game</h1>

				<Form onSubmit={handleSubmit}>
					<Form.Group className="loginForm" controlId="username">
						<Form.Control
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Enter your username"
							required
							type="text"
							value={username}
						/>
					</Form.Group>

					<Form.Group className="createRoom" controlId="game">
						<Form.Select
							onChange={(e) => setGame(e.target.value)}
							value={game}
						>
							{!gamelist.length && (
								<option value="">No games currently</option>
							)}

							{gamelist.length && (
								<>
									<option value="">
										Select a game to join
									</option>
									{gamelist.map((game) => (
										<option key={game.id} value={game.id}>
											{game.name} game{" "}
											{Object.keys(game.players).length} /
											2
										</option>
									))}
								</>
							)}
						</Form.Select>

						<div className="btn-join">
							<Button
								variant="success"
								type="submit"
								className="w-100"
								disabled={!username || !game}
							>
								Join open game
							</Button>
						</div>

						<div className="btn-join">
							<Button
								variant="success"
								type="submit"
								className="w-100"
								onClick={() => setGenerateRoom(true)}
								disabled={game}
							>
								Generate new game room
							</Button>
						</div>
					</Form.Group>
				</Form>
			</div>
		</div>
	);
};

export default Login;
