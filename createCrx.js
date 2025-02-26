const fs = require('fs');
const path = require('path');

const ChromeExtension = require('crx');

const crx = new ChromeExtension({
    codebase: 'https://auto-update-chrome-plugin.vercel.app/auto-update-server/auto-update-plugin_5.0.1.crx',
    privateKey: fs.readFileSync('./auto-update-server/auto-update-plugin.pem')
});

crx.load(path.resolve(__dirname, './auto-update-plugin'))
    .then(crx => crx.pack())
    .then(crxBuffer => {
        const updateXML = crx.generateUpdateXML()
        console.log(`crxBuffer`, crxBuffer);

        fs.writeFile('./auto-update-server/extension-updates.xml', updateXML, (err) => {
            if (err) {
                console.error('Error writing update XML:', err);
                return;
            }
            console.log('Update XML has been saved successfully');
        });
        fs.writeFile('./auto-update-server/auto-update-plugin_6.0.0.crx', crxBuffer, (err) => {
            if (err) {
                console.error('Error writing CRX:', err);
                return;
            }
            console.log('CRX has been saved successfully');
        });
    })
    .catch(err => {
        console.error(err);
    });