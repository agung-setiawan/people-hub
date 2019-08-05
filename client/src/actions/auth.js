import axios from "axios";
import { setAlert } from "./alert";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get("/api/auth");

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = ({ name, email, password }) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const hostname = window.location.origin;
  const body = JSON.stringify({ name, email, password, hostname });

  try {
    const res = await axios.post("/api/users", body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });

    if (res.data.sts === "passed") {
      window.location.href = "/register-success?" + res.data.code;
    }
    // dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Register User Via Facebook
export const sosmedRegister = (name, email, picture) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ name, email, picture });

  try {
    const res = await axios.post("/api/users/sosmed/signup", body, config);

    if (res.data.sts === "passed") {
      dispatch(login(email, res.data.uid));
    } else {
      dispatch(
        setAlert(
          "Something error with your account, please check again",
          "danger"
        )
      );
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: REGISTER_FAIL
    });
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Logout / Clear Profile
export const logout = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};

// Forgot Password
export const forgot = email => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const hostname = window.location.origin;
  const body = JSON.stringify({ email, hostname });

  try {
    const res = await axios.post("/api/auth/forgot/password", body, config);

    // if (res.data.length > 0) {
    window.location.href = "/reset-password-mesage?" + res.data.codes;
    // }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Update Password
export const updatePassword = (password, refCode) => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ password, refCode });

  try {
    const res = await axios.post("/api/auth/update/password", body, config);

    if (res.data.sts === "passed") {
      window.location.href = "/login";
    } else {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    dispatch({
      type: LOGIN_FAIL
    });
  }
};

// Activation Register
export const activation = refCode => async dispatch => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  const body = JSON.stringify({ refCode });

  try {
    const res = await axios.post("/api/auth/activation", body, config);

    if (res.data.sts === "passed") {
      window.location.href = "/login";
    } else {
      window.location.href = "/404";
    }
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
    }

    window.location.href = "/404";
  }
};
