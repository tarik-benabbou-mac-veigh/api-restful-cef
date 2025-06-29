const express = require('express');
const router = express.Router();

const service = require('../services/user.services');

//MES DIFFERENTES ROUTES :

/*Lire infos utilisateur*/
router.get('/:id', service.getById);

/*Ajouter un utilisateur*/
router.put('/add', service.add);

/*Modifier un utilisateur*/
router.patch('/:id', service.update);

/*Supprimer un utilisateur*/
router.delete('/:id', service.delete);

/*Ajout de la route authenticate*/
router.post('/authenticate', service.authenticate);

module.exports = router;
