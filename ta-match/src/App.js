import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Button from "@material-ui/core/Button";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ChairPage from "./pages/ChairPage";
import ProfPage from "./pages/ProfPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import { AuthProvider } from "./contexts/AuthContext"


function App() {
    const context = React.createContext({ user: { type: "prof" } });



    return (

        <Router>
        {/* <Button>
            <Link to="/chair">Home</Link>
        </Button> */}
    
        <Button
            component={Link}
            to={{
                pathname: `/login`,
            }}
        >
            Login
        </Button>

        <Button
            component={Link}
            to={{
                pathname: `/signup`,
            }}
        >
            Register
        </Button>

        <Button
            component={Link}
            to={{
                pathname: `/chair`,
            }}
        >
            Chair Page
        </Button>

        <Button
            component={Link}
            to={{
                pathname: `/administrator`,
            }}
        >
            Admin Page
        </Button>

        <Button
            component={Link}
            to={{
                pathname: `/professor`,
            }}
        >
            Prof Page
        </Button>
        <AuthProvider>
            <Switch>
                <Route path="/chair">
                    <ChairPage />
                </Route>
<<<<<<< Updated upstream
                <Route path="/professor">
                    <ProfPage />
                </Route>
                <Route path="/administrator">
=======
                <Route path="/prof">
                    <ProfPage />
                </Route>
                <Route path="/admin">
>>>>>>> Stashed changes
                    <AdminPage />
                </Route>
                <Route path="/login">
                    <LoginPage />
                </Route>
                <Route path="/signup">
                    <SignUp />
                </Route>
            </Switch>
        </AuthProvider>
    </Router>

    
        
    );
}

export default App;
