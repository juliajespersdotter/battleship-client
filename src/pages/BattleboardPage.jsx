import { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import { useNavigate, useParams } from "react-router-dom";
import { useGameContext } from "../contexts/GameContextProvider";
import Battleboard from "../components/Battleboard";
import WaitingRoom from "./WaitingRoom";
import Logo from "../assets/images/logo.png";
import "normalize.css";
import "../assets/css/BattleboardPage.css";

const BattleboardPage = () => {
	// chat code
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const messageRef = useRef();

	// game logic code
	const [disconnectedMsg, setDisconnectedMsg] = useState(false);
	const [disconnected, setDisconnected] = useState("");
	const [waiting, setWaiting] = useState(true);
	const { gameUsername, socket } = useGameContext();
	const [enemy, setEnemy] = useState();
	const { game_id } = useParams();
	const navigate = useNavigate();
	const [turn, setTurn] = useState();

	const handleIncomingMessage = (msg) => {
		console.log("Received a new chat message", msg);

		// add message to chat
		setMessages((prevMessages) => [...prevMessages, msg]);
	};

	const handleSendMessage = async (e) => {
		e.preventDefault();

		if (!message.length) {
			return;
		}

		// construct message object
		const msg = {
			username: gameUsername,
			game: game_id,
			content: message,
			timestamp: Date.now(),
		};

		// emit chat message
		socket.emit("chat:message", msg);

		// add message to chat
		setMessages((prevMessages) => [
			...prevMessages,
			{ ...msg, self: true },
		]);

		// clear message input and refocus on input element
		setMessage("");
		messageRef.current.focus();
	};

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

		// listen for incoming messages
		socket.on("chat:message", handleIncomingMessage);

		// listen for updated userlist
		socket.on("player:list", handleUpdatePlayers);

		return () => {
			socket.on("player:disconnected", (username) => {
				setDisconnected(username);
				setDisconnectedMsg(true);
			});

			// stop listening to events
			socket.off("chat:message", handleIncomingMessage);

			// disconnect player
			socket.emit("player:left", gameUsername, game_id);
		};
	}, [socket, game_id, gameUsername, navigate]);

	useEffect(() => {
		// focus on message input
		messageRef.current && messageRef.current.focus();
	}, []);

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

			<div id="chat">
				<h2>#{game_id}</h2>

				<div id="messages-wrapper">
					<ListGroup id="messages">
						{messages.map((message, index) => {
							const ts = new Date(message.timestamp);
							const time = ts.toLocaleTimeString();
							return (
								<ListGroup.Item key={index} className="message">
									<span className="time">{time}</span>
									<span className="user">
										{message.username}:
									</span>
									<span className="content">
										{message.content}
									</span>
								</ListGroup.Item>
							);
						})}
					</ListGroup>
				</div>

				<Form onSubmit={handleSendMessage} id="message-form">
					<InputGroup>
						<Form.Control
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Say something nice..."
							ref={messageRef}
							required
							type="text"
							value={message}
						/>
						<Button
							variant="success"
							type="submit"
							disabled={!message.length}
						>
							Send
						</Button>
					</InputGroup>
				</Form>
			</div>
		</div>
	);
};

export default BattleboardPage;
