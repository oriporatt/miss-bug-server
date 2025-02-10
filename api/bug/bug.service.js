import { loggerService } from "../../services/logger.service.js"
import { makeId, readJsonFile, writeJsonFile } from "../../services/utils.js"

const bugs = readJsonFile('./data/bugs.json')
const PAGE_SIZE = 2


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


        if (filterBy.sortBy){  
            const sortField=  filterBy.sortBy
            const sortDirection=  +filterBy.sortDirection


            bugsToDisplay=bugsToDisplay.sort((bug1, bug2) => {
                const val1 = bug1[sortField];
                const val2 = bug2[sortField];
                if (typeof val1 === "string" && typeof val2 === "string") {
                    return val1.localeCompare(val2) * sortDirection
                } else {
                    return (val1 - val2) * sortDirection
                }
            })
            
            if ('pageIdx' in filterBy) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE
                bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
            }

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