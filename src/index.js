require("dotenv").config();
require("./utils/db");
const PORT = process.env.PORT || 3000;
const app = require("./app");

app.listen(PORT, () => {
  console.log(`Server runnning on http://localhost:${PORT}`);
});
