import React, { createContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from '../api'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    REGISTER_USER: "REGISTER_USER",
    LOGIN_USER: "LOGIN_USER",
    ERROR: "ERROR",
    LOGGED_OUT: "LOGGED_OUT"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        firstName:null,
        lastName:null,
        user: null,
        loggedIn: false,
        errorMessage : null
    });
    const history = useHistory();

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    loggedIn: payload.loggedIn,
                });
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                })
            }
            case AuthActionType.ERROR: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: payload.errorMessage,
                })
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                })
            }
            case AuthActionType.LOGGED_OUT: {
                return setAuth({
                    firstName:null,
                    lastName:null,
                    user: null,
                    loggedIn: false,
                    errorMessage : null
                })
            }
            default:
                return auth;
        }
    }

    auth.logoutUser = function(){
        authReducer({
            type: AuthActionType.LOGGED_OUT
        });
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user,
                    firstName : response.data.user.firstName,
                    lastName : response.data.user.lastName
                }
            });
        }
    }

    auth.loginUser = async function(userData, store) {
        try{
            const response = await api.loginUser(userData);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
                store.loadIdNamePairs();
            }
        }
        catch(e)
        {
            let err = e.response.data.errorMessage;
            authReducer({
                type: AuthActionType.ERROR,
                payload: {
                    errorMessage : err
                }
            }) 
        }

    }

    auth.guestUser = async function (store){
        try{
            const response = await api.guestUser();      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                const response1 = await api.getAllTop5Lists();
                if (response.data.success) {
                    let pairsArray = response1.data.data;
                    for(let i = 0;i<pairsArray.length;i++)
                    {
                        if (pairsArray[i].dislikedBy.includes("guest@guest.com")) {
                            let index = pairsArray[i].dislikedBy.indexOf("guest@guest.com");
                            pairsArray[i].dislikedBy.splice(index, 1);
                            api.updateTop5ListById(pairsArray[i]._id,pairsArray[i]);
                        }
                        if (pairsArray[i].likedBy.includes("guest@guest.com")) {
                            let index = pairsArray[i].likedBy.indexOf("guest@guest.com");
                            pairsArray[i].likedBy.splice(index, 1);
                            api.updateTop5ListById(pairsArray[i]._id,pairsArray[i]);
                        }
                    }
                }
                history.push("/");
                store.loadIdNamePairs();
            }
        }
        catch(e)
        {
            let err = e.response.data.errorMessage;
            authReducer({
                type: AuthActionType.ERROR,
                payload: {
                    errorMessage : err
                }
            }) 
        }
    }

    auth.eraseError = function(){
        authReducer({
            type: AuthActionType.ERROR,
            payload: {
                errorMessage : null
            }
        });
    }

    auth.registerUser = async function(userData, store) {     
        try{
            let response = await api.registerUser(userData);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push('/login/');
                store.loadIdNamePairs();
            }
        }
        catch(e)
        {
            let err = e.response.data.errorMessage;
            authReducer({
                type: AuthActionType.ERROR,
                payload: {
                    errorMessage : err
                }
            }) 
        }

    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };