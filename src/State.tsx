import React, { createContext, useReducer } from "react";
//services
import { AuthService } from "./services/auth-service"; 


let AppContext = createContext(null);

const authService = new AuthService();

const initialState = {
  target: authService.target,
  progress: authService.progress,// progress in percentage
  achieve: authService.achieve, // how much achieve so far 
  date: authService.date,
}

const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
}

const formatDate = (date: Date) => {
  return (
    [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-')
  );
}

let reducer = (state, action) => {

  switch (action.type) {

    case "SET_STATE": {
      let a = { ...state, ...action.data };
      return a; 
    }
    
    case "SET_TARGET": {

      authService.setTarget(action.data);

      let a = { ...state, target: action.data };
      return a; 
    }

    case "SET_PROGRESS": {

      authService.setProgress(action.data);

      let a = { 
        ...state, 
        progress: action.data.progress,
        achieve: action.data.achieve,
        date: action.data.date
      };
      return a; 
    }

    case 'LOGOUT': {

      authService.logout();

      return { ...state, isLoggedIn: false };
    }
    case "SET_TOKEN": {

      authService.setToken(action);
      
      return { 
        ...state, 
        error: action.error, 
        isLoggedIn: true 
      }; 
    }
  }
  return state;
};

function AppContextProvider(props: any) {

  const fullInitialState = {
    ...initialState,
  }

  let [state, dispatch] = useReducer(reducer, fullInitialState);

  let value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer, padTo2Digits, formatDate };

export const logout = () => ({
  type: 'LOGOUT'
});

export const setState = (data: any) => ({
  data: data,
  type: 'SET_STATE'
});

export const setTarget = (data: any) => ({
  data: data,
  type: 'SET_TARGET'
});

export const setProgress = (data: any) => ({
  data: data,
  type: 'SET_PROGRESS'
});

export const loggedIn = (data: any) => ({
  ...data,
  type: 'SET_TOKEN', 
});
 