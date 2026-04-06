const { connectDB, getDatabaseStatus } = require('./config/database')
const { getEnvWarnings, host, nodeEnv, port, validateRequiredEnv } = require('./config/env')
const app = require('./app')

let server

const startServer = async () => {
  try {
    validateRequiredEnv()
    getEnvWarnings().forEach((warning) => {
      console.warn(`Configuration warning: ${warning}`)
    })

    await connectDB()

    const database = getDatabaseStatus()
    console.log(`MongoDB startup state: ${database.state}`)

    server = app.listen(port, host, () => {
      console.log(
        `Server running in ${nodeEnv} mode on ${host}:${port}`,
      )
    })

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Stop the existing process or change PORT.`)
      } else if (error.code === 'EACCES') {
        console.error(`Permission denied while binding to ${host}:${port}.`)
      } else {
        console.error(`Server listen error: ${error.message}`)
      }

      process.exit(1)
    })
  } catch (error) {
    console.error(`Server bootstrap error: ${error.message}`)
    process.exit(1)
  }
}

startServer()

process.on('unhandledRejection', (error) => {
  console.error(`Unhandled rejection: ${error.message}`)
  if (server) {
    server.close(() => {
      process.exit(1)
    })
    return
  }

  process.exit(1)
})

process.on('uncaughtException', (error) => {
  console.error(`Uncaught exception: ${error.message}`)
  process.exit(1)
})
