require('dotenv').config()
const app = require('./app')
const connectDB = require('./config/database')

const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET']
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key])

if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`)
}

const PORT = process.env.PORT || 5000

let server

const startServer = async () => {
  try {
    await connectDB()

    server = app.listen(PORT, () => {
      console.log(
        `Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`,
      )
    })

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the existing process or change PORT.`)
      } else if (error.code === 'EACCES') {
        console.error(`Permission denied while binding to port ${PORT}.`)
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
