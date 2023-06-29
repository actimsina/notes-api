const Note = require('../models/Note')

const getAllNotes = (req, res, next) => {
    Note.find({ user: req.user.id })
        .then((notes) => res.json(notes))
        .catch(next)
}

const createNote = (req, res, next) => {
    const newNote = {
        title: req.body.title,
        completed: req.body.completed ? req.body.completed : false,
        user: req.user.id
    }
    Note.create(newNote)
        .then((note) => res.status(201).json(note))
        .catch(err => next(err))
}

const deleteAllNotes = (req, res, next) => {
    Note.deleteMany({})
        .then((reply) => res.status(204).end())
        .catch(next)
}

const getNoteById = (req, res, next) => {
    Note.findOne({ _id: req.params.note_id, user: req.user.id })
        .then((note) => {
            if (!note) {
                res.status(404)
                return next(new Error('note not found'))
            }
            res.json(note)
        }).catch(next)
}

const updateNoteById = (req, res, next) => {
    const query = { _id: req.params.note_id, user: req.user.id }
    const note = {
        title: req.body.title,
        completed: req.body.completed
    }

    Note.findOneAndUpdate(query, note, { new: true })
        .then((note) => res.json(note))
        .catch(next)
}

const deleteNoteById = (req, res, next) => {
    const query = { _id: req.params.note_id, user: req.user.id }
    Note.findOneAndDelete(query)
        .then((note) => {
            if (!note) {
                res.status(404)
                return next(new Error('note not found'))
            }
            res.status(204).end()
        })
        .catch(next)
}

module.exports = {
    getAllNotes,
    createNote,
    deleteAllNotes,
    getNoteById,
    updateNoteById,
    deleteNoteById
}