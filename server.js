const express = require("express");
const app = express();
const port = 3000;
const indexRoute = require("./app/routes/index.route");
const apiRoute = require("./app/routes/api.route");

app.use(express.json());

app.use("/", indexRoute);
app.use("/api", apiRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
