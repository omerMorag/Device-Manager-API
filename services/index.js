
const fs = require('fs');

const crane = require("../model/crane")
const craneList = []
const createDevice = async (data) => {
    try {
        const newCrange = new crane(data.body["id"], data.body["crane_id"], data.body["description"], data.body["serial_number"])

        craneList.push(newCrange)
        await _saveCranesToFile();
    } catch (e) {
        throw new Error(e.message)
    }
}

const getCranes = async () => {
    try {
        return await craneList.filter(crane => crane.deleted == false).map(x=> {
            return {
                "id": x.id,
                "crane_id": x.crane_id,
                "serial_number": x.serial_number,
                "description": x.description

        }})
    } catch (e) {
        throw new Error(e.message)
    }
}

const getDevice = async (device_id) => {
    try {
        return await craneList.find(element => element.id == device_id)
    } catch (e) {
        throw new Error(e.message)
    }
}

const setDeleteDevice = async (device_id) => {
    try {
        deviceIndex = craneList.findIndex(element => element.id == device_id)
        if (deviceIndex == -1)
            return false
        else {
            craneList[deviceIndex]["deleted"] = true
            return true
        }
           
    } catch (e) {
        throw new Error(e.message)
    }
}

 const modifyDevice  = async (device_id, newProperties) => {
    try {
        deviceIndex = craneList.findIndex(element => element.id == device_id)
        if (deviceIndex != -1) {
            const { description, serial_number } = newProperties
            if (description != undefined)
                craneList[deviceIndex]["description"] = description
            if (serial_number != undefined)
                craneList[deviceIndex]["serial_number"] = serial_number
               await _saveCranesToFile();
            return true
        }
        else
            return false
    }
    catch (e) {
        throw new Error(e.message)
    }
}

function _saveCranesToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/cranes.json', JSON.stringify(craneList, null, 2), (err) => {
            if (err) return reject(err)
            resolve();
        })
    })
}


module.exports = {
    createDevice,
    getCranes,
    getDevice,
    setDeleteDevice,
    modifyDevice
}