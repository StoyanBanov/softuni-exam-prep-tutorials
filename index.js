const app = require('express')()
const expressConfig = require('./config/express')
const databaseConfig = require('./config/database')
const routesConfig = require('./config/routes')

const port = 3000

async function start() {
    await databaseConfig(app)
    expressConfig(app)
    routesConfig(app)

    app.listen(port, () => console.log(`Listening at ${port}.`))
}

start()