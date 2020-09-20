import './LoadEnv'; // Must be the first import

import app from '@server';
import { sysLogger } from '@shared/Logger';

// Start the server
const port = Number(process.env.PORT || 9000);
app.listen(port, () => {
  sysLogger.info('Express server started on port: ' + port);
});
