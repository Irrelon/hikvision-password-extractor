import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const keyHex = "738B5544";

// Convert hex string to buffer
const hexToBuffer = (hex) => {
  return Buffer.from(hex, "hex");
};

// XOR function to replace cyberchef XOR operation
const xorBuffers = (data, key) => {
  const result = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) {
    result[i] = data[i] ^ key[i % key.length];
  }
  return result;
};

const decryptXor = async (pathIn, pathOut) => {
  if (!pathIn) {
    pathIn = path.join(__dirname, "data", "decryptedOutput.bin");
  }
  if (!pathOut) {
    pathOut = path.join(__dirname, "data", "decodedOutput.txt");
  }

  // Ensure output directory exists
  await fs.mkdir(path.dirname(pathOut), { recursive: true });

  try {
    const fileContents = await fs.readFile(pathIn);
    const keyBuffer = hexToBuffer(keyHex);
    const decodedContents = xorBuffers(fileContents, keyBuffer);
    const decodedString = decodedContents.toString("utf8");

    await fs.writeFile(pathOut, decodedString, "utf8");

    return pathOut;
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(`Input file not found: ${pathIn}`);
    }
    throw new Error(`XOR decryption failed: ${err.message}`);
  }
};

export default decryptXor;
