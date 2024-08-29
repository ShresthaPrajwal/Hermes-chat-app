const config = require('./config/config');
const { app, server } = require('./app');

server.listen(config.PORT, () => {
    console.log(`Server running on Port: ${config.PORT}`);
});
