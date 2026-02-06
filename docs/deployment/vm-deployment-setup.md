# API Deployment Setup Guide

This guide walks you through setting up automated deployment of the Comics Tracker API to your Ubuntu VM using GitHub Actions and Tailscale.

## Prerequisites

- [ ] Ubuntu VM with Tailscale installed and authenticated
- [ ] PM2 installed on the VM
- [ ] Node.js and npm installed on the VM
- [ ] Git repository cloned on the VM
- [ ] Database configured on the VM

## 1. VM Setup

### Install Required Software on Your VM

```bash
# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Setup PM2 to start on system boot
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

# Clone your repository (if not already done)
cd ~
git clone https://github.com/YOUR_USERNAME/comics-tracker.git
cd comics-tracker/api

# Install dependencies
npm ci

# Build the application
npm run build

# Setup environment variables
cp .env.example .env
nano .env  # Edit with your production values
```

### Initial PM2 Setup

```bash
cd ~/comics-tracker/api
pm2 start out/index.js --name comics-tracker-api
pm2 save
```

## 2. Generate SSH Key for GitHub Actions

On your **VM**, generate a new SSH key pair:

```bash
# Generate ED25519 key (recommended)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Add the public key to authorized_keys
cat ~/.ssh/github_actions_deploy.pub >> ~/.ssh/authorized_keys

# Display the private key (you'll need to copy this)
cat ~/.ssh/github_actions_deploy
```

**Important:** Copy the entire private key output (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)

## 3. Get Your VM's Tailscale IP

On your **VM**, run:

```bash
tailscale ip -4
```

This will output something like: `100.101.102.103`

Copy this IP address.

## 4. Create Tailscale OAuth Client

1. Go to https://login.tailscale.com/admin/settings/oauth
2. Click **Generate OAuth client**
3. Add these tags: `tag:ci`
4. Copy the **Client ID** and **Client Secret**

**Alternative:** You can also use an auth key:

1. Go to https://login.tailscale.com/admin/settings/keys
2. Generate a reusable auth key
3. Make sure "Ephemeral" is unchecked and add tag `tag:ci`

## 5. Configure GitHub Repository Secrets

Go to your GitHub repository: **Settings → Secrets and variables → Actions**

Click **New repository secret** and add the following:

| Secret Name                 | Value                    | Description                                     |
| --------------------------- | ------------------------ | ----------------------------------------------- |
| `TAILSCALE_OAUTH_CLIENT_ID` | Your OAuth Client ID     | From Tailscale OAuth settings                   |
| `TAILSCALE_OAUTH_SECRET`    | Your OAuth Client Secret | From Tailscale OAuth settings                   |
| `VM_SSH_PRIVATE_KEY`        | Your private key         | The entire content from `github_actions_deploy` |
| `VM_TAILSCALE_IP`           | `100.x.x.x`              | Your VM's Tailscale IP address                  |
| `VM_SSH_USER`               | `ubuntu`                 | Your VM username (usually `ubuntu`)             |
| `VM_APP_PATH`               | `~/comics-tracker`       | Path to your app on the VM                      |

## 6. Configure Tailscale ACLs (Access Control)

To allow GitHub Actions to connect to your VM:

1. Go to https://login.tailscale.com/admin/acls
2. Add this to your ACL configuration:

```json
{
  "tagOwners": {
    "tag:ci": ["autogroup:admin"]
  },
  "acls": [
    {
      "action": "accept",
      "src": ["tag:ci"],
      "dst": ["*:*"]
    }
  ]
}
```

## 7. Test the Deployment

### Option 1: Push to develop branch

```bash
git checkout develop
git add .
git commit -m "Test deployment workflow"
git push origin develop
```

### Option 2: Manually trigger (if you add workflow_dispatch)

Go to **Actions** tab in GitHub → Select **Deploy API to VM** → Click **Run workflow**

## 8. Monitor the Deployment

1. Go to your repository's **Actions** tab
2. Click on the latest workflow run
3. Watch the deployment steps in real-time

## 9. Verify on Your VM

SSH into your VM and check:

```bash
# Check PM2 status
pm2 list

# View application logs
pm2 logs comics-tracker-api

# Check if the API is responding
curl http://localhost:3000/api/health  # Adjust port as needed
```

## Troubleshooting

### SSH Connection Fails

```bash
# On your VM, check SSH is running
sudo systemctl status ssh

# Verify the authorized_keys permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### Tailscale Connection Issues

```bash
# On your VM, check Tailscale status
tailscale status

# Restart Tailscale if needed
sudo systemctl restart tailscaled
```

### PM2 Process Not Starting

```bash
# Check PM2 logs
pm2 logs comics-tracker-api --lines 100

# Check for port conflicts
sudo lsof -i :3000  # Replace 3000 with your API port

# Manually test the built app
cd ~/comics-tracker/api
node out/index.js
```

### Database Migration Fails

```bash
# Verify database connection
cd ~/comics-tracker/api
npm run migrate:status

# Check .env file has correct database credentials
cat .env | grep DB_
```

## Environment Variables

Make sure your VM has a `.env` file in the `api` directory with:

```env
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_NAME=comics_tracker
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
# Add other required environment variables
```

## Security Best Practices

1. Never commit the private SSH key to your repository
2. Use GitHub Secrets for all sensitive information
3. Regularly rotate your Tailscale OAuth credentials
4. Use a dedicated SSH key for GitHub Actions (not your personal key)
5. Keep your VM and dependencies updated
6. Use firewall rules on your VM
7. Monitor PM2 logs regularly

## Next Steps

- [ ] Set up log rotation for PM2
- [ ] Configure health checks
- [ ] Set up monitoring (e.g., Uptime Kuma)
- [ ] Add rollback capability
- [ ] Set up staging environment
- [ ] Configure automatic backups

## Additional PM2 Commands

```bash
# View logs
pm2 logs comics-tracker-api

# Monitor resources
pm2 monit

# Restart app
pm2 restart comics-tracker-api

# Stop app
pm2 stop comics-tracker-api

# Delete app from PM2
pm2 delete comics-tracker-api

# Save current PM2 state
pm2 save

# Resurrect saved processes after reboot
pm2 resurrect
```

## Useful Links

- [Tailscale GitHub Action](https://github.com/tailscale/github-action)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
