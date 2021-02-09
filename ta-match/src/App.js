import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Button from "@material-ui/core/Button";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ChairPage from "./pages/ChairPage";
import ProfPage from "./pages/ProfPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";

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
                    pathname: `/chair`,
                }}
            >
                Chair Page
            </Button>

            <Button
                component={Link}
                to={{
                    pathname: `/admin`,
                }}
            >
                Admin Page
            </Button>

            <Button
                component={Link}
                to={{
                    pathname: `/prof`,
                }}
            >
                Prof Page
            </Button>

            <Switch>
                <Route path="/chair">
                    <ChairPage />
                </Route>
                <Route path="/admin">
                    <ProfPage />
                </Route>
                <Route path="/prof">
                    <AdminPage />
                </Route>
                <Route path="/login">
                    <LoginPage />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
