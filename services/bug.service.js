import { loggerService } from "./logger.service.js"
import { makeId, readJsonFile, writeJsonFile } from "./utils.js"

const bugs = readJsonFile('./data/bugs.json')

export const bugService = {
    query,
    getById,
    save,
    remove,
}

async function query() { 
    try {
        return bugs
    } catch (err) {
        loggerService.error(`Couldn't get cars`)
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