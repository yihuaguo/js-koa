import fs from 'fs'
import path from 'path'
import config from '../config/index'
const { isDev, SERVERSCONFIG } = config
const uploadUrl = isDev ? SERVERSCONFIG.localhost.uploadUrl : SERVERSCONFIG.server.uploadUrl

class uploadController {
    constructor() { }

    async upload(ctx) {
        try {
            const file = ctx.request.files.avatar
            const nowDate = new Date().getTime()
            const firstName = file.name.split('.')[0]
            const endName = file.name.split('.')[1]
            const fileName = `${firstName}${nowDate}.${endName}`
            // 读取文件流
            const fileReader = fs.createReadStream(file.path);
            const filePath = path.join(__dirname, '../../public/');
            // 组装成绝对路径
            const fileResource = filePath + `/${fileName}`;
            // 使用 createWriteStream 写入数据，然后使用管道流pipe拼接
            const writeStream = fs.createWriteStream(fileResource);
            // 判断 /public 文件夹是否存在，如果不在的话就创建一个
            if (!fs.existsSync(filePath)) {
                fs.mkdir(filePath, (err) => {
                    if (err) {
                        throw new Error(err);
                    } else {
                        fileReader.pipe(writeStream);
                        ctx.body = {
                            url: uploadUrl + `/${fileName}`,
                            code: 200,
                            message: '上传成功'
                        };
                    }
                });
            } else {
                fileReader.pipe(writeStream);
                ctx.body = {
                    url: uploadUrl + `/${fileName}`,
                    code: 200,
                    message: '上传成功'
                };
            }
        } catch {
            ctx.body = {
                code: 500,
                message: '上传失败, 请重试!'
            }
        }
    }
}

export default new uploadController()