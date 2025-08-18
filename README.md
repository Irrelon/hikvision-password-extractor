# Hikvision Password Extractor

A modernized Node.js tool to extract and decrypt passwords from Hikvision camera configuration files.

The tool will connect to the camera and try to download the configuration file. If successful it will then decrypt it, decode (XOR) it and then output any passwords that were found.

You can then try each password it found until you are able to access the NVR or camera whose password you have forgotten.

This password extraction tool is only possible because Hikvision really sucks at security AND customer service. Well done Hikvision, bravo.

---

## Features

- ✅ **Modern ES Modules**: Updated to use ES6 imports/exports
- ✅ **Async/Await**: Clean asynchronous code patterns
- ✅ **Node.js v23+ Compatible**: Fixed HTTP parsing issues with newer Node.js versions
- ✅ **Better Error Handling**: Comprehensive error messages and stack traces
- ✅ **Improved File Operations**: Uses modern fs/promises API
- ✅ **Zero Dependencies**: Removed deprecated packages, uses only Node.js built-ins

## Requirements

- Node.js >= 18.0.0
  - If you have Volta installed, then just run the `node` command and it will do the rest
- IP address of the camera

## Installation

```bash
// Clone the repository
git clone https://github.com/Irrelon/hikvision-password-extractor.git

// Navigate into the project directory
cd hikvision-password-extractor
```

## Usage

```bash
node index.js <IP_ADDRESS_OF_CAMERA>
```

### Examples

```bash
# Extract passwords for default 'admin' user
node index.js 192.168.1.100

# Using npm script
npm start 192.168.1.100
```

---

## How to get IP Address of Camera

Download the SADP tool from Hikvision and run it. You should see your Hikvision devices on your network listed. Make sure you have your computer plugged into the same network as your cameras - if you don't know how to do this, you can sk in various forums for help first.

Once you have the SADP tool up and running, note down the IP of one of the cameras that is running firmware 5.4.0 or lower.

---

## How it Works

1. **Download**: Retrieves configuration file from Hikvision device using raw TCP sockets
2. **AES Decrypt**: Decrypts the file using Node.js built-in crypto module
3. **XOR Decode**: Applies XOR decryption to reveal plain text
4. **Extract**: Searches for password patterns in the decoded data

## What's New in v2.0

### Fixed Issues

- ✅ **HTTP Parser Error**: Fixed "Expected HTTP/" error with Node.js v23+
- ✅ **Binary Data Handling**: Improved handling of encrypted binary responses
- ✅ **Stream Processing**: Better error handling for response streams

### Modernization

- 🔄 **ES Modules**: Converted from CommonJS to ES6 modules
- 🔄 **Async/Await**: Replaced callbacks and promises chains
- 🔄 **Built-in Crypto**: Replaced OpenSSL dependency with Node.js crypto module
- 🔄 **Raw Socket Download**: Fixed Node.js v23+ HTTP parsing issues with TCP sockets
- 🔄 **File Operations**: Using fs/promises for better async handling
- 🔄 **Error Messages**: More descriptive error messages
- 🔄 **Path Handling**: Absolute paths and better cross-platform support

### Removed

- ❌ **External Dependencies**: No more OpenSSL or deprecated npm packages required
- ❌ **Legacy Code**: Cleaned up outdated patterns

## Troubleshooting

If your camera is running a later firmware version, simply flash it back to the firmware version that includes this exploit. You can then re-flash it to the latest firmware again once you've reset your password.
Ideally below 5.4.0 (thought 5.4.0 should also work)

### "Connection timeout" or "Connection refused"

- Verify the camera IP address is correct
- Ensure the camera is powered on and connected to the network
- Check if the camera's web interface is accessible

### "No passwords found"

- The camera might use different encryption or firmware version
- The password extraction pattern might need adjustment for your model
- Load an older version of the firmware.

### "AES decryption failed"

- The configuration file might be corrupted or use a different encryption method
- Verify the file was downloaded completely
- Some newer firmware versions may use different encryption keys

## Security Notice

This tool is intended for legitimate security testing and password recovery on devices you own or have permission to test. Use responsibly and in accordance with applicable laws and regulations.
