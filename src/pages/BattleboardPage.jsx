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
// import useSound from "use-sound";
// import waves from "../assets/sounds/waves.mp3";
import "normalize.css";
import "../assets/css/BattleboardPage.css";

const BattleboardPage = () => {
	// chat code
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([]);
	const messageRef = useRef();
	const messagesEndRef = useRef(null);

	// game logic code
	const [disconnectedMsg, setDisconnectedMsg] = useState(false);
	const [disconnected, setDisconnected] = useState("");
	const [waiting, setWaiting] = useState(true);
	const { gameUsername, socket } = useGameContext();
	const [enemy, setEnemy] = useState();
	const { game_id } = useParams();
	const navigate = useNavigate();
	const [turn, setTurn] = useState();

	useEffect(() => {
		// focus on message input
		messageRef.current && messageRef.current.focus();
		scrollToBottom();
	}, []);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
		messageRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

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
		scrollToBottom();
	};

	// connect to room when component is mounted
	useEffect(() => {
		const handleIncomingMessage = (msg) => {
			console.log("Received a new chat message", msg);

			// add message to chat
			setMessages((prevMessages) => [...prevMessages, msg]);
			scrollToBottom();
		};

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
		socket.emit("player:joined", gameUsername, game_id, (status) => {});

		// listen for incoming messages
		socket.on("chat:message", handleIncomingMessage);

		// listen for updated userlist
		socket.on("player:list", handleUpdatePlayers);

		socket.on("player:disconnected", (username) => {
			setDisconnected(username);
			setDisconnectedMsg(true);
		});
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
				</div>
			</div>

			<div className="disconnected">
				{disconnectedMsg && <p className="disconnected-tag">{disconnected}: disconnected</p>}
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

			{!waiting && (
				<div id="chat">
					<div id="messages-wrapper">
						<ListGroup id="messages">
							{messages.map((message, index) => {
								return (
									<ListGroup.Item
										key={index}
										className="message"
									>
										<span className="user">
											{message.username}:
										</span>
										<span className="content">
											{message.content}
										</span>
									</ListGroup.Item>
								);
							})}
							<div ref={messagesEndRef} />
						</ListGroup>

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
			)}
		</div>
	);
};

export default BattleboardPage;
