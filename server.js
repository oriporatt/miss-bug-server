import express from 'express'
import cors from 'cors'
import path from 'path'
import { bugService } from './api/bug/bug.service.js' //delete later
import { loggerService } from './services/logger.service.js'
import { makePDF } from './services/utils.js'

import { bugRoutes } from './api/bug/bug.routes.js'

const app = express()


const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true
}


app.use(express.static('public'))
app.use(cors(corsOptions))
app.use(express.json())


app.use('/api/bug', bugRoutes)



// //Save 
// app.get('/api/bug/save', async(req,res)=>{
//     const { _id, title,description, severity,createdAt } = req.query
//     const bugToSave = { _id, title,description, severity:+severity, createdAt:+createdAt }
//     try {
//         const savedBug = await bugService.save(bugToSave)
//     	res.send(savedBug)
//     } catch (err) {
//         loggerService.error(err.message)
//         res.status(400).send(`Couldn't save bug`)
//     }

// })
// // Delete
// app.get('/api/bug/:bugId/remove', async (req, res) => {
//     const { bugId } = req.params
//     try {
//         await bugService.remove(bugId)
//         res.send('OK')
//     } catch (err) {
//         loggerService.error(err.message)
//         res.status(400).send(`Couldn't remove bug`)
//     }
// })

// // Read
// app.get('/api/bug/:bugId', async (req, res) => {
//     const { bugId } = req.params

//     try {
//         const bug = await bugService.getById(bugId)
//         res.send(bug)
//     } catch (err) {
//         loggerService.error(err.message)
//         res.status(400).send(`Couldn't get bug`)
//     }
// })



app.get('/generate-pdf', async (req, res) => {
    const bugs = await bugService.query()
    makePDF(res,bugs);  // Pass res to makePDF function
});




const port = 3000
app.listen(port, () => {
	loggerService.info(`Example app listening on port ${port}`)
})
