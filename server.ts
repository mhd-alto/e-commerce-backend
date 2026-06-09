const expressApp = require("./app");
const { getEnv } = require("./src/config/env");

const { PORT } = getEnv();

expressApp.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
