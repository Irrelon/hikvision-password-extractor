const fs = require("fs");

const findAuth = (pathIn, username = "admin") => {
	return new Promise((resolve) => {
		const decodedString = fs.readFileSync(pathIn).toString();
		
		// Auto-find admin and password combinations
		const rexp = /admin([^a-zA-Z\d]*?)([a-zA-Z\d]*?)([^a-zA-Z\d]*?)ÿÿÿÿ                                  /g;
		
		const result = decodedString.matchAll(rexp);
		const resultArr = Array.from(result);
		
		resolve(resultArr);
	});
};

module.exports = findAuth;
