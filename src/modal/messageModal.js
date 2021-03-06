import config from '../config/index'
import { where, limit, insert, update, orderBy, screen } from '../utils/splicSql'
import { getMessageListModalField } from '../modalFieldFiliter/messageField';
import sendSql from '../utils/mysqlConnect'
import { v4 as uuidv4 } from 'uuid';
const messageTable = config.TABLENAMELIST.messageTable

// 资讯分类列表sql
export const getMessageListModal = (params = {}) => {
    const { current, pageSize, order, ...otherParams } = params
    const screenField = getMessageListModalField(['htmlDocument'])
    const countSql = `select count(*) from ${messageTable} ${where(otherParams)} ${order ? orderBy(order) : ''}`
    const sql = `select ${screen(screenField)} from ${messageTable} ${where(otherParams)} ${order ? orderBy(order) : ''} ${limit(current, pageSize)}`
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

// 资讯最新列表
export const getNewMessageListModal = () => {
    const screenField = getMessageListModalField(['htmlDocument'])
    const sql = `select ${screen(screenField)} from ${messageTable} where state='1' order by create_time desc limit 0,5`
    return sendSql(sql).then(async (res) => {
        return {
            code: 200,
            msg: res || []
        }
    }).catch(err => {
        return {
            code: 500,
            msg: err
        }
    })
}

// 资讯分类详情sql
export const getMessageDetailModal = (params = {}) => {
    const sql = `select * from ${messageTable} ${where(params)}`
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

// 资讯分类新增sql
export const addMessageModal = (params = {}) => {
    const filiterParams = {
        id: uuidv4(),
        create_time: new Date().getTime(),
        ...params
    }
    const sql = `insert into ${messageTable} ${insert(filiterParams)}`
    return sendSql(sql).then(() => {
        return { code: 200 }
    }).catch(err => {
        return {
            code: 500,
            msg: err
        }
    })
}

// 资讯分类删除sql
export const deleteMessageModal = (params = {}) => {
    const sql = `delete from ${messageTable} ${where(params)}`
    return sendSql(sql).then(() => {
        return { code: 200 }
    }).catch(err => {
        return {
            code: 500,
            msg: err
        }
    })
}

// 资讯分类编辑sql
export const editMessageModal = (params = {}) => {
    const { id, ...otherParams } = params
    const sql = `update ${messageTable} ${update(otherParams)} ${where({ id })}`
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
    getMessageListModal,
    getMessageDetailModal,
    addMessageModal,
    deleteMessageModal,
    editMessageModal
}