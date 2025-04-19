# Setting Up Next.js in AWS

Next.js is a powerful React framework for building server-rendered applications. Hosting it on AWS ensures scalability and reliability. In this guide, we'll walk through the steps to deploy a Next.js application in AWS using EC2 and PM2.

## Prerequisites

Before starting, ensure you have the following:
- An AWS account.
- Node.js and npm installed on your local machine.
- A Next.js application ready to deploy.

## Step 1: Launch an EC2 Instance

1. Log in to the AWS Management Console.
2. Navigate to the **EC2** service and click **Launch Instance**.
3. Choose an Amazon Machine Image (AMI) with Node.js pre-installed or select a base Linux AMI and install Node.js manually.
4. Select an instance type (e.g., t2.micro for testing).
5. Configure security groups to allow HTTP (port 80) and SSH (port 22) traffic.
6. Launch the instance and download the key pair for SSH access.

## Step 2: Prepare the EC2 Instance

1. SSH into your EC2 instance:
    ```bash
    ssh -i <your-key-pair.pem> ec2-user@<your-ec2-public-ip>
    ```
2. Update the package manager and install Git:
    ```bash
    sudo yum update -y
    sudo yum install git -y
    ```
3. Install Node.js and npm (if not pre-installed):
    ```bash
    curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
    sudo yum install -y nodejs
    ```

## Step 3: Deploy Your Next.js Application

1. Clone your Next.js project from your Git repository:
    ```bash
    git clone <your-repo-url>
    cd <your-project-folder>
    ```
2. Install dependencies and build the application:
    ```bash
    npm install
    npm run build
    ```

## Step 4: Use PM2 to Manage the Application

1. Install PM2 globally:
    ```bash
    sudo npm install -g pm2
    ```
2. Start your Next.js application with PM2:
    ```bash
    pm2 start npm --name "nextjs-app" -- start
    ```
3. Save the PM2 process list and enable it to start on boot:
    ```bash
    pm2 save
    pm2 startup
    ```

## Step 5: Configure a Reverse Proxy (Optional)

For production, it's recommended to use a reverse proxy like NGINX:
1. Install NGINX:
    ```bash
    sudo yum install nginx -y
    ```
2. Configure NGINX to forward traffic to your Next.js application running on port 3000.
3. Restart NGINX:
    ```bash
    sudo systemctl restart nginx
    ```

## Conclusion

Using EC2 and PM2 to deploy a Next.js application provides a robust and scalable solution. PM2 ensures your application stays online, while EC2 offers flexibility in managing your infrastructure.

Happy coding!