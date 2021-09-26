const express = require('express')

const deviceController = require('../controllers')
const deviceServices = require('../services')

const router = express.Router()





router.get('/devices', deviceController.showDevices)
router.post('/devices', deviceController.createDevice)
router.get('/devices/:id', deviceController.showDevice)
router.patch('/devices/:id', deviceController.modifyDevice)
router.delete('/devices/:id', deviceController.deleteDevice)


module.exports = router