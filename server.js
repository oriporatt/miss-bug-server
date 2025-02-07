import express from 'express'
import cors from 'cors'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true
}



const app = express()
app.use(express.static('public'))
app.use(cors(corsOptions))


// List
app.get('/api/bug', async (req, res) => {
    try {
        const bugs = await bugService.query()
    	res.send(bugs)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't get bugs`)
    }
})


//Save 
app.get('/api/bug/save', async(req,res)=>{
    const { _id, title,description, severity,createdAt } = req.query
    const bugToSave = { _id, title,description, severity:+severity, createdAt:+createdAt }
    try {
        const savedBug = await bugService.save(bugToSave)
    	res.send(savedBug)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't save bug`)
    }

})
// Delete
app.get('/api/bug/:bugId/remove', async (req, res) => {
    const { bugId } = req.params
    try {
        await bugService.remove(bugId)
        res.send('OK')
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't remove bug`)
    }
})

// Read
app.get('/api/bug/:bugId', async (req, res) => {
    const { bugId } = req.params

    try {
        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't get bug`)
    }
})


const port = 3000
app.listen(port, () => {
	loggerService.info(`Example app listening on port ${port}`)
})
