const config = require('./config/config');
const app = require('./app');

app.listen(config.PORT,()=>{
    console.log(`Server running on Port: ${config.PORT}`);
})