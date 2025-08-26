# Network Access Configuration

## Overview
The TableMaster development server has been configured to be accessible over the local network, allowing you to test the application on other devices (mobile phones, tablets, other computers) on the same network.

## Configuration

### Angular CLI Configuration
Updated `angular.json` with network access settings:

```json
"serve": {
  "builder": "@angular/build:dev-server",
  "options": {
    "host": "0.0.0.0"
  }
}
```

### NPM Scripts
Added convenient script in `package.json`:

```json
"scripts": {
  "start": "ng serve",
  "start:network": "ng serve --host 0.0.0.0"
}
```

## Usage

### Option 1: Use Default Configuration (Recommended)
```bash
npm start
```
This will now automatically bind to `0.0.0.0` and show network URLs.

### Option 2: Use Network Script
```bash
npm run start:network
```

### Option 3: Manual Command Line
```bash
ng serve --host 0.0.0.0 --port 4203
```

## Network URLs

When the server starts, you'll see output like:
```
❯ Building...
✔ Building...

Watch mode enabled. Watching for file changes...
  ➜  Local:   http://localhost:4203/
  ➜  Network: http://10.0.0.48:4203/
  ➜  Network: http://100.127.37.16:4203/
  ➜  Network: http://172.20.0.1:4203/
```

## Accessing from Other Devices

1. **Find your machine's IP address** from the Network URLs shown
2. **Connect other devices to the same network** (WiFi/Ethernet)
3. **Open browser on other device** and navigate to any of the Network URLs
4. **Test the application** on different screen sizes and devices

### Common Network IP Ranges:
- `192.168.x.x` - Home/office WiFi networks
- `10.x.x.x` - Corporate networks
- `172.16-31.x.x` - Private networks

## Security Considerations

⚠️ **Security Warning**: Angular displays this warning when binding to `0.0.0.0`:

```
Warning: This is a simple server for use in testing or debugging Angular applications
locally. It hasn't been reviewed for security issues.

Binding this server to an open connection can result in compromising your application or
computer.
```

### Best Practices:
1. **Only use on trusted networks** (home, office)
2. **Don't expose to public internet**
3. **Stop server when not needed** (`Ctrl+C`)
4. **Use firewall if necessary**

## Troubleshooting

### Port Already in Use
If you see "Port 4200 is already in use":
```bash
npm run start:network -- --port 4203
```

### Device Can't Connect
1. **Check same network**: Ensure all devices are on the same WiFi/network
2. **Check firewall**: Disable firewall temporarily to test
3. **Check IP address**: Use the correct Network URL from terminal output
4. **Try different port**: Some networks block certain ports

### WebSocket Issues
If hot reload doesn't work on remote devices:
- This is normal for network access
- Refresh the page manually to see changes
- Development features work best on localhost

## Example Usage

### Testing on Mobile Device:
1. Start server: `npm start`
2. Note Network URL: `http://192.168.1.100:4200/`
3. Open mobile browser
4. Navigate to the Network URL
5. Test responsive design and touch interactions

### Testing on Tablet:
1. Same process as mobile
2. Test different orientations
3. Verify layout adapts correctly

## Performance Notes

- **Network access adds minimal overhead**
- **Build times remain the same**: ~1.15 seconds
- **Hot reload works on localhost**
- **Manual refresh needed on network devices**

The TableMaster application is now fully accessible across your local network for comprehensive testing! 🌐