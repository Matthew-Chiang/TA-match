import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";

export const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(false);

    function signup(email, password) {
        localStorage.setItem("email", email);
        return auth.createUserWithEmailAndPassword(email, password);
    }

    function login(email, password) {
        localStorage.setItem("email", email);
        return auth.signInWithEmailAndPassword(email, password);
    }

    function logout() {
        //localStorage.clear();
        return auth.signOut();
    }

    function updateEmail(email) {
        return currentUser.updateEmail(email);
    }

    function updatePassword(password) {
        return currentUser.updatePassword(password);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            // setLoading(false)
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        login,
        signup,
        logout,
        updateEmail,
        updatePassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
