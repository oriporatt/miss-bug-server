import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'

import { bugService } from './api/bug/bug.service.js' 
import { loggerService } from './services/logger.service.js'
import { makePDF } from './services/utils.js'

import { bugRoutes } from './api/bug/bug.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'


const app = express()


const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true
}

//* App Configuration

app.use(express.static('public'))
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())


app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)






app.get('/generate-pdf', async (req, res) => {
    const bugs = await bugService.query()
    makePDF(res,bugs);  // Pass res to makePDF function
});

//**** For SPA (Single Page Application) - catch all routes and send to the index.html ****//
app.get('/**', (req, res) => {
    // console.log(path.resolve('public/index.html'))
    res.sendFile(path.resolve('public/index.html'))
})


const port = process.env.PORT || 3000
app.listen(port, () => {
	loggerService.info(`Example app listening on port ${port}`)
})
