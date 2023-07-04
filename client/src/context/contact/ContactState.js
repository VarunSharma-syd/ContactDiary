import React, { useReducer } from "react";
import axios from "axios";
import { v4 } from "uuid";
import contactContext from "./contactContext";
import contactReducer from "./contactReducer";
import {
  ADD_CONTACT,
  GET_CONTACTS,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CONTACT_ERROR,
  CLEAR_FILTER,
  CLEAR_CONTACTS,
} from "../types";

const ContactState = (props) => {
  const initialState = {
    contacts: null,
    current:
      null /* This one is for edit button when clicked filled with those values */,
    filtered: null,
    error: null,
  };

  const [state, dispatch] = useReducer(contactReducer, initialState);

  /* Get Contact */

  const getContacts = async () => {
    //contact.id = v4();

    try {
      const res = await axios.get("/api/contact");

      dispatch({ type: GET_CONTACTS, payload: res.data });
    } catch (error) {
      console.log(error);
      dispatch({ type: CONTACT_ERROR, payload: error.response.msg });
    }
  };

  /* Add Contact */

  const addContact = async (contact) => {
    //contact.id = v4();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post("/api/contact", contact, config);

      dispatch({ type: ADD_CONTACT, payload: res.data });
    } catch (error) {
      console.log(error);
      dispatch({ type: CONTACT_ERROR, payload: error.response.msg });
    }
  };

  /* Delete Contact */

  const deleteContact = async (id) => {
    try {
      await axios.post(`/api/contact/${id}`);

      dispatch({ type: DELETE_CONTACT, payload: id });
    } catch (error) {
      console.log(error);
      dispatch({ type: CONTACT_ERROR, payload: error.response.msg });
    }
  };

  const clearContact = () => {
    dispatch({ type: CLEAR_CONTACTS });
  };

  /* Set Current Contact */

  const setCurrent = (contact) => {
    dispatch({ type: SET_CURRENT, payload: contact });
  };

  /* Clear Current Contact */

  const clearCurrent = () => {
    dispatch({ type: CLEAR_CURRENT });
  };

  /* Update Contact */

  const updateContact = async (contact) => {
    //contact.id = v4();

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.put(
        `/api/contact/${contact._id}`,
        contact,
        config
      );

      dispatch({ type: UPDATE_CONTACT, payload: res.data });
    } catch (error) {
      console.log(error);
      dispatch({ type: CONTACT_ERROR, payload: error.response.msg });
    }
  };

  /* Filtered Contact */

  const filteredContact = (text) => {
    dispatch({ type: FILTER_CONTACTS, payload: text });
  };

  /* Clear Filter */

  const clearFilter = () => {
    dispatch({ type: CLEAR_FILTER });
  };

  return (
    <contactContext.Provider
      value={{
        contacts: state.contacts,
        current: state.current,
        filtered: state.filtered,
        error: state.error,
        addContact,
        getContacts,
        deleteContact,
        setCurrent,
        clearCurrent,
        updateContact,
        filteredContact,
        clearFilter,
        clearContact,
      }}
    >
      {props.children}
    </contactContext.Provider>
  );
};

export default ContactState;
