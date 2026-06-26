# Deployment Guide - Vellum & Vestige Art Director on Render.com

This guide provides step-by-step instructions for hosting the V&V Art Director web application remotely using **Render.com**. 

Render hosts both the React Vite frontend and the Node.js/Express backend server dynamically from your repository.

---

## 1. Prepare Code for Production

1. **Port Bindings**: Ensure your server binds to the dynamic port injected by Render's environment. The application is configured to do this automatically:
   ```typescript
   const PORT = parseInt(process.env.PORT || "3000", 10);
   ```
2. **Git Repository**: Initialize a Git repository in the project root (if not already done) and push it to your GitHub/GitLab account:
   ```bash
   git init
   git add .
   git commit -m "Configure multi-volume art director suite"
   # Push to your remote repo
   ```

---

## 2. Setup Web Service on Render

1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Connect your Git repository (GitHub/GitLab).
4. Configure the service parameters:
   - **Name**: `vv-art-director` (or your preferred name)
   - **Environment**: `Node`
   - **Branch**: `main` (or active development branch)
   - **Root Directory**: Leave blank (root of repository)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Select **Free** (or Starter for higher resources)

---

## 3. Configure Secrets & Environment Variables

Render needs your Google Gemini API Key to compile and generate photorealistic monographs.

1. In the Web Service configuration menu, navigate to the **Environment** tab.
2. Click **Add Environment Variable**:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `[Your Actual Google Gemini API Key]`
3. Click **Save Changes**.

---

## 4. Setup a Persistent Disk (Critical for Images)

Because Render's container filesystems are ephemeral (resetting on deployments and restarts), any generated images written to the root `/generations` folder would be lost without a persistent mount.

1. Navigate to the **Disks** tab in your Render Web Service dashboard.
2. Click **Add Disk**:
   - **Name**: `generations-disk` (alphanumeric characters and hyphens only)
   - **Mount Path**: `/generations` (This maps directly to the root generations folder serving our images)
   - **Size**: `1 GB` (More than enough for storing thousands of monograph image cards)
3. Click **Save Changes**.

---

## 5. Deploy & Verify

1. Render will trigger an automatic build and deployment pipeline.
2. Watch the logs in the **Logs** tab of the dashboard to ensure:
   - React compilation bundle builds successfully.
   - The Express server starts and binds to the Render port.
   - The `/generations` disk is successfully attached and mounted.
3. Once the deployment status turns green (**Live**), click your public service URL (e.g. `https://vv-art-director.onrender.com`) to access your suite remotely from any device.
