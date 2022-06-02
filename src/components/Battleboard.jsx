import Gameboard from "./Gameboard";
import Loser from "../components/Loser";
import Victory from "../components/Victory";
import { useEffect, useState } from "react";
import { useGameContext } from "../contexts/GameContextProvider";
import { useParams } from "react-router-dom";

const Battleboard = ({ yourName, enemy, WhoseTurn }) => {
	const { socket, gameUsername } = useGameContext();
	const { game_id } = useParams();
	const [turn, setTurn] = useState(null);
	const [disabled, setDisabled] = useState(true);

	const whoEnemy = enemy;
	const youName = yourName;

	const [board, setBoard] = useState(Array(100).fill(null));
	const [shipTwo, setShipTwo] = useState([]);
	const [shipTwoSecond, setShipTwoSecond] = useState([]);
	const [shipThree, setShipThree] = useState([]);
	const [shipFour, setShipFour] = useState([]);
	const [shipRemain, setShipRemain] = useState([]);
	const [winner, setWinner] = useState(false);

	const [boardEnemy, setBoardEnemy] = useState(Array(100).fill(null));
	const [shipTwoEnemy, setShipTwoEnemy] = useState([]);
	const [shipTwoSecondEnemy, setShipTwoSecondEnemy] = useState([]);
	const [shipThreeEnemy, setShipThreeEnemy] = useState([]);
	const [shipFourEnemy, setShipFourEnemy] = useState([]);
	const [shipRemainEnemy, setShipRemainEnemy] = useState([]);
	const [winnerEnemy, setWinnerEnemy] = useState(false);

	const [startGame, setStartGame] = useState(false);
	const [sendShip, setSendShip] = useState(false);

	// const [objectShipData, setObjectShipData] = useState({});

	const [enemyShipsReady, setEnemyShipsReady] = useState(false);

	const [boardReady, setBoardReady] = useState(false);

	const [positionUp, setPositionUp] = useState("no");
	const [positionRight, setPositionRight] = useState("no");
	const [positionDown, setPositionDown] = useState("no");
	const [positionLeft, setPositionLeft] = useState("no");
	const [message, setMessage] = useState("");
	const [whichShipToMake, setWhichShipToMake] = useState(
		"Select direction and then the position of your FIRST ship (2 squares)"
	);

	const [positions, setPositions] = useState([]);

	const forbiddenPositionShip2Right = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];
	const forbiddenPositionShip3Right = [
		8, 9, 18, 19, 28, 29, 38, 39, 48, 49, 58, 59, 68, 69, 78, 79, 88, 89,
		98, 99,
	];
	const forbiddenPositionShip4Right = [
		7, 8, 9, 17, 18, 19, 27, 28, 29, 37, 38, 39, 47, 48, 49, 57, 58, 59, 67,
		68, 69, 77, 78, 79, 87, 88, 89, 97, 98, 99,
	];

	const forbiddenPositionShip2Left = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
	const forbiddenPositionShip3Left = [
		0, 1, 10, 11, 20, 21, 30, 31, 40, 41, 50, 51, 60, 61, 70, 71, 80, 81,
		90, 91,
	];
	const forbiddenPositionShip4Left = [
		0, 1, 2, 10, 11, 12, 20, 21, 22, 30, 31, 32, 40, 41, 42, 50, 51, 52, 60,
		61, 62, 70, 71, 72, 80, 81, 82, 90, 91, 92,
	];

	const [clickedButtonUp, setClickedButtonUp] = useState("null");
	const [clickedButtonRight, setClickedButtonRight] = useState("null");
	const [clickedButtonDown, setClickedButtonDown] = useState("null");
	const [clickedButtonLeft, setClickedButtonLeft] = useState("null");

	const handlePositionUp = () => {
		setClickedButtonUp("clickedButton");
		setClickedButtonRight("null");
		setClickedButtonDown("null");
		setClickedButtonLeft("null");
		setPositionUp("yes");
		setPositionLeft("no");
		setPositionRight("no");
		setPositionDown("no");
	};
	const handlePositionRight = () => {
		setClickedButtonRight("clickedButton");
		setClickedButtonUp("null");
		setClickedButtonDown("null");
		setClickedButtonLeft("null");
		setPositionRight("yes");
		setPositionLeft("no");
		setPositionUp("no");
		setPositionDown("no");
	};
	const handlePositionDown = () => {
		setClickedButtonDown("clickedButton");
		setClickedButtonRight("null");
		setClickedButtonUp("null");
		setClickedButtonLeft("null");
		setPositionDown("yes");
		setPositionLeft("no");
		setPositionRight("no");
		setPositionUp("no");
	};
	const handlePositionLeft = () => {
		setClickedButtonLeft("clickedButton");
		setClickedButtonRight("null");
		setClickedButtonDown("null");
		setClickedButtonUp("null");
		setPositionLeft("yes");
		setPositionUp("no");
		setPositionRight("no");
		setPositionDown("no");
	};

	useEffect(() => {
		// socket listeners
		socket.on("winner", handleWinner);
		socket.on("get-ship-data", handleGetShipData);
		socket.on("get-whose-turn", handleWhoseTurn);
		socket.on("start-game", () => {
			// console.log("starting game , start-game");
			if (shipTwo.length !== 0 && shipTwoEnemy.length !== 0) {
				setStartGame(true);
				// startGameFunction();
			}
		});
		socket.on("get-ships-remaining", (totalShips) => {
			setShipRemain(totalShips);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [socket, shipTwo, shipTwoEnemy]);

	useEffect(() => {
		if (enemyShipsReady === true) {
			socket.emit("player-ready", game_id);
		}
	}, [socket, game_id, enemyShipsReady]);

	useEffect(() => {
		setShipRemain([1, 2, 3, 4]);
		setShipRemainEnemy([1, 2, 3, 4]);

		if (startGame === true) {
			//  console.log("call startgame function");
			startGameFunction();
			// setStartGame(false);
		}
		if (sendShip === true) {
			// console.log("shipTwo", shipTwo);
			// console.log("shipTwoSecond", shipTwoSecond);
			// console.log("shipThree", shipThree);
			// console.log("shipFour", shipFour);
			socket.emit("ship-data", {
				id: game_id,
				shipTwo: shipTwo,
				shipTwoSecond: shipTwoSecond,
				shipThree: shipThree,
				shipFour: shipFour,
			});
		} else {
			return;
		}
		setSendShip(false);
		setStartGame(null);

		return () => {
			// socket.off("winner", handleWinner);
			// socket.off("get-ship-data", handleGetShipData);
			// socket.off("get-enemy-click", handleGetEnemyClick);
			// socket.off("get-whose-turn", handleWhoseTurn);
			// socket.off("start-game", handleStartGame);
			setSendShip(false);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [startGame, sendShip]);

	useEffect(() => {
		setPositions([positionUp, positionRight, positionDown, positionLeft]);
	}, [positionUp, positionRight, positionDown, positionLeft]);

	const setUpYourShips = (index) => {
		if (positions.indexOf("yes") !== -1) {
			let whichDirection = positions.indexOf("yes");
			let boardCopy = [...board];
			// console.log(shipTwo.length)

			//ship2
			//direction UP
			if (whichDirection === 0 && shipTwo.length === 0) {
				if (index - 10 < 0) {
					setMessage("Wrong position, try again");
				}
				if (index - 10 >= 0 && boardCopy[index] === null) {
					boardCopy[index] = "ship2";
					boardCopy[index - 10] = "ship2";
					setShipTwo([index, index - 10]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake(
						"Ok, now select direction and then the position of your SECOND ship (2 squares)"
					);
				}
			}
			//direction RIGHT
			if (whichDirection === 1 && shipTwo.length === 0) {
				if (forbiddenPositionShip2Right.indexOf(index) !== -1) {
					setMessage("Wrong position, try again");
				}
				if (
					forbiddenPositionShip2Right.indexOf(index) === -1 &&
					boardCopy[index] === null
				) {
					boardCopy[index] = "ship2";
					boardCopy[index + 1] = "ship2";
					setShipTwo([index, index + 1]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake(
						"Ok, now select direction and then the position of your SECOND ship (2 squares)"
					);
				}
			}
			//direction DOWN
			if (whichDirection === 2 && shipTwo.length === 0) {
				if (index + 10 > 99) {
					setMessage("Wrong position, try again");
				}
				if (index + 10 <= 99 && boardCopy[index] === null) {
					boardCopy[index] = "ship2";
					boardCopy[index + 10] = "ship2";
					setShipTwo([index, index + 10]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake(
						"Ok, now select direction and then the position of your SECOND ship (2 squares)"
					);
				}
			}
			//direction LEFT
			if (whichDirection === 3 && shipTwo.length === 0) {
				if (forbiddenPositionShip2Left.indexOf(index) !== -1) {
					setMessage("Wrong position, try again");
				}
				if (
					forbiddenPositionShip2Left.indexOf(index) === -1 &&
					boardCopy[index] === null
				) {
					boardCopy[index] = "ship2";
					boardCopy[index - 1] = "ship2";
					setShipTwo([index, index - 1]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake(
						"Ok, now select direction and then the position of your SECOND ship (2 squares)"
					);
				}
			}

			// ship2Second
			//direction UP
			if (
				whichDirection === 0 &&
				shipTwoSecond.length === 0 &&
				shipTwo.length !== 0
			) {
				if (
					index - 10 < 0 ||
					boardCopy[index] !== null ||
					boardCopy[index - 10] !== null
				) {
					setMessage("Wrong position, try again");
				}
				if (
					index - 10 >= 0 &&
					boardCopy[index] === null &&
					boardCopy[index - 10] === null
				) {
					boardCopy[index] = "ship2Second";
					boardCopy[index - 10] = "ship2Second";
					setShipTwoSecond([index, index - 10]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake(
						"Ok, now select direction and then the position of your THIRD ship (3 squares)"
					);
				}
			}
			//direction RIGHT
			if (
				whichDirection === 1 &&
				shipTwoSecond.length === 0 &&
				shipTwo.length !== 0
			) {
				if (
					forbiddenPositionShip2Right.indexOf(index) !== -1 ||
					boardCopy[index] !== null ||
					boardCopy[index + 1] !== null
				) {
					setMessage("Wrong position, try again");
				}
				if (
					forbiddenPositionShip2Right.indexOf(index) === -1 &&
					boardCopy[index] === null &&
					boardCopy[index + 1] === null
				) {
					boardCopy[index] = "ship2Second";
					boardCopy[index + 1] = "ship2Second";
					setShipTwoSecond([index, index + 1]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake(
						"Ok, now select direction and then the position of your THIRD ship (3 squares)"
					);
				}
			}
			//direction DOWN
			if (
				whichDirection === 2 &&
				shipTwoSecond.length === 0 &&
				shipTwo.length !== 0
			) {
				if (
					index + 10 > 99 ||
					boardCopy[index] !== null ||
					boardCopy[index + 10] !== null
				) {
					setMessage("Wrong position, try again");
				}
				if (
					index + 10 <= 99 &&
					boardCopy[index] === null &&
					boardCopy[index + 10] === null
				) {
					boardCopy[index] = "ship2Second";
					boardCopy[index + 10] = "ship2Second";
					setShipTwoSecond([index, index + 10]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake(
						"Ok, now select direction and then the position of your THIRD ship (3 squares)"
					);
				}
			}
			//direction LEFT
			if (
				whichDirection === 3 &&
				shipTwoSecond.length === 0 &&
				shipTwo.length !== 0
			) {
				if (
					forbiddenPositionShip2Left.indexOf(index) !== -1 ||
					boardCopy[index] !== null ||
					boardCopy[index - 1] !== null
				) {
					setMessage("Wrong position, try again");
				}
				if (
					forbiddenPositionShip2Left.indexOf(index) === -1 &&
					boardCopy[index] === null &&
					boardCopy[index - 1] === null
				) {
					boardCopy[index] = "ship2Second";
					boardCopy[index - 1] = "ship2Second";
					setShipTwoSecond([index, index - 1]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake(
						"Ok, now select direction and then the position of your THIRD ship (3 squares)"
					);
				}
			}

			// ship3
			//direction UP
			if (
				whichDirection === 0 &&
				shipThree.length === 0 &&
				shipTwoSecond.length !== 0 &&
				shipTwo.length !== 0
			) {
				if (
					index - 20 < 0 ||
					boardCopy[index] !== null ||
					boardCopy[index - 10] !== null ||
					boardCopy[index - 20] !== null
				) {
					setMessage("Wrong position, try again");
				}
				if (
					index - 20 >= 0 &&
					boardCopy[index] === null &&
					boardCopy[index - 10] === null &&
					boardCopy[index - 20] === null
				) {
					boardCopy[index] = "ship3";
					boardCopy[index - 10] = "ship3";
					boardCopy[index - 20] = "ship3";
					setShipThree([index, index - 10, index - 20]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake(
						"Ok, now select direction and then the position of your FOURTH ship (4 squares)"
					);
				}
			}
			//direction RIGHT
			if (
				whichDirection === 1 &&
				shipThree.length === 0 &&
				shipTwoSecond.length !== 0 &&
				shipTwo.length !== 0
			) {
				if (
					forbiddenPositionShip3Right.indexOf(index) !== -1 ||
					boardCopy[index] !== null ||
					boardCopy[index + 1] !== null ||
					boardCopy[index + 2] !== null
				) {
					setMessage("Wrong position, try again");
				}
				if (
					forbiddenPositionShip3Right.indexOf(index) === -1 &&
					boardCopy[index] === null &&
					boardCopy[index + 1] === null &&
					boardCopy[index + 2] === null
				) {
					boardCopy[index] = "ship3";
					boardCopy[index + 1] = "ship3";
					boardCopy[index + 2] = "ship3";
					setShipThree([index, index + 1, index + 2]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake(
						"Ok, now select direction and then the position of your FOURTH ship (4 squares)"
					);
				}
			}
			//direction DOWN
			if (
				whichDirection === 2 &&
				shipThree.length === 0 &&
				shipTwoSecond.length !== 0 &&
				shipTwo.length !== 0
			) {
				if (
					index + 20 > 99 ||
					boardCopy[index] !== null ||
					boardCopy[index + 10] !== null ||
					boardCopy[index + 20] !== null
				) {
					setMessage("Wrong position, try again");
				}
				if (
					index + 20 <= 99 &&
					boardCopy[index] === null &&
					boardCopy[index + 10] === null &&
					boardCopy[index + 20] === null
				) {
					boardCopy[index] = "ship3";
					boardCopy[index + 10] = "ship3";
					boardCopy[index + 20] = "ship3";
					setShipThree([index, index + 10, index + 20]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake(
						"Ok, now select direction and then the position of your FOURTH ship (4 squares)"
					);
				}
			}
			//direction LEFT
			if (
				whichDirection === 3 &&
				shipThree.length === 0 &&
				shipTwoSecond.length !== 0 &&
				shipTwo.length !== 0
			) {
				if (
					forbiddenPositionShip3Left.indexOf(index) !== -1 ||
					boardCopy[index] !== null ||
					boardCopy[index - 1] !== null ||
					boardCopy[index - 2] !== null
				) {
					setMessage("Wrong position, try again");
				}
				if (
					forbiddenPositionShip3Left.indexOf(index) === -1 &&
					boardCopy[index] === null &&
					boardCopy[index - 1] === null &&
					boardCopy[index - 2] === null
				) {
					boardCopy[index] = "ship3";
					boardCopy[index - 1] = "ship3";
					boardCopy[index - 2] = "ship3";
					setShipThree([index, index - 1, index - 2]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake(
						"Ok, now select direction and then the position of your FOURTH ship (4 squares)"
					);
				}
			}

			// ship4
			//direction UP
			if (
				whichDirection === 0 &&
				shipFour.length === 0 &&
				shipThree.length !== 0 &&
				shipTwoSecond.length !== 0 &&
				shipTwo.length !== 0
			) {
				if (
					index - 30 < 0 ||
					boardCopy[index] !== null ||
					boardCopy[index - 10] !== null ||
					boardCopy[index - 20] !== null ||
					boardCopy[index - 30] !== null
				) {
					setMessage("Wrong position, try again");
				}
				if (
					index - 30 >= 0 &&
					boardCopy[index] === null &&
					boardCopy[index - 10] === null &&
					boardCopy[index - 20] === null &&
					boardCopy[index - 30] === null
				) {
					boardCopy[index] = "ship4";
					boardCopy[index - 10] = "ship4";
					boardCopy[index - 20] = "ship4";
					boardCopy[index - 30] = "ship4";
					setShipFour([index, index - 10, index - 20, index - 30]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake("All done!");
					setSendShip(true);
				}
			}
			//direction RIGHT
			if (
				whichDirection === 1 &&
				shipFour.length === 0 &&
				shipThree.length !== 0 &&
				shipTwoSecond.length !== 0 &&
				shipTwo.length !== 0
			) {
				if (
					forbiddenPositionShip4Right.indexOf(index) !== -1 ||
					boardCopy[index] !== null ||
					boardCopy[index + 1] !== null ||
					boardCopy[index + 2] !== null ||
					boardCopy[index + 3] !== null
				) {
					setMessage("Wrong position, try again");
				}
				if (
					forbiddenPositionShip4Right.indexOf(index) === -1 &&
					boardCopy[index] === null &&
					boardCopy[index + 1] === null &&
					boardCopy[index + 2] === null &&
					boardCopy[index + 3] === null
				) {
					boardCopy[index] = "ship4";
					boardCopy[index + 1] = "ship4";
					boardCopy[index + 2] = "ship4";
					boardCopy[index + 3] = "ship4";
					setShipFour([index, index + 1, index + 2, index + 3]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake("All done!");
					setSendShip(true);
				}
			}
			//direction DOWN
			if (
				whichDirection === 2 &&
				shipFour.length === 0 &&
				shipThree.length !== 0 &&
				shipTwoSecond.length !== 0 &&
				shipTwo.length !== 0
			) {
				if (
					index + 30 > 99 ||
					boardCopy[index] !== null ||
					boardCopy[index + 10] !== null ||
					boardCopy[index + 20] !== null ||
					boardCopy[index + 30] !== null
				) {
					setMessage("Wrong position, try again");
				}
				if (
					index + 30 <= 99 &&
					boardCopy[index] === null &&
					boardCopy[index + 10] === null &&
					boardCopy[index + 20] === null &&
					boardCopy[index + 30] === null
				) {
					boardCopy[index] = "ship4";
					boardCopy[index + 10] = "ship4";
					boardCopy[index + 20] = "ship4";
					boardCopy[index + 30] = "ship4";
					setShipFour([index, index + 10, index + 20, index + 30]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake("All done!");
					setSendShip(true);
				}
			}
			//direction LEFT
			if (
				whichDirection === 3 &&
				shipFour.length === 0 &&
				shipThree.length !== 0 &&
				shipTwoSecond.length !== 0 &&
				shipTwo.length !== 0
			) {
				if (
					forbiddenPositionShip4Left.indexOf(index) !== -1 ||
					boardCopy[index] !== null ||
					boardCopy[index - 1] !== null ||
					boardCopy[index - 2] !== null ||
					boardCopy[index - 3] !== null
				) {
					setMessage("Wrong position, try again");
				}
				if (
					forbiddenPositionShip4Left.indexOf(index) === -1 &&
					boardCopy[index] === null &&
					boardCopy[index - 1] === null &&
					boardCopy[index - 2] === null &&
					boardCopy[index - 3] === null
				) {
					boardCopy[index] = "ship4";
					boardCopy[index - 1] = "ship4";
					boardCopy[index - 2] = "ship4";
					boardCopy[index - 3] = "ship4";
					setShipFour([index, index - 1, index - 2, index - 3]);
					setBoard(boardCopy);
					setMessage("");
					setWhichShipToMake("All done!");
					setSendShip(true);
				}
			}
		} else {
			setMessage("First, you must select direction of your ship");
		}
	};

	const startGameFunction = () => {
		// console.log("yourship inside startgame", objectShipData);
		// console.log("enemy ship inside start game", shipFourEnemy);
		// if (shipFour.length !== 0 && shipFourEnemy.length !== 0) {
		// console.log("startGame");
		if (turn === null) {
			setTurn(WhoseTurn);
			if (WhoseTurn === yourName) {
				setDisabled(false);
			}
		}
		// setRenderBoards(true);
		setBoardReady(true);
	};

	const shipsRemaining = (shipArray, square, totalShips) => {
		if (shipArray.indexOf(square) !== -1) {
			const shipIndex = shipArray.indexOf(square);
			shipArray.splice(shipIndex, 1);
			if (shipArray.length === 0) {
				totalShips.pop();
				// console.log("total ships ", totalShips);
				socket.emit("ships-remaining", game_id, totalShips);
			}
		}
	};

	const handleWhoseTurn = (whoTurn) => {
		setTurn(whoTurn);
		// console.log("whose turn from emit", whoTurn);
		if (whoTurn === youName) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	};

	const handleClick = (clickedSquare) => {
		if (disabled === false) {
			const boardCopy = [...boardEnemy];
			const clickedShip = boardCopy[clickedSquare];

			if (clickedShip !== "missShip" && clickedShip !== "hitShip") {
				socket.emit("click-data-hit", game_id, clickedSquare, whoEnemy);
			}

			if (
				clickedShip !== null &&
				clickedShip !== "missShip" &&
				clickedShip !== "hitShip" &&
				clickedShip !== 'sunk-ship'
			) {
				boardCopy[clickedSquare] = "hitShip";
				// console.log("shipRemainEnemy1", shipRemainEnemy);
				if (clickedShip === "ship3Enemy") {
					shipsRemaining(
						shipThreeEnemy,
						clickedSquare,
						shipRemainEnemy
					);
					// console.log("ship 3 enemy:", shipThreeEnemy);
					// console.log("ship remain enemy:", shipRemainEnemy);
				}
				if (clickedShip === "ship4Enemy") {
					shipsRemaining(
						shipFourEnemy,
						clickedSquare,
						shipRemainEnemy
					);
				}
				if (clickedShip === "ship2Enemy") {
					shipsRemaining(
						shipTwoEnemy,
						clickedSquare,
						shipRemainEnemy
					);
					if(shipTwoEnemy.length === 0) {
						boardCopy[shipTwoEnemy[0]] = 'sunk-ship';
						boardCopy[shipTwoEnemy[1]] = 'sunk-ship';
					}
				}
				if (clickedShip === "ship2SecondEnemy") {
					shipsRemaining(
						shipTwoSecondEnemy,
						clickedSquare,
						shipRemainEnemy
					);
					if(shipTwoSecondEnemy.length === 0) {
						boardCopy[shipTwoSecondEnemy[0]] = 'sunk-ship';
						boardCopy[shipTwoSecondEnemy[1]] = 'sunk-ship';
					}
				}
				if (shipRemainEnemy.length === 0) {
					//  console.log("shipRemainEnemy2", shipRemainEnemy);
					// emit the winner to server
					socket.emit("game-over", gameUsername, game_id);
				}

				// setTurn(whoEnemy);
				// setDisabled(true);
			} else if (clickedShip === null) {
				boardCopy[clickedSquare] = "missShip";
				// setTurn(whoEnemy);
				// setDisabled(true);
			}
			setBoardEnemy(boardCopy);

			// socket.emit("whose-turn", whoEnemy, game_id);
		}
	};

	const handleGetEnemyClick = (attackClick) => {
		// if (disabled === true) {
		const boardCopy = [...board];
		const clickedShip = boardCopy[attackClick];
		// console.log()

		if (
			clickedShip !== null &&
			clickedShip !== "missShip" &&
			clickedShip !== "hitShip"
		) {
			boardCopy[attackClick] = "hitShip";
			// console.log("shipRemain1", shipRemain);
			// console.log("hit ship", clickedShip);
			if (shipRemain.length === 0) {
				// console.log("No ships remaining", shipRemain);
				setWinnerEnemy(true);
			}
		} else if (clickedShip === null) {
			boardCopy[attackClick] = "missShip";
		}

		setBoard(boardCopy);
		// }
		// setTurn(youName);
		// setDisabled(true);
		// socket.emit("whose-turn", youName, game_id);
	};

	const handleGetShipData = async (shipData) => {
		// console.log("shipData.shipTwo.length", shipData.shipTwo.length);
		// console.log("shipData.shipfour.length", shipData.shipFour.length);
		if (
			shipData.shipTwo.length !== 0 &&
			shipData.shipTwoSecond.length !== 0 &&
			shipData.shipThree.length !== 0 &&
			shipData.shipFour.length !== 0
		) {
			// console.log("inside handleship data");
			let boardCopyEnemy = [...boardEnemy];
			setShipTwoEnemy(shipData.shipTwo);
			boardCopyEnemy[shipData.shipTwo[0]] = "ship2Enemy";
			boardCopyEnemy[shipData.shipTwo[1]] = "ship2Enemy";
			setShipTwoSecondEnemy(shipData.shipTwoSecond);
			boardCopyEnemy[shipData.shipTwoSecond[0]] = "ship2SecondEnemy";
			boardCopyEnemy[shipData.shipTwoSecond[1]] = "ship2SecondEnemy";
			setShipThreeEnemy(shipData.shipThree);
			boardCopyEnemy[shipData.shipThree[0]] = "ship3Enemy";
			boardCopyEnemy[shipData.shipThree[1]] = "ship3Enemy";
			boardCopyEnemy[shipData.shipThree[2]] = "ship3Enemy";
			setShipFourEnemy(shipData.shipFour);
			boardCopyEnemy[shipData.shipFour[0]] = "ship4Enemy";
			boardCopyEnemy[shipData.shipFour[1]] = "ship4Enemy";
			boardCopyEnemy[shipData.shipFour[2]] = "ship4Enemy";
			boardCopyEnemy[shipData.shipFour[3]] = "ship4Enemy";
			setBoardEnemy(boardCopyEnemy);
			setEnemyShipsReady(true);
			// socket.emit("player-ready", game_id);
		}
	};

	socket.on("get-enemy-click", handleGetEnemyClick);

	const handleWinner = (username) => {
		if (username === gameUsername) {
			setWinner(true);
		} else if (username !== gameUsername) {
			setWinnerEnemy(true);
		}
	};

	return (
		<>
			{boardReady && (
				<>
					<div className="turn-tag">
						<h2 className="whose-turn">Whose turn?</h2>{" "}
						<span className="whose-turn-name">{turn}</span>
					</div>

					<div className="game-container">
						<div className="game-board game-board-you">
							<div className="username">
								<span className="game-title">You: </span>
								<span className="game-title-you">
									{gameUsername}
								</span>
							</div>

							<p className="ships-remain-text">
								Ships remaining:{" "}
								<span className="ships-remain-text-bold">
									{shipRemain.length}
								</span>
							</p>
							{!winner && !winnerEnemy && (
								<div className="game-wrapper game-wrapper-you">
									<Gameboard squares={board} />
								</div>
							)}
						</div>
						<div className="game-board game-board-enemy">
							<div className="username">
								<span className="game-title">Enemy: </span>
								<span className="game-title-you">
									{whoEnemy}
								</span>
							</div>

							<p className="ships-remain-text">
								Ships remaining:{" "}
								<span className="ships-remain-text-bold">
									{shipRemainEnemy.length}
								</span>
							</p>
							{!winner && !winnerEnemy && (
								<div className="game-wrapper game-wrapper-enemy">
									<Gameboard
										squares={boardEnemy}
										onClick={handleClick}
									/>
								</div>
							)}
						</div>
						{winner && <Victory />}
						{winnerEnemy && <Loser />}
					</div>
				</>
			)}
			{!boardReady && (
				<>
					<div className="game-board game-board-you">
						<h3 className="game-title game-title-you">
							You: {yourName}
						</h3>
						<p className="text-directions">
							Directions of the ship:
						</p>
						<div className="directions-buttons">
							<button
								className={`${clickedButtonUp}`}
								onClick={handlePositionUp}
							>
								Up
							</button>
							<button
								className={`${clickedButtonRight}`}
								onClick={handlePositionRight}
							>
								Right
							</button>
							<button
								className={`${clickedButtonDown}`}
								onClick={handlePositionDown}
							>
								Down
							</button>
							<button
								className={`${clickedButtonLeft}`}
								onClick={handlePositionLeft}
							>
								Left
							</button>
						</div>
						<p className="messageToPlayer">{whichShipToMake}</p>
						<p className="messageToPlayer2">{message}</p>
						<div
							className="game-wrapper game-wrapper-you"
							style={{ marginBottom: "50px" }}
						>
							<Gameboard
								squares={board}
								onClick={setUpYourShips}
							/>
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default Battleboard;
