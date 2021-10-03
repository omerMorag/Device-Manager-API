const fs = require('fs');

const device = require("../model/device")

const allocateCraneId = async () => {
    try {
        const cranesJson = fs.readFileSync("data/cranes.json")
        const allCranes = JSON.parse(cranesJson)
        if (fs.existsSync("data/devices.json")) {
            const allDevices = fs.readFileSync("data/devices.json")
            const usedCranes = JSON.parse(allDevices).map(device => { return device.crane_id });
            const availableCranesId = allCranes.filter(crane => !usedCranes.includes(crane))
            if (availableCranesId.length > 0)
                return availableCranesId[0]
            else
                return undefined
        }
        else {
            return allCranes[0]
        }
    }
    catch (e) {
        throw new Error(e.message)
    }
}
const createDevice = async (data) => {
    try {
        const crane_id = await allocateCraneId()
        const { id, description, serial_number } = data.body;
        if (id != undefined && crane_id != undefined && description != undefined && serial_number != undefined && crane_id != undefined) {
            const newDevice = new device(id, crane_id, serial_number, description)
            const devicesList = await getAllDevices();
            devicesList.push(newDevice);
            await _saveDevices(devicesList);
            return true
        }
        else
            return false
    } catch (e) {
        throw new Error(e.message)
    }
}

const getAllDevices = async () => {
    try {
        const isExist = fs.existsSync("data/devices.json")
        if (isExist) {
            const fileContent = await fs.readFileSync("data/devices.json", 'utf8')
            let deviceListFile = JSON.parse(fileContent);
            return deviceListFile;
        }
        else {
            return []
        }
    } catch (e) {
        throw new Error(e.message)
    }
}
const getNonDeletdDevices = async () => {
    try {
        const isExist = fs.existsSync("data/devices.json")
        if (isExist) {
            const fileContent = await fs.readFileSync("data/devices.json", 'utf8')
            let deviceListFile = JSON.parse(fileContent);
            return deviceListFile.filter(device => device.deleted === false).map(x => {
                return {
                    "id": x.id,
                    "crane_id": x.crane_id,
                    "serial_number": x.serial_number,
                    "description": x.description
                }
            })
        }
        else {
            return []
        }
    } catch (e) {
        throw new Error(e.message)
    }
}

const getDevice = async (device_id) => {
    try {
        const allDevices = await getNonDeletdDevices();
        return allDevices.find(element => element.id === device_id)
    } catch (e) {
        throw new Error(e.message)
    }
}

const setDeleteDevice = async (device_id) => {
    try {
        const allDevices = await getAllDevices();
        const deviceIndex = allDevices.findIndex(element => element.id === device_id)
        if (deviceIndex == -1)
            return false
        else {
            allDevices[deviceIndex].deleted = true
            await _saveDevices(allDevices);
            return true
        }

    } catch (e) {
        throw new Error(e.message)
    }
}

const modifyDevice = async (device_id, newProperties) => {
    try {
        const allDevices = await getAllDevices()
        const deviceIndex = allDevices.findIndex(element => element.id == device_id)
        if (deviceIndex != -1) {
            const { description } = newProperties
            if (description != undefined)
                allDevices[deviceIndex].description = description;
            await _saveDevices(allDevices);
            return true
        }
        else
            return false
    }
    catch (e) {
        throw new Error(e.message)
    }
}

function _saveDevices(devices) {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/devices.json', JSON.stringify(devices, null, 2), (err) => {
            if (err) return reject(err)
            resolve();
        })
    })
}

module.exports = {
    createDevice,
    getAllDevices,
    getDevice,
    setDeleteDevice,
    modifyDevice,
    getNonDeletdDevices
}