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
	// const [customGame, setCustomGame] = useState("");
	const [gamelist, setGamelist] = useState([]);
	const { setGameUsername, socket } = useGameContext();
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		// set game username
		setGameUsername(username);

		if (generateRoom) {
			console.log(generateRoom);
			const randomName = uniqueNamesGenerator({
				dictionaries: [animals],
				separator: "-",
				length: 1,
			});
			console.log(randomName);
			navigate(`/games/${randomName}`);
		} else if (game) {
			navigate(`/games/${game}`);
		}

		socket.emit("update-list");
	};

	// change this???
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
			console.log(list);
			setGamelist(list);
		});
	}, [socket]);

	return (
		<div className="loginPage">
			{/* {loading && <WaitingRoom />} */}
			<div id="login">
				<h1 className="login-header">Battleship Multiplayer Game</h1>

				<Form onSubmit={handleSubmit}>
					<Form.Group className="loginForm" controlId="username">
						{/* <Form.Label>Username</Form.Label> */}
						<Form.Control
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Enter your username"
							required
							type="text"
							value={username}
						/>
					</Form.Group>

					<Form.Group className="createRoom" controlId="game">
						{/* <Form.Label>Open games</Form.Label> */}
						<Form.Select
							onChange={(e) => setGame(e.target.value)}
							value={game}
						>
							{!gamelist && <option disabled>Loading...</option>}

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
