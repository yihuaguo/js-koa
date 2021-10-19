import config from '../config/index'
import { where, limit, insert, update } from '../utils/splicSql'
import sendSql from '../utils/mysqlConnect'
import { v4 as uuidv4 } from 'uuid';
const miningmachineTable = config.TABLENAMELIST.miningmachineTable

// 矿机列表sql
export const getMiningMachineListModal = (params = {}) => {
    const { current, pageSize, ...otherParams } = params
    const countSql = `select count(*) from ${miningmachineTable} ${where(otherParams)}`
    const sql = `select * from ${miningmachineTable} ${where(otherParams)} ${limit(current, pageSize)}`
    return sendSql(sql).then(async (res) => {
        const count = await sendSql(countSql)
        return {
            code: 200,
            msg: {
                list: res,
                pageSize: Number(pageSize),
                current: Number(current),
                total: Number(count[0]['count(*)'])
            }
        }
    }).catch(err => {
        return {
            code: 500,
            msg: err
        }
    })
}

// 矿机新增sql
export const addMiningMachineModal = (params = {}) => {
    const filiterParams = {
        id: uuidv4(),
        create_time: new Date().getTime(),
        ...params
    }
    const sql = `insert into ${miningmachineTable} ${insert(filiterParams)}`
    return sendSql(sql).then(() => {
        return { code: 200 }
    }).catch(err => {
        return {
            code: 500,
            msg: err
        }
    })
}

// 矿机删除sql
export const deleteMiningMachineModal = (params = {}) => {
    const sql = `delete from ${miningmachineTable} ${where(params)}`
    return sendSql(sql).then(() => {
        return { code: 200 }
    }).catch(err => {
        return {
            code: 500,
            msg: err
        }
    })
}

// 矿机详情sql
export const getMiningMachineDetailModal = (params = {}) => {
    const sql = `select * from ${miningmachineTable} ${where(params)}`
    return sendSql(sql).then(res => {
        return {
            code: 200,
            msg: res[0]
        }
    }).catch(err => {
        return {
            code: 500,
            msg: err
        }
    })
}

// 矿机编辑sql
export const editMiningMachineModal = (params = {}) => {
    const { id, ...otherParams } = params
    const sql = `update ${miningmachineTable} ${update(otherParams)} ${where({ id })}`
    return sendSql(sql).then(() => {
        return { code: 200 }
    }).catch(err => {
        return {
            code: 500,
            msg: err
        }
    })
}

export default {
    getMiningMachineListModal,
    addMiningMachineModal,
    deleteMiningMachineModal,
    getMiningMachineDetailModal,
    editMiningMachineModal
}