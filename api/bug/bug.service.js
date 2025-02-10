import { loggerService } from "../../services/logger.service.js"
import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js"

const bugs = readJsonFile('./data/bugs.json')

export const bugService = {
    query,
    getById,
    save,
    remove,
}

async function query(filterBy) { 
    let bugsToDisplay = bugs
    try {
        if (filterBy.title) {
            const regExp = new RegExp(filterBy.title, 'i')
            bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title))
        }
        if (filterBy.minSeverity) {
            bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filterBy.minSeverity)
        }
        return bugsToDisplay

    } catch (err) {
        loggerService.error(`Couldn't get bugs`)
        throw err
    }

}



async function getById(bugId) { 
    try {
        const bug = bugs.find(bug => bug._id === bugId)
        if (!bug) throw `Bad bug id ${bugId}`
        return bug
    } catch (err) {
        loggerService.error(`Couldn't get bug ${bugId}`)
        throw err
    }
    
}


async function save(bugToSave) { 
    try {
        if (bugToSave._id) {
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (idx === -1) throw `Bad bug id ${bugToSave._id}`
            bugs.splice(idx, 1, bugToSave)
        } else {
            bugToSave._id = makeId()
            bugs.push(bugToSave)
        }
        await writeJsonFile('./data/bugs.json', bugs)
        return bugToSave
    } catch (err) {
        loggerService.error(`Couldn't save bug ${bugToSave._id}`)
        throw err
    }
}


async function remove(bugId) { 
    try {
        const idx = bugs.findIndex(bug => bug._id === bugId)
        if (idx === -1) throw `Bad bug id ${bugId}`
        bugs.splice(idx, 1)
    
        await writeJsonFile('./data/bugs.json', bugs)
        return
    } catch (err) {
        loggerService.error(`Couldn't remove bug ${bugId}`)
        throw err
    }
}