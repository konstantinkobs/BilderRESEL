const fs = require('fs');
const glob = require('glob');
const CryptoJS = require('crypto-js');

// You have to set the password via the environment variable PASSWORD before calling this file.

// options is optional
glob('images/*.jpg', function (er, files) {
    files.forEach((file, index) => {
        const base64 = fs.readFileSync(file, { encoding: 'base64' });
		
        var ciphertext = CryptoJS.AES.encrypt(
			base64,
			process.env.PASSWORD
		).toString();

        fs.writeFileSync("enc/" + index + ".jpg", ciphertext);
    });

    fs.writeFileSync('enc/numimages.js', 'const numImages = ' + files.length + ";");
});
