import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const decryptFile = async (pathIn, pathOut) => {
  if (!pathOut) {
    pathOut = path.join(__dirname, "data", "decryptedOutput.bin");
  }

  // Ensure output directory exists
  await fs.mkdir(path.dirname(pathOut), { recursive: true });

  // Validate input file exists
  try {
    await fs.access(pathIn);
  } catch (err) {
    throw new Error(`Input file not found: ${pathIn}`);
  }

  try {
    // Read the encrypted file
    const encryptedData = await fs.readFile(pathIn);

    // AES-128-ECB decryption using Node.js crypto
    const key = Buffer.from("279977f62f6cfd2d91cd75b889ce0c9a", "hex");
    const decipher = crypto.createDecipheriv("aes-128-ecb", key, null);

    // Disable auto padding to match OpenSSL behavior
    decipher.setAutoPadding(false);

    let decrypted = decipher.update(encryptedData);
    const final = decipher.final();

    // Combine the chunks
    decrypted = Buffer.concat([decrypted, final]);

    // Write the decrypted data
    await fs.writeFile(pathOut, decrypted);

    // Verify output file was created
    try {
      await fs.access(pathOut);
    } catch (err) {
      throw new Error(
        `Decryption failed - output file not created: ${pathOut}`
      );
    }

    return pathOut;
  } catch (err) {
    if (err.code === "ENOENT") {
      throw new Error(`Input file not found: ${pathIn}`);
    }
    throw new Error(`AES decryption failed: ${err.message}`);
  }
};

export default decryptFile;
