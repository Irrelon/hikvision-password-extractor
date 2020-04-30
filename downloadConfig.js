const fs = require("fs");
const request = require("request");
const fileOut = "./data/configurationFile";

const downloadConfig = (ipAddress) => {
	fs.unlink(fileOut, () => {});
	return new Promise((resolve, reject) => {
		console.log("Getting config from", `http://${ipAddress}/System/configurationFile?auth=YWRtaW46MTEK`);
		const file = fs.createWriteStream(fileOut, { flags: "wx" });
		const req = request(`http://${ipAddress}/System/configurationFile?auth=YWRtaW46MTEK`);
		
		// verify response code
		req.on('response', (response) => {
			if (response.statusCode !== 200) {
				file.close();
				fs.unlink(fileOut, () => {});
				return reject('Response status was ' + response.statusCode);
			}
			
			req.pipe(file);
		});
		
		// close() is async, call cb after close completes
		file.on('finish', (result) => {
			resolve("./data/configurationFile");
		});
		
		file.on('error', (err) => { // Handle errors
			file.close();
			
			if (err.code === "EEXIST") {
				return reject("File already exists");
			}
			
			fs.unlink(fileOut, () => {});
			return reject(err);
		});
	});
};

module.exports = downloadConfig;
