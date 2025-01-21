
import "./App.css";
import UserDashboard from "./components/Dashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./components/Theme";

function App() {

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <BrowserRouter>
            <Routes>
            <Route element={<UserDashboard />} path="/" />
              <Route element={<UserDashboard />} path="/dashboard" />
            </Routes>
          </BrowserRouter>
        </header>
      </div>
    </ThemeProvider>
  );
}

export default App;
