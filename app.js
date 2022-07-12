const express = require("express");
const routes = require("./routes/index");
const app = express();

app.use(express.json());

app.use("/api", routes);

const port = process.env.PORT || 3000;
app.listen(port, console.log(`server running on port ${port}`));
