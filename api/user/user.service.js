import fs from 'fs'
import { makeId, readJsonFile,writeJsonFile } from '../../services/utils.js'
import { loggerService } from '../../services/logger.service.js'

const users = readJsonFile('data/user.json')

export const userService = {
    query,
    getById,
    remove,
    save,
}



function query() {
    try {
        return users
    } catch (err) {
        loggerService.error(`Couldn't get users`)
        throw err
    }
}

function getById(userId) {
    try {
        const user = users.find(user => user._id === userId)
        if (!user) throw `Bad user id ${userId}`
        return user
    } catch (err) {
        loggerService.error(`Couldn't get user ${userId}`)
        throw err
    }
}



async function remove(userId) { 
    try {
        const idx = users.findIndex(user => user._id === userId)
        if (idx === -1) throw `Bad user id ${userId}`
        users.splice(idx, 1)
    
        await writeJsonFile('./data/user.json', users)
        return
    } catch (err) {
        loggerService.error(`Couldn't remove user ${userId}`)
        throw err
    }
}


async function save(userToSave) { 
    try {
        if (userToSave._id) {
            const idx = users.findIndex(user => user._id === userToSave._id)
            if (idx === -1) throw `Bad user id ${userToSave._id}`
            users.splice(idx, 1, userToSave)
        } else {
            userToSave._id = makeId()
            users.push(userToSave)
        }
        await writeJsonFile('./data/user.json', users)
        return userToSave
    } catch (err) {
        loggerService.error(`Couldn't save user ${userToSave._id}`)
        throw err
    }
}


function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const usersStr = JSON.stringify(users, null, 4)
        fs.writeFile('data/user.json', usersStr, (err) => {
            if (err) {
                return console.log(err);
            }
            resolve()
        })
    })
}