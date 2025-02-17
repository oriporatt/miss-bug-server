import express from 'express'
import { getBugs,getBug,removeBug,addBug,updateBug,getUserBugs } from './bug.controller.js'
import { requireAuth } from '../../middlewares/require-auth.middleware.js'

const router = express.Router()


router.get('/', getBugs)
router.get('/userbugs/:userId', getUserBugs)
router.get('/:bugId', getBug)
router.delete('/:bugId',requireAuth, removeBug)
router.post('/',requireAuth,addBug)
router.put('/:bugId',requireAuth, updateBug)

export const bugRoutes = router