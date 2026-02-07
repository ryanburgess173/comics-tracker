# VM Setup Quick Reference

Quick reference for setting up Ubuntu Server 24.04 LTS VM for Comics Tracker API deployment.

## Finding VM Network Information

```bash
# Get VM's local IP address
ip addr show

# Look for the inet address under your network interface (ens33, eth0, etc.)
# Example output: inet 192.168.255.128/24
# Your IP is: 192.168.255.128

# Get Tailscale IP (if Tailscale is installed)
tailscale ip -4
# Example output: 100.74.157.105
```

## Installing Required Software

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install OpenSSH Server
sudo apt install openssh-server -y
sudo systemctl start ssh
sudo systemctl enable ssh

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2
```

## Generate SSH Key for GitHub Actions

```bash
# Generate ED25519 key specifically for GitHub Actions deployment
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# When prompted for passphrase, press Enter (leave empty)

# Add the public key to authorized_keys
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/github_actions_deploy
chmod 644 ~/.ssh/github_actions_deploy.pub

# Display the PRIVATE key to copy to GitHub Secrets
cat ~/.ssh/github_actions_deploy
# Copy the ENTIRE output (including BEGIN and END lines)
# Add this as VM_SSH_PRIVATE_KEY secret in GitHub repository settings
```

## Setting Up Tailscale

```bash
# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Start Tailscale (this will output a login URL)
sudo tailscale up

# Copy the URL and open it in a browser to authenticate
# Sign in with your GitHub account

# Verify connection
tailscale status

# Disable Tailscale SSH (use regular SSH instead)
sudo tailscale set --ssh=false
```

## Setting Up PM2

```bash
# Navigate to your app directory
cd ~/comics-tracker/api

# Install dependencies
npm ci

# Build the application
npm run build

# Start the app with PM2
pm2 start out/index.js --name comics-tracker-api

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
# Copy and run the command that gets displayed

# View PM2 status
pm2 list

# View logs
pm2 logs comics-tracker-api

# Restart app
pm2 restart comics-tracker-api
```

## Firewall Configuration

```bash
# Check UFW status
sudo ufw status

# Allow SSH
sudo ufw allow ssh

# Allow your app port (if needed from local network)
sudo ufw allow from 192.168.0.0/16 to any port 3000

# Enable firewall (if not already enabled)
sudo ufw enable
```

## Network Access

- **From VM to app**: `http://localhost:3000`
- **From host machine**: `http://192.168.255.128:3000` (use actual VM IP)
- **Via Tailscale**: `http://100.x.x.x:3000` (use actual Tailscale IP)
- **GitHub Actions**: Uses Tailscale IP for deployment

## Useful Commands

```bash
# Check what's listening on port 3000
sudo ss -tlnp | grep 3000

# Check app is bound to all interfaces (should show 0.0.0.0:3000)
sudo lsof -i :3000 -n -P

# View PM2 logs in real-time
pm2 logs comics-tracker-api --lines 0

# Check systemd journal for PM2
journalctl -u pm2-ubuntu -n 50

# Restart Tailscale if needed
sudo systemctl restart tailscaled
```

## Troubleshooting

**Can't access app from host machine:**

- Verify VM IP with `ip addr show`
- Check app is listening on 0.0.0.0: `sudo ss -tlnp | grep 3000`
- Check firewall: `sudo ufw status`

**PM2 not starting on boot:**

- Run `pm2 startup systemd` and execute the provided command
- After starting your app, run `pm2 save`

**Tailscale connection issues:**

- Check status: `tailscale status`
- Restart: `sudo systemctl restart tailscaled`
- Re-authenticate: `sudo tailscale up`
