# IBS-Care-App

An EHR Launch Web App for IBS Analysis and Predictions.

## 🚀 Technologies Used
- **React** + **TypeScript** + **Vite**
- **Bun** (Package Manager & Build Tool)
- **MUI (Material UI)** for UI Components
- **OIDC-Client-TS** for Authentication
- **Recharts** for Data Visualization
- **Docker** & **GitHub Actions** for CI/CD

---

## 📦 Project Structure
```
IBS-Care-App/
├── public/
├── src/
│   ├── components/
│   ├── services/
│   └── utils/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── bun.lockb
└── vite.config.ts
```

---

## ⚙️ Local Development

### 1️⃣ **Clone the Repository:**
```bash
git clone https://github.com/LimogiAI/IBS-Care-App.git
cd IBS-Care-App
```

### 2️⃣ **Install Dependencies:**
```bash
bun install
```

### 3️⃣ **Run the App Locally:**
```bash
bun run dev
```

- The app will be running on: [http://localhost:4434](http://localhost:4434)

### 4️⃣ **Build for Production:**
```bash
bun run build
```

---

## 🐳 Docker Setup

### **1. Build the Docker Image Locally:**
```bash
docker build -t ibs-care-app:latest .
```

### **2. Run with Docker Compose:**
```bash
docker-compose up -d
```

- Access the app at: [http://localhost:4434](http://localhost:4434)

### **3. Docker Compose File:**
```yaml
version: '3.8'

services:
  ibs-care-app:
    image: ghcr.io/limogiai/ibs-care-app:latest
    ports:
      - "4434:80"
    restart: unless-stopped
```

---

## 🔄 GitHub Actions CI/CD Pipeline

### **Workflow:** `.github/workflows/docker-build-push.yml`

- **Trigger:** On push to the `main` branch
- **Steps:**
  1. Checkout code
  2. Build Docker image
  3. Push to GitHub Container Registry (GHCR)

### **Adding Secrets:**
1. Go to your repository **Settings → Secrets → Actions → New Repository Secret**.
2. Add a secret named `GHCR_PAT` with your GitHub Personal Access Token (PAT).

### **Sample Workflow Configuration:**
```yaml
name: 🚀 Build and Push Docker Image

on:
  push:
    branches:
      - main

jobs:
  build-and-push:
    runs-on: ubuntu-latest

    steps:
      - name: 📥 Checkout Code
        uses: actions/checkout@v3

      - name: 🔑 Set Up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: 🔐 Login to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GHCR_PAT }}

      - name: 🐳 Build and Push Docker Image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: |
            ghcr.io/limogiai/ibs-care-app:latest
            ghcr.io/limogiai/ibs-care-app:${{ github.sha }}

      - name: ✅ Verify Image Pushed
        run: echo "Docker image pushed successfully!"
```

---

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a pull request

---

## 📄 License

Licensed under the [Apache-2.0 License](./LICENSE).

---

**Made with ❤️ by LimogiAI Solutions Inc.**

