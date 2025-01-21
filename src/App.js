import logo from './logo.svg';
import './App.css';
import UserDashboard from './components/Dashboard';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
        <Routes>
          <Route element={<UserDashboard/>} path='/dashboard'/>

        </Routes>
        
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
