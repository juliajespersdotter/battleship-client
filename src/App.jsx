import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'
import socketio from 'socket.io-client'
import BattleboardPage from './pages/BattleboardPage';
import NotFound from './pages/NotFound'
import Homepage from './pages/Homepage';
import './App.css';

// const socket = socketio.connect(process.env.REACT_APP_SOCKET_URL)

function App() {
  return (
    <div id="App">
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/games/:game_id" element={<BattleboardPage />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</div>
  );
}

export default App;
