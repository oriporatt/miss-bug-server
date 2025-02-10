
import { loggerService } from "../../services/logger.service.js"
import { bugService } from "./bug.service.js"

export async function getBugs (req, res) {
    const { title, minSeverity } = req.query
    
    const filterBy = {
        title,
        minSeverity: +minSeverity,
    }
    try {
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't get bugs`)
    }
}

export async function getBug (req, res) {
    const { bugId } = req.params
    try {
        const bug = await bugService.getById(bugId)
        res.send(bug)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't get bug`)
    }

 }

 export async function addBug(req, res) {
    const { title,description, severity,createdAt,labels } = req.body
    const bugToSave = { title,description, severity:+severity, createdAt:+createdAt,labels }
    try {
        const savedBug = await bugService.save(bugToSave)
    	res.send(savedBug)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't save bug`)
    }
 }

 export async function updateBug(req, res) {
    const { _id, title,description, severity,createdAt,labels } = req.body
    const bugToSave = { _id, title,description, severity:+severity, createdAt:+createdAt,labels }
    try {
        const savedBug = await bugService.save(bugToSave)
    	res.send(savedBug)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't save bug`)
    }
}

export async function removeBug(req, res) {
    const { bugId } = req.params
        try {
        await bugService.remove(bugId)
        res.send('OK')
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't remove bug`)
    }

}