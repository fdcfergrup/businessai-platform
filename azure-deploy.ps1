# Azure Deployment Script for BusinessAI
# Run this script in PowerShell

Write-Host "🚀 Starting Azure deployment for BusinessAI..." -ForegroundColor Green

# Variables
$resourceGroup = "businessai-rg"
$appName = "businessai-app-$(Get-Random -Minimum 1000 -Maximum 9999)"
$location = "Southeast Asia"
$sku = "F1"  # Free tier

# Check if Azure CLI is installed
try {
    az --version | Out-Null
    Write-Host "✅ Azure CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure CLI is not installed. Please install it first:" -ForegroundColor Red
    Write-Host "https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Yellow
    exit 1
}

# Login to Azure (if not already logged in)
Write-Host "🔐 Checking Azure login status..." -ForegroundColor Yellow
$loginStatus = az account show 2>$null
if (-not $loginStatus) {
    Write-Host "Please login to Azure..." -ForegroundColor Yellow
    az login
}

# Create resource group
Write-Host "📦 Creating resource group: $resourceGroup" -ForegroundColor Yellow
az group create --name $resourceGroup --location $location

# Create App Service plan
Write-Host "🏗️ Creating App Service plan..." -ForegroundColor Yellow
az appservice plan create --name "$appName-plan" --resource-group $resourceGroup --sku $sku --is-linux

# Create Web App
Write-Host "🌐 Creating Web App: $appName" -ForegroundColor Yellow
az webapp create --resource-group $resourceGroup --plan "$appName-plan" --name $appName --runtime "NODE|18-lts"

# Configure app settings
Write-Host "⚙️ Configuring app settings..." -ForegroundColor Yellow
az webapp config appsettings set --resource-group $resourceGroup --name $appName --settings `
    NODE_ENV=production `
    SERVE_STATIC=true `
    JWT_SECRET=businessai-super-secret-jwt-key-2024 `
    MONGODB_URI=""

# Configure startup command
az webapp config set --resource-group $resourceGroup --name $appName --startup-file "server/index.js"

# Deploy code (ZIP deployment)
Write-Host "📤 Preparing deployment package..." -ForegroundColor Yellow

# Create deployment package
$deploymentPath = "deployment.zip"
if (Test-Path $deploymentPath) {
    Remove-Item $deploymentPath
}

# Compress files (excluding node_modules and .git)
$excludePatterns = @("node_modules", ".git", "*.zip", "azure-deploy.ps1")
$filesToZip = Get-ChildItem -Path "." -Recurse | Where-Object { 
    $exclude = $false
    foreach ($pattern in $excludePatterns) {
        if ($_.FullName -like "*$pattern*") {
            $exclude = $true
            break
        }
    }
    -not $exclude
}

Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
Compress-Archive -Path $filesToZip -DestinationPath $deploymentPath -Force

# Deploy to Azure
Write-Host "🚀 Deploying to Azure..." -ForegroundColor Yellow
az webapp deployment source config-zip --resource-group $resourceGroup --name $appName --src $deploymentPath

# Clean up
Remove-Item $deploymentPath

# Get the URL
$appUrl = "https://$appName.azurewebsites.net"
Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Your app is available at: $appUrl" -ForegroundColor Cyan
Write-Host "📊 Monitor your app: https://portal.azure.com" -ForegroundColor Cyan

# Open the app in browser
Write-Host "🔗 Opening app in browser..." -ForegroundColor Yellow
Start-Process $appUrl