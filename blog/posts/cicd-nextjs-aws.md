# CI/CD for Next.js on AWS EC2

Continuous Integration and Continuous Deployment (CI/CD) is a crucial practice for modern web development. In this guide, we will explore how to set up a CI/CD pipeline for a Next.js application hosted on AWS EC2.

---

## Prerequisites

Before starting, ensure you have the following:

1. **AWS Account**: Access to AWS services.
2. **EC2 Instance**: A running EC2 instance with Node.js installed.
3. **GitHub Repository**: Your Next.js project hosted on GitHub.
4. **AWS CLI**: Installed and configured on your local machine.

---

## Step 1: Set Up the EC2 Instance

1. **Launch an EC2 Instance**:
    - Choose an Amazon Linux 2 or Ubuntu AMI.
    - Configure security groups to allow SSH and HTTP/HTTPS traffic.

2. **Install Dependencies**:
    ```bash
    sudo yum update -y
    sudo yum install git -y
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo yum install -y nodejs
    ```

3. **Clone Your Repository**:
    ```bash
    git clone https://github.com/your-username/your-nextjs-repo.git
    cd your-nextjs-repo
    npm install
    ```

4. **Run the Application**:
    ```bash
    npm run build
    npm start
    ```

---

## Step 2: Configure GitHub Actions for CI/CD

1. **Create a `.github/workflows/deploy.yml` File**:
    ```yaml
    name: Deploy to AWS EC2

    on:
      push:
         branches:
            - main

    jobs:
      deploy:
         runs-on: ubuntu-latest

         steps:
         - name: Checkout Code
            uses: actions/checkout@v3

         - name: Set up Node.js
            uses: actions/setup-node@v3
            with:
              node-version: 16

         - name: Install Dependencies
            run: npm install

         - name: Build Project
            run: npm run build

         - name: Deploy to EC2
            env:
              AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
              AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
              HOST: ${{ secrets.EC2_HOST }}
              USER: ${{ secrets.EC2_USER }}
            run: |
              scp -r ./build $USER@$HOST:/var/www/nextjs
              ssh $USER@$HOST "pm2 restart all"
    ```

2. **Add Secrets to GitHub**:
    - Go to your repository settings and add the following secrets:
      - `AWS_ACCESS_KEY_ID`
      - `AWS_SECRET_ACCESS_KEY`
      - `EC2_HOST` (Public IP of your EC2 instance)
      - `EC2_USER` (e.g., `ec2-user`)

---

## Step 3: Automate Deployment

1. **Install PM2 on EC2**:
    ```bash
    sudo npm install -g pm2
    pm2 start npm --name "nextjs-app" -- start
    pm2 save
    pm2 startup
    ```

2. **Update Security Groups**:
    - Ensure port 3000 (or your app's port) is open in the EC2 security group.

3. **Test the Pipeline**:
    - Push changes to the `main` branch and verify the deployment.

---

## Conclusion

By setting up a CI/CD pipeline for your Next.js application on AWS EC2, you can streamline your development workflow and ensure faster, more reliable deployments. This setup can be further enhanced with monitoring tools and automated rollback strategies.

Happy coding!