import "./App.css";
import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import ChairPage from "./pages/ChairPage";
import ProfPage from "./pages/ProfPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import SignUp from "./components/SignUp";
import ChairHistoryPage from "./pages/ChairHistoryPage";
import ProfHistoryPage from "./pages/ProfHistoryPage";
import AdminHistoryPage from "./pages/AdminHistoryPage";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Switch>
                    <Route path="/chair/history">
                        <ChairHistoryPage />
                    </Route>
                    <Route path="/chair">
                        <ChairPage />
                    </Route>
                    <Route path="/professor/history">
                        <ProfHistoryPage />
                    </Route>
                    <Route path="/professor">
                        <ProfPage />
                    </Route>
                    <Route path="/administrator/history">
                        <AdminHistoryPage />
                    </Route>
                    <Route path="/administrator">
                        <AdminPage />
                    </Route>
                    <Route path="/login">
                        <LoginPage />
                    </Route>
                    <Route path="/signup">
                        <SignUp />
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/login" />
                    </Route>
                </Switch>
            </AuthProvider>
        </Router>
    );
}
export default App;
