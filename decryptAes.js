const { exec } = require('child_process');

const decryptFile = (pathIn, pathOut = "./data/decryptedOutput.bin") => {
	return new Promise((resolve, reject) => {
		exec(`openssl enc -d -in ${pathIn} -out ${pathOut} -aes-128-ecb -K 279977f62f6cfd2d91cd75b889ce0c9a -nosalt -md md5`, (err, stdout, stderr) => {
			if (stderr && stderr.indexOf("bad decrypt") === -1) {
				// This isn't an error we expect, (bad decrypt still produces
				// the correct output so we ignore that)
				return reject(stderr);
			}
			
			// Completed
			resolve(pathOut);
		});
	});
};

module.exports = decryptFile;
