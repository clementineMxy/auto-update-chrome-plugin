// const fs = require('fs');
// const path = require('path');

// const ChromeExtension = require('crx');

// const crx = new ChromeExtension({
//     codebase: 'https://auto-update-chrome-plugin.vercel.app/auto-update-server/auto-update-plugin_5.0.4.crx',
//     privateKey: fs.readFileSync('./auto-update-server/auto-update-plugin.pem')
// });

// crx.load(path.resolve(__dirname, './auto-update-plugin'))
//     .then(crx => crx.pack())
//     .then(crxBuffer => {
//         const updateXML = crx.generateUpdateXML()

//         fs.writeFile('./auto-update-server/extension-updates.xml', updateXML, (err) => {
//             if (err) {
//                 console.error('Error writing update XML:', err);
//                 return;
//             }
//             console.log('Update XML has been saved successfully');
//         });
//         fs.writeFile('./auto-update-server/auto-update-plugin_5.0.4.crx', crxBuffer, (err) => {
//             if (err) {
//                 console.error('Error writing CRX:', err);
//                 return;
//             }
//             console.log('CRX has been saved successfully');
//         });
//     })
//     .catch(err => {
//         console.error(err);
//     });

const fs = require('fs');
const path = require('path');
const crx = require('crx');

// 配置参数
const config = {
    srcDir: path.join(__dirname, './auto-update-plugin'),    // 扩展源代码目录
    dstDir: path.join(__dirname, './auto-update-server'),   // 输出目录
    // keyPath: path.join(__dirname, './auto-update-server/auto-update-plugin.pem'),  // 私钥文件（可选）
    keyPath: path.join(__dirname, './auto-update-server/private_key.pem'),  // 私钥文件（可选）
    updateXML: path.join(__dirname, './auto-update-server/extension-updates.xml'),  // 更新 XML 文件
    crxName: 'my-extension.crx'                // 输出文件名
};

async function buildCrx() {
    try {
        // 读取私钥（如果存在）
        const privateKey = fs.existsSync(config.keyPath)
            ? fs.readFileSync(config.keyPath)
            : null;

        // 创建 CRX 实例
        const extension = new crx({
            codebase: `https://auto-update-chrome-plugin.vercel.app/auto-update-server/${config.crxName}`, // 自动更新地址（可选）
            privateKey
        });

        // 打包扩展
        const crxBuffer = await extension.load(config.srcDir)
            .then(crx => crx.pack());

        // 获取到插件 id
        console.log(`✅ 插件 id：`, extension.generateAppId());

        // 确保输出目录存在
        if (!fs.existsSync(config.dstDir)) {
            fs.mkdirSync(config.dstDir, { recursive: true });
        }

        // 写入文件
        fs.writeFileSync(
            path.join(config.dstDir, config.crxName),
            crxBuffer
        );
        console.log(`✅ CRX 已生成至：${path.join(config.dstDir, config.crxName)}`);

        const updateXML = extension.generateUpdateXML()
        fs.writeFileSync(config.updateXML, updateXML)
        console.log(`✅ 更新 XML 已生成至：${config.updateXML}`);

        // 生成新私钥（如果没有提供）
        if (!privateKey) {
            fs.writeFileSync(config.keyPath, extension.privateKey, extension.generatePublicKey(), extension.generateAppId());
            console.log(`🔑 新私钥已生成至：${config.keyPath}`);
        }
    } catch (err) {
        console.error('❌ 打包失败:', err);
        process.exit(1);
    }
}

buildCrx();