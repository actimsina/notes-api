const express = require('express')
const { verifyUser, verifyAdmin } = require('../middlewares/auth_handler')
const noteController = require('../controllers/note_controllers')

const noteRouter = express.Router()

noteRouter.use(verifyUser).route('/')
    .get(noteController.getAllNotes)
    .post(noteController.createNote)
    .delete(verifyAdmin, noteController.deleteAllNotes)

noteRouter.use(verifyUser).route('/:note_id')
    .get(noteController.getNoteById)
    .put(noteController.updateNoteById)
    .delete(noteController.deleteNoteById)

module.exports = noteRouter