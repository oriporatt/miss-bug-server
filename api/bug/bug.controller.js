
import { loggerService } from "../../services/logger.service.js"
import { bugService } from "./bug.service.js"

export async function getBugs (req, res) {
    const { title, minSeverity ,pageIdx,sortBy,sortDirection} = req.query
    
    const filterBy = {
        title,
        minSeverity: +minSeverity,
    }
    if (pageIdx) filterBy.pageIdx = +pageIdx
    if (sortBy) filterBy.sortBy = sortBy
    if (sortDirection) filterBy.sortDirection = +sortDirection
    try {
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (err) {
        res.status(400).send(`Couldn't get bugs`)
    }
}

export async function getBug (req, res) {
    const { bugId } = req.params
    //* ------------------- Cookies -------------------
    let spamUser=_checkCookieRate(req,res,bugId)


    
    // continue to regular function
    try {
        if (!spamUser){
            const bug = await bugService.getById(bugId)
            res.send(bug)
        }else{
            throw new Error("Too many requests. Please wait.");
        }

    } catch (err) {
        if (err.message==="Too many requests. Please wait.") {
            return res.status(429).send("Wait a bit");
        }
        res.status(400).send("Couldn't get bug");
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

function _checkCookieRate(req,res,bugId){
    let newVisitBugs = []
    let spamUserCheck =false
    if (req.cookies.visitBugs){
        newVisitBugs = JSON.parse(req.cookies.visitBugs)        
    }
    if (!newVisitBugs.includes(bugId)){
        if (newVisitBugs.length<3){
            newVisitBugs.push(bugId)
        }else{
            spamUserCheck=true 
        }
    }
    const JSONnewVisitBugs=JSON.stringify(newVisitBugs)
    loggerService.info('newVisitBugs', JSONnewVisitBugs)
    res.cookie('visitBugs', JSONnewVisitBugs, { maxAge: 1000 *7 })
    return spamUserCheck
}