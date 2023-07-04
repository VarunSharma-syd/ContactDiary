import React, { useState, useContext, useEffect } from "react";
import ContactContext from "../../context/contact/contactContext";

function ContactForm() {
  const contactContext = useContext(ContactContext);

  const { addContact, updateContact, current, clearCurrent } = contactContext;

  useEffect(() => {
    if (current !== null) {
      console.log("Clicked on Edit");
      setContact(current);
    } else {
      setContact({
        name: "",
        phone: "",
        email: "",
        type: "personal",
      });
    }
  }, [contactContext, current]);

  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
    type: "personal",
  });

  const { name, phone, email, type } = contact;

  const onChange = (e) =>
    setContact({ ...contact, [e.target.name]: e.target.value });

  const clearAll = () => {
    clearCurrent();
  };

  /*Adding newContact to context and reseting the form fields */

  const onSubmit = (e) => {
    e.preventDefault();
    if (current === null) {
      addContact(contact);
      console.log("ContactForm: " + contact);
    } else {
      updateContact(contact);
    }

    setContact({
      name: "",
      phone: "",
      email: "",
      type: "personal",
    });
  };
  return (
    <form onSubmit={onSubmit}>
      <h2 className="text-primary">
        {current ? "Edit Contact" : "Add Contact"}
      </h2>
      <input
        type="text"
        placeholder="Name"
        name="name"
        value={name}
        onChange={onChange}
      />
      <input
        type="text"
        placeholder="Email"
        name="email"
        value={email}
        onChange={onChange}
      />
      <input
        type="text"
        placeholder="Phone"
        name="phone"
        value={phone}
        onChange={onChange}
      />
      <h5>Contact Type</h5>
      <input
        type="radio"
        name="type"
        onChange={onChange}
        value="personal"
        checked={type === "personal"}
      />{" "}
      Personal{" "}
      <input
        type="radio"
        name="type"
        onChange={onChange}
        value="professional"
        checked={type === "professional"}
      />{" "}
      Professional
      <div>
        <input
          type="submit"
          onSubmit={onSubmit}
          value={current ? "Update Contact" : "Add Contact"}
          className="btn btn-primary btn-block"
        />
      </div>
      {current && (
        <div>
          <button className="btn btn-light btn-block" onClick={clearAll}>
            Clear
          </button>
        </div>
      )}
    </form>
  );
}

export default ContactForm;
