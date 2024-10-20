import 'dotenv/config';
import app from "./app.js";
import { PORT } from "./config.js";

/**
 * Main function to start the application server.
 * It listens on the specified port and logs the server URL and environment.
 * If an error occurs during the process, it logs the error message.
 */
function main() {
    try {
        app.listen(PORT, () => {
            console.log(`Server on port http://localhost:${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        console.error('Error in main:', error);
    }
}

main();
