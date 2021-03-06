const express = require('express');
const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);
const router = express.Router();

//Routes

//Get Project
router.get('/', (req, res) => {
    db('projects')
    .then(projects => {
        res.status(200).json(projects);
    })
    .catch(err => {
        res.status(500).json({ message: err })
    })
})

//Get Project and Associated Actions
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db('projects')
        .where({ id })
        .first()
        .then( project => {
            if (project) {
            db('actions')
                .where({ project_id: id })
                .then(actions => {
                    project.actions = actions;
                    res.status(200).json(project);
                })}
            else {
                res.status(400).json({ message: 'Could not find that project' })
            }
        })
        .catch( err => {
            res.status(500).json({ message: 'There was an error getting the project'})
        })
})

// Post New Project
router.post('/', (req, res) => {
    const newProject = req.body;

    db('projects')
        .insert(newProject)
        .then(count => {
            res.status(201).json(count)
        })
        .catch(err => {
            res.status(500).json({ message: 'There was an error posting your project' })
        })
})

// Delete Project
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db('projects')
        .where({ id })
        .del()
        .then(count => {
            res.status(200).json(count)
        })
        .catch(err => {
            res.status(500).json({ message: 'There was an error deleting your project' })
        })
})
module.exports = router;