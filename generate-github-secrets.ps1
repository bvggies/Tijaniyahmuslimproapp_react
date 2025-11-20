# PowerShell script to generate GitHub Secrets for Android signing
# This script will help you encode your keystore and prepare secrets for GitHub

Write-Host "=== GitHub Secrets Generator for Android Signing ===" -ForegroundColor Cyan
Write-Host ""

# Check if keystore exists
if (-not (Test-Path "upload-keystore.jks")) {
    Write-Host "ERROR: upload-keystore.jks not found!" -ForegroundColor Red
    Write-Host "Please generate a keystore first using:" -ForegroundColor Yellow
    Write-Host "keytool -genkeypair -v -storetype PKCS12 -keystore upload-keystore.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000" -ForegroundColor Yellow
    exit 1
}

Write-Host "Found keystore: upload-keystore.jks" -ForegroundColor Green
Write-Host ""

# Prompt for keystore password
$keystorePassword = Read-Host "Enter keystore password" -AsSecureString
$keystorePasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($keystorePassword))

# Prompt for key password (usually same as keystore password)
Write-Host ""
$keyPassword = Read-Host "Enter key password (press Enter to use same as keystore password)" -AsSecureString
if ($keyPassword.Length -eq 0) {
    $keyPasswordPlain = $keystorePasswordPlain
} else {
    $keyPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($keyPassword))
}

# Set alias (default: upload)
$alias = "upload"

# Encode keystore to Base64
Write-Host ""
Write-Host "Encoding keystore to Base64..." -ForegroundColor Yellow
$keystoreBytes = [System.IO.File]::ReadAllBytes("$PWD\upload-keystore.jks")
$keystoreBase64 = [Convert]::ToBase64String($keystoreBytes)

# Display the secrets
Write-Host ""
Write-Host "=== GitHub Secrets to Add ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. ANDROID_KEYSTORE_BASE64" -ForegroundColor Green
Write-Host "   Value:" -ForegroundColor Yellow
Write-Host $keystoreBase64 -ForegroundColor White
Write-Host ""

Write-Host "2. ANDROID_KEY_ALIAS" -ForegroundColor Green
Write-Host "   Value: $alias" -ForegroundColor White
Write-Host ""

Write-Host "3. ANDROID_KEYSTORE_PASSWORD" -ForegroundColor Green
Write-Host "   Value: $keystorePasswordPlain" -ForegroundColor White
Write-Host ""

Write-Host "4. ANDROID_KEY_PASSWORD" -ForegroundColor Green
Write-Host "   Value: $keyPasswordPlain" -ForegroundColor White
Write-Host ""

# Save to file for easy copy-paste
$secretsFile = "github-secrets.txt"
@"
=== GitHub Secrets for Android Signing ===

1. ANDROID_KEYSTORE_BASE64
$keystoreBase64

2. ANDROID_KEY_ALIAS
$alias

3. ANDROID_KEYSTORE_PASSWORD
$keystorePasswordPlain

4. ANDROID_KEY_PASSWORD
$keyPasswordPlain

=== Instructions ===
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret with the name and value above
"@ | Out-File -FilePath $secretsFile -Encoding UTF8

Write-Host "Secrets have been saved to: $secretsFile" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy the secrets above" -ForegroundColor White
Write-Host "2. Go to: https://github.com/bvggies/Tijaniyahmuslimproapp_react/settings/secrets/actions" -ForegroundColor White
Write-Host "3. Add each secret as a new repository secret" -ForegroundColor White
Write-Host ""

