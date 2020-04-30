const fs = require("fs");
const chef = require("cyberchef");
const keyHex = "738B5544";

const decryptXor = (pathIn = "./data/decryptedOutput.bin", pathOut = "./data/decodedOutput.txt") => {
	return new Promise((resolve) => {
		const fileContents = fs.readFileSync(pathIn);
		const decodedContents = chef.bake(new chef.Dish(fileContents), [{"op": "XOR", "args": [{"option": "Hex", "string": keyHex}, "Standard", false]}]);
		const decodedString = decodedContents.toString();
		
		fs.writeFileSync(pathOut, decodedString);
		
		resolve(pathOut);
	});
};

module.exports = decryptXor;
