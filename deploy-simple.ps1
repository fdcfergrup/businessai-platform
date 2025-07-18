# Simple Azure Deployment Script for BusinessAI
param(
    [string]$AppName = "businessai-app-$((Get-Random -Minimum 1000 -Maximum 9999))",
    [string]$ResourceGroup = "businessai-rg",
    [string]$Location = "Southeast Asia"
)

Write-Host "Starting BusinessAI deployment to Azure..." -ForegroundColor Green
Write-Host "App Name: $AppName" -ForegroundColor Cyan
Write-Host "Resource Group: $ResourceGroup" -ForegroundColor Cyan
Write-Host "Location: $Location" -ForegroundColor Cyan
Write-Host ""

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check Azure CLI
Write-Host "Checking Azure CLI..." -ForegroundColor Yellow
if (-not (Test-Command "az")) {
    Write-Host "Azure CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After installation, restart PowerShell and run this script again." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "Azure CLI found!" -ForegroundColor Green
}

# Login to Azure
Write-Host ""
Write-Host "Checking Azure login..." -ForegroundColor Yellow
$loginCheck = az account show 2>$null
if (-not $loginCheck) {
    Write-Host "Please login to Azure..." -ForegroundColor Yellow
    az login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Azure login failed" -ForegroundColor Red
        exit 1
    }
}
Write-Host "Azure login successful!" -ForegroundColor Green

# Create Resource Group
Write-Host ""
Write-Host "Creating Resource Group: $ResourceGroup" -ForegroundColor Yellow
az group create --name $ResourceGroup --location $Location
if ($LASTEXITCODE -ne 0) {
    Write-Host "Resource group creation failed or already exists" -ForegroundColor Yellow
}

# Create App Service Plan
Write-Host ""
Write-Host "Creating App Service Plan..." -ForegroundColor Yellow
$planName = "$AppName-plan"
az appservice plan create --name $planName --resource-group $ResourceGroup --sku F1 --is-linux

# Create Web App
Write-Host ""
Write-Host "Creating Web App: $AppName" -ForegroundColor Yellow
az webapp create --resource-group $ResourceGroup --plan $planName --name $AppName --runtime "NODE:20-lts"

# Configure App Settings
Write-Host ""
Write-Host "Configuring application settings..." -ForegroundColor Yellow
az webapp config appsettings set --resource-group $ResourceGroup --name $AppName --settings NODE_ENV=production SERVE_STATIC=true JWT_SECRET=businessai-super-secret-jwt-key-2024 MONGODB_URI=""

# Set startup command
Write-Host ""
Write-Host "Setting startup command..." -ForegroundColor Yellow
az webapp config set --resource-group $ResourceGroup --name $AppName --startup-file "server/index.js"

# Build client
Write-Host ""
Write-Host "Building client application..." -ForegroundColor Yellow
if (Test-Path "client") {
    Set-Location "client"
    npm install
    npm run build
    Set-Location ".."
    Write-Host "Client build completed!" -ForegroundColor Green
} else {
    Write-Host "Client directory not found" -ForegroundColor Yellow
}

# Create deployment package
Write-Host ""
Write-Host "Creating deployment package..." -ForegroundColor Yellow
$deploymentPath = "deployment.zip"
if (Test-Path $deploymentPath) {
    Remove-Item $deploymentPath -Force
}

# Compress files for deployment
$filesToInclude = @(
    "server",
    "client/build",
    "package.json",
    "web.config",
    ".deployment",
    "deploy.cmd"
)

$tempFiles = @()
foreach ($item in $filesToInclude) {
    if (Test-Path $item) {
        $tempFiles += Get-Item $item
    }
}

if ($tempFiles.Count -gt 0) {
    Compress-Archive -Path $tempFiles -DestinationPath $deploymentPath -Force
    Write-Host "Deployment package created: $deploymentPath" -ForegroundColor Green
} else {
    Write-Host "No files found for deployment" -ForegroundColor Red
    exit 1
}

# Deploy to Azure
Write-Host ""
Write-Host "Deploying to Azure..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Cyan

az webapp deployment source config-zip --resource-group $ResourceGroup --name $AppName --src $deploymentPath

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host "=================================" -ForegroundColor Green
    
    $appUrl = "https://$AppName.azurewebsites.net"
    Write-Host "Your BusinessAI app is now live at:" -ForegroundColor Cyan
    Write-Host $appUrl -ForegroundColor White
    Write-Host ""
    Write-Host "Azure Portal: https://portal.azure.com" -ForegroundColor Cyan
    Write-Host ""
    
    # Clean up
    Remove-Item $deploymentPath -Force -ErrorAction SilentlyContinue
    
    # Open app
    $openApp = Read-Host "Open app in browser? (y/n)"
    if ($openApp -eq "y" -or $openApp -eq "Y") {
        Start-Process $appUrl
    }
    
} else {
    Write-Host "Deployment failed!" -ForegroundColor Red
    Remove-Item $deploymentPath -Force -ErrorAction SilentlyContinue
    exit 1
}

Write-Host ""
Write-Host "Deployment completed!" -ForegroundColor Green