import './LoadEnv'; // Must be the first import

import app from '@server';
const logger = require('@shared/Logger')(module);

// Start the server
const port = Number(process.env.PORT || 9000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});
