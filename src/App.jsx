
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import socketio from "socket.io-client";
import BattleboardPage from "./pages/BattleboardPage";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import "./App.css";

function App() {
	return (
		<div id="App">
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/games/:game_id" element={<BattleboardPage />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
	);
}

export default App;
