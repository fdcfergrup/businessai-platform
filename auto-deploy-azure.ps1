# BusinessAI - Auto Deploy to Azure Script
# This script will install Azure CLI and deploy the application automatically

param(
    [string]$AppName = "businessai-app-$((Get-Random -Minimum 1000 -Maximum 9999))",
    [string]$ResourceGroup = "businessai-rg",
    [string]$Location = "Southeast Asia"
)

Write-Host "🚀 BusinessAI Auto-Deploy to Azure" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Function to check if command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Step 1: Install Azure CLI if not present
Write-Host "🔍 Checking Azure CLI installation..." -ForegroundColor Yellow
if (-not (Test-Command "az")) {
    Write-Host "📥 Azure CLI not found. Installing..." -ForegroundColor Yellow
    
    # Download Azure CLI installer
    $installerUrl = "https://aka.ms/installazurecliwindows"
    $installerPath = "$env:TEMP\AzureCLI.msi"
    
    try {
        Write-Host "⬇️ Downloading Azure CLI installer..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $installerUrl -OutFile $installerPath -UseBasicParsing
        
        Write-Host "🔧 Installing Azure CLI..." -ForegroundColor Yellow
        Start-Process msiexec.exe -Wait -ArgumentList "/I $installerPath /quiet"
        
        # Refresh PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        Write-Host "✅ Azure CLI installed successfully!" -ForegroundColor Green
        
        # Clean up
        Remove-Item $installerPath -ErrorAction SilentlyContinue
    }
    catch {
        Write-Host "❌ Failed to install Azure CLI automatically." -ForegroundColor Red
        Write-Host "Please install manually from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows" -ForegroundColor Yellow
        Write-Host "Then run this script again." -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ Azure CLI is already installed" -ForegroundColor Green
}

# Step 2: Login to Azure
Write-Host ""
Write-Host "🔐 Azure Login" -ForegroundColor Yellow
Write-Host "Please login to your Azure account in the browser window that will open..." -ForegroundColor Cyan

try {
    # Check if already logged in
    $loginCheck = az account show 2>$null
    if (-not $loginCheck) {
        az login
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Azure login failed" -ForegroundColor Red
            exit 1
        }
    }
    Write-Host "✅ Successfully logged in to Azure" -ForegroundColor Green
} catch {
    Write-Host "❌ Azure login failed" -ForegroundColor Red
    exit 1
}

# Step 3: Create Resource Group
Write-Host ""
Write-Host "📦 Creating Azure Resource Group: $ResourceGroup" -ForegroundColor Yellow
az group create --name $ResourceGroup --location $Location --output table
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Resource group might already exist, continuing..." -ForegroundColor Yellow
}

# Step 4: Create App Service Plan
Write-Host ""
Write-Host "🏗️ Creating App Service Plan..." -ForegroundColor Yellow
$planName = "$AppName-plan"
az appservice plan create --name $planName --resource-group $ResourceGroup --sku F1 --is-linux --output table

# Step 5: Create Web App
Write-Host ""
Write-Host "🌐 Creating Web App: $AppName" -ForegroundColor Yellow
az webapp create --resource-group $ResourceGroup --plan $planName --name $AppName --runtime "NODE|18-lts" --output table

# Step 6: Configure App Settings
Write-Host ""
Write-Host "⚙️ Configuring application settings..." -ForegroundColor Yellow
az webapp config appsettings set --resource-group $ResourceGroup --name $AppName --settings `
    NODE_ENV=production `
    SERVE_STATIC=true `
    JWT_SECRET=businessai-super-secret-jwt-key-2024 `
    MONGODB_URI="" `
    --output table

# Step 7: Set startup command
Write-Host ""
Write-Host "🔧 Configuring startup command..." -ForegroundColor Yellow
az webapp config set --resource-group $ResourceGroup --name $AppName --startup-file "server/index.js" --output table

# Step 8: Build client application
Write-Host ""
Write-Host "🔨 Building client application..." -ForegroundColor Yellow
if (Test-Path "client") {
    Push-Location "client"
    try {
        Write-Host "📦 Installing client dependencies..." -ForegroundColor Cyan
        npm install --silent
        
        Write-Host "🏗️ Building React application..." -ForegroundColor Cyan
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Client build successful!" -ForegroundColor Green
        } else {
            Write-Host "❌ Client build failed!" -ForegroundColor Red
            Pop-Location
            exit 1
        }
    }
    finally {
        Pop-Location
    }
} else {
    Write-Host "⚠️ Client directory not found, skipping build..." -ForegroundColor Yellow
}

# Step 9: Create deployment package
Write-Host ""
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow

$deploymentPath = "deployment.zip"
if (Test-Path $deploymentPath) {
    Remove-Item $deploymentPath -Force
}

# Files to exclude from deployment
$excludePatterns = @(
    "node_modules",
    ".git",
    "*.zip",
    "*.ps1",
    ".env",
    "README.md",
    ".gitignore",
    "docker-compose.yml",
    "Dockerfile",
    ".dockerignore"
)

# Get all files except excluded ones
$allFiles = Get-ChildItem -Path "." -Recurse -File
$filesToZip = $allFiles | Where-Object { 
    $file = $_
    $shouldExclude = $false
    
    foreach ($pattern in $excludePatterns) {
        if ($file.FullName -like "*$pattern*") {
            $shouldExclude = $true
            break
        }
    }
    
    -not $shouldExclude
}

Write-Host "📁 Files to deploy: $($filesToZip.Count)" -ForegroundColor Cyan
Compress-Archive -Path $filesToZip.FullName -DestinationPath $deploymentPath -Force

# Step 10: Deploy to Azure
Write-Host ""
Write-Host "🚀 Deploying to Azure Web App..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Cyan

az webapp deployment source config-zip --resource-group $ResourceGroup --name $AppName --src $deploymentPath --output table

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
    Write-Host "=================================" -ForegroundColor Green
    
    $appUrl = "https://$AppName.azurewebsites.net"
    Write-Host "🌐 Your BusinessAI app is now live at:" -ForegroundColor Cyan
    Write-Host "   $appUrl" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 Azure Portal:" -ForegroundColor Cyan
    Write-Host "   https://portal.azure.com" -ForegroundColor White
    Write-Host ""
    Write-Host "🔍 To monitor your app:" -ForegroundColor Cyan
    Write-Host "   1. Go to Azure Portal" -ForegroundColor White
    Write-Host "   2. Navigate to App Services > $AppName" -ForegroundColor White
    Write-Host "   3. Check 'Log stream' for real-time logs" -ForegroundColor White
    Write-Host ""
    
    # Clean up deployment file
    Remove-Item $deploymentPath -Force -ErrorAction SilentlyContinue
    
    # Ask if user wants to open the app
    $openApp = Read-Host "Would you like to open the app in your browser? (y/n)"
    if ($openApp -eq "y" -or $openApp -eq "Y" -or $openApp -eq "yes") {
        Write-Host "🔗 Opening app in browser..." -ForegroundColor Yellow
        Start-Process $appUrl
    }
    
    Write-Host ""
    Write-Host "✨ Deployment Summary:" -ForegroundColor Green
    Write-Host "   App Name: $AppName" -ForegroundColor White
    Write-Host "   Resource Group: $ResourceGroup" -ForegroundColor White
    Write-Host "   Location: $Location" -ForegroundColor White
    Write-Host "   URL: $appUrl" -ForegroundColor White
    
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Please check the error messages above and try again." -ForegroundColor Yellow
    
    # Clean up on failure
    Remove-Item $deploymentPath -Force -ErrorAction SilentlyContinue
    exit 1
}

Write-Host ""
Write-Host "🎊 Thank you for using BusinessAI Auto-Deploy!" -ForegroundColor Green