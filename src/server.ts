import app from "./app";

import logger from "./utils/logger";
import { ENV_CONFIGS } from "./config/envConfig";

app.listen(ENV_CONFIGS.port, () => {
  logger.info(`Started listening on PORT: ${ENV_CONFIGS.port}`);
});
