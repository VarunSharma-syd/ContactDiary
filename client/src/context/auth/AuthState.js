import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./authContext";
import AuthReducer from "./authReducer";
import setAuthToken from "../../utils/setAuthToken";
import {
  REGISTER_SUCEESS,
  REGISTER_FAILURE,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCEESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERROR,
} from "../types";

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("token") /* Get the token from local stroage */,
    isAuthenticated: null /* Whether logged in or not */,
    loading: true /* When we get response back then set it false */,
    user: null,
    error: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  /* Load User */

  const loadUser = async () => {
    /* Load token into global header */
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get("/api/auth");

      dispatch({
        type: USER_LOADED,
        payload: res.data,
      }); /* res.data hold actual user */
    } catch (error) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  /* Register User */

  const register = async (formData) => {
    /* We are sending some date we need content header of type application/json*/
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    try {
      const res = await axios.post("/api/users", formData, config);
      dispatch({
        type: REGISTER_SUCEESS,
        payload: res.data /* It will be our token */,
      });

      loadUser();
    } catch (err) {
      console.log("In Auth State ", err);
      dispatch({
        type: REGISTER_FAILURE,
        payload: err.response.data.msg,
      });
    }
  };

  /* Login User */

  const login = async (formData) => {
    /* We are sending some date we need content header of type application/json*/
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    try {
      const res = await axios.post("/api/auth", formData, config);
      dispatch({
        type: LOGIN_SUCEESS,
        payload: res.data /* It will be our token */,
      });

      loadUser();
    } catch (err) {
      console.log("In Auth State ", err);
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.msg,
      });
    }
  };

  /* Logout User */

  const logout = () => dispatch({ type: LOGOUT });

  /* Clear User */

  const clearErrors = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        logout,
        clearErrors,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
