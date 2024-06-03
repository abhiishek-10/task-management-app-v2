import "bootstrap/dist/css/bootstrap.min.css";
import ThemeProvider from "react-bootstrap/ThemeProvider";
import Container from "react-bootstrap/Container";
import "./App.css";
import CustomNavbar from "./components/navbar/CustomNavbar";
import MainPanel from "./components/mainPanel/MainPanel";
import AuthPanel from "./components/authPanel/AuthPanel";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserProfile from "./components/userProfile/UserProfile";

function App() {
  return (
    <Router>
      <ThemeProvider
        breakpoints={["xxxl", "xxl", "xl", "lg", "md", "sm", "xs", "xxs"]}
        minBreakpoint="xxs"
      >
        <CustomNavbar />
        <div className="site-content">
          <Container>
            <Routes>
              <Route path="/" element={<AuthPanel />} />
              <Route path="/task-manager" element={<MainPanel />} />
              <Route path="/me" element={<UserProfile />} />
            </Routes>
          </Container>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
