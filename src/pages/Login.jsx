import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../contexts/GameContextProvider";

const Homepage = () => {
	const [username, setUsername] = useState("");
	const [game, setGame] = useState();
	const [gamelist, setGamelist] = useState([]);
	const { setGameUsername, socket } = useGameContext();
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();

		// set chat username
		setGameUsername(username);

		// redirect to game
		navigate(`/games/${game}`);
		// setLoading(true);
	};

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
			{/* {loading && <WaitingRoom />} */}
			<div id="login">
				<Form onSubmit={handleSubmit}>
					<Form.Group className="mb-3" controlId="username">
						<Form.Label>Username</Form.Label>
						<Form.Control
							onChange={(e) => setUsername(e.target.value)}
							placeholder="Enter your username"
							required
							type="text"
							value={username}
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="room">
						<Form.Label>Room</Form.Label>
						<Form.Select
							onChange={(e) => setGame(e.target.value)}
							required
							value={game}
						>
							{gamelist.length === 0 && (
								<option disabled>Loading...</option>
							)}
							{gamelist.length && (
								<>
									<option value="">
										Select a room to join
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

					<div className="d-flex justify-content-between">
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
