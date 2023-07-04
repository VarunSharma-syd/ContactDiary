const express = require("express");
const connectDB = require("./config/db");

const path = require("path");

/* Intialize Express Server */

const app = express();

/* Connect Database */

connectDB();

/* Intialize Middleware */
/* Now we can accept the body data */

app.use(express.json({ extended: true }));
app.get("/", (req, res) => res.json({ msg: "Welcome to the Portal" }));

/* Define Routes */

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contact", require("./routes/contact"));

if (process.env.NODE_ENV === "production") {
  /* Set Static Folder */
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
