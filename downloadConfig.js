import fs from "fs/promises";
import { createWriteStream } from "fs";
import net from "net";
import { URL } from "url";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fileOut = path.join(__dirname, "data", "configurationFile");

const downloadConfig = async (ipAddress) => {
  // Ensure data directory exists
  await fs.mkdir(path.dirname(fileOut), { recursive: true });

  // Remove existing file if it exists
  try {
    await fs.unlink(fileOut);
  } catch (err) {
    // Ignore if file doesn't exist
    if (err.code !== "ENOENT") {
      throw err;
    }
  }

  return new Promise((resolve, reject) => {
    const url = `http://${ipAddress}/System/configurationFile?auth=YWRtaW46MTEK`;
    console.log("Getting config from", url);

    const file = createWriteStream(fileOut);
    const parsedUrl = new URL(url);

    const socket = new net.Socket();
    let headersReceived = false;
    let headerBuffer = Buffer.alloc(0);
    let contentLength = 0;
    let statusCode = 0;

    socket.setTimeout(30000);

    socket.connect(parsedUrl.port || 80, parsedUrl.hostname, () => {
      const httpRequest = [
        `GET ${parsedUrl.pathname}${parsedUrl.search} HTTP/1.1`,
        `Host: ${parsedUrl.hostname}`,
        `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36`,
        `Accept: */*`,
        `Connection: close`,
        "",
        "",
      ].join("\r\n");

      socket.write(httpRequest);
    });

    socket.on("data", (chunk) => {
      if (!headersReceived) {
        headerBuffer = Buffer.concat([headerBuffer, chunk]);
        const headerEndIndex = headerBuffer.indexOf("\r\n\r\n");

        if (headerEndIndex !== -1) {
          headersReceived = true;
          const headerString = headerBuffer.slice(0, headerEndIndex).toString();
          const bodyStart = headerBuffer.slice(headerEndIndex + 4);

          // Parse headers
          const lines = headerString.split("\r\n");
          const statusLine = lines[0];
          statusCode = parseInt(statusLine.split(" ")[1]);

          console.log(`Response status: ${statusCode}`);

          // Parse headers
          const headers = {};
          for (let i = 1; i < lines.length; i++) {
            const [key, value] = lines[i].split(": ");
            if (key && value) {
              headers[key.toLowerCase()] = value;
            }
          }

          console.log("Response headers:", headers);
          contentLength = parseInt(headers["content-length"] || "0");

          if (statusCode !== 200) {
            socket.destroy();
            file.destroy();
            fs.unlink(fileOut).catch(() => {});
            return reject(new Error(`Response status was ${statusCode}`));
          }

          // Write the body part that was already received
          if (bodyStart.length > 0) {
            file.write(bodyStart);
          }
        }
      } else {
        // We're in the body, write directly to file
        file.write(chunk);
      }
    });

    socket.on("end", () => {
      file.end();
      console.log("Download completed");
      resolve(fileOut);
    });

    socket.on("timeout", () => {
      socket.destroy();
      file.destroy();
      fs.unlink(fileOut).catch(() => {});
      reject(new Error(`Request timeout to ${ipAddress}`));
    });

    socket.on("error", (err) => {
      file.destroy();
      fs.unlink(fileOut).catch(() => {});

      if (err.code === "ETIMEDOUT" || err.code === "ESOCKETTIMEDOUT") {
        return reject(
          new Error(
            `Connection timeout to ${ipAddress}. Please check if the device is reachable and responding.`
          )
        );
      }
      if (err.code === "ECONNREFUSED") {
        return reject(
          new Error(
            `Connection refused by ${ipAddress}. Please check if the device is online and the service is running.`
          )
        );
      }
      return reject(err);
    });

    file.on("error", (err) => {
      socket.destroy();
      file.destroy();
      fs.unlink(fileOut).catch(() => {});
      reject(new Error(`File write error: ${err.message}`));
    });
  });
};

export default downloadConfig;
