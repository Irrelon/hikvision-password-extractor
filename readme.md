# Hikvision NVR and Camera Password Extraction Tool
## Why?
Hikvision refuses to talk to customers directly and will only
help you with a forgotten password / password reset on the
devices they manufacture if you are an installer or other
"professional" - as if it requires some magic knowledge to
request a password reset.

After my own experience of using their SADP tool to try and
reset my NVR password and then Hikvision responding, "Hikvision
CCTV equipment is commercial graded product and should be
installed and maintained by a Hikvision recognised partner.

We do not directly support End Users with Technical issues,
we support Professional Installation Companies and
Distributors only, who then in turn will support their
Clients."

Condescending and arrogant tone aside, I was annoyed enough
to build a tool to exploit their rubbish coding and extract
passwords via any camera connected to an NVR that is running
firmware 5.4.0 or lower.

It's my god damn NVR and I paid for it, I'm not going to
PAY someone to reset a forgotten password!!!

## How?
All device passwords are stored in configuration files that
are completely open to download. See:

https://packetstormsecurity.com/files/144097/Hikvision-IP-Camera-Access-Bypass.html

I suggest that once you get access back to your system you
ensure that it is not accessible from the internet since
this exploit will allow any attacker to take control of your
network. It wouldn't take me very long to craft a new 
firmware that I could then upload to a camera on any network
and allow me internal access to that network even through
a firewall. Lock your cameras down please... don't trust any
device, especially if you buy it from China.

### Get the IP address of one of your Hikvision cameras
> If you know the IP address of one of your cameras already
  you can skip this step entirely

Download the SADP tool from Hikvision and run it. You should
see your Hikvision devices on your network listed. Make sure 
you have your computer plugged into the same network as your
cameras - if you don't know how to do this, you can ask in
various forums for help first.

Once you have the SADP tool up and running, note down the IP
of one of the cameras that is running firmware 5.4.0 or lower.

### Use the tool
Open the terminal app and run:

```bash
node index.js <camera ip address>
```

e.g.

```bash
node index.js 192.168.50.100
```

The tool will connect to the camera and try to download the
configuration file. If successful it will then decrypt it,
decode (XOR) it and then output any passwords that were found.

You can then try each password it found until you are able
to access the NVR or camera whose password you have forgotten.

This password extraction tool is only possible because Hikvision
really sucks at security AND customer service. Well done
Hikvision, bravo.

# Troubleshooting
If your camera is running a later firmware version, simply flash
it back to the firmware version that includes this exploit. You
can then re-flash it to the latest firmware again once you've
reset your password.
