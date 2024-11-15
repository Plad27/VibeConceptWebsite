import express from 'express'

const app = express()
export const logger = (request, response, next) => {
    app.use(express.urlencoded({ extended: true }))
    console.log(
      new Date().toUTCString(), 
      'Request from', 
      request.ip, 
      request.method,
      request.originalUrl
    )
    next()
}

export default logger