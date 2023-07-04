const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

const User = require("../models/User");
const Contact = require("../models/Contact");

// @route  Get api/contacts
// @desc   Get all users contacts
// @access Private

router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Contact Server Error" });
  }
});

// @route  Post api/contacts
// @desc   Add new contact
// @access Private

router.post(
  "/",
  [auth, [check("name", "Name is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, email, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        phone,
        email,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();
      res.json(contact);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: "Server Error while new Contact adding" });
    }
  }
);

// @route  PUT api/contacts/:id
// @desc   Update contact
// @access Private

router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  /* Build Contact Object */

  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "Contact not found" });

    /*Make sure user own contact */
    if (contact.user.toString() !== req.user.id) {
      return res.send(401).json({ msg: "Not Authorized" });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );

    res.json(contact);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Server Error while updating the contact" });
  }
});

// @route  DELETE api/contacts/:id
// @desc   Delete contact
// @access Private

router.delete("/:id", auth, async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);

    if (!contact) return res.status(404).json({ msg: "Contact not found" });

    /*Make sure user own contact */
    if (contact.user.toString() !== req.user.id) {
      return res.send(401).json({ msg: "Not Authorized" });
    }

    await Contact.findByIdAndRemove(req.params.id);

    res.json({ msg: "Contact Removed from list" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Server Error while updating the contact" });
  }
});

module.exports = router;
