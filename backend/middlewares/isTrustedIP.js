exports.isTrustedIP = (req, res, next) => {
    const clientIP = req.ip.replace('::ffff:', '');
    console.log("Client IP =",clientIP)
    const allowedIPs = process.env.allowedIP.split(',')
    console.log(allowedIPs)
    if (allowedIPs.includes(clientIP)) {
        console.log("Access Successful")
        next();
    } else {
        res.status(403).send("Access Denied by trusted ip")
    }

}