# GitHub Secrets Setup Guide

This guide will help you generate and add the required secrets to GitHub for Android app signing.

## Step 1: Generate Base64 Encoded Keystore

Run this PowerShell command to encode your keystore:

```powershell
# Encode keystore to Base64
$keystoreBytes = [System.IO.File]::ReadAllBytes("$PWD\upload-keystore.jks")
$keystoreBase64 = [Convert]::ToBase64String($keystoreBytes)
$keystoreBase64 | Set-Clipboard
Write-Host "Base64 keystore copied to clipboard!"
```

Or use the provided script:
```powershell
.\generate-github-secrets.ps1
```

## Step 2: Get Your Keystore Information

You need to know:
- **Keystore Password**: The password you used when creating the keystore
- **Key Alias**: Usually `upload` (default)
- **Key Password**: Usually the same as keystore password

If you don't remember, you can check the keystore info:
```powershell
keytool -list -v -keystore upload-keystore.jks
```

## Step 3: Add Secrets to GitHub

1. Go to your GitHub repository: https://github.com/bvggies/Tijaniyahmuslimproapp_react
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add each secret one by one:

### Secret 1: ANDROID_KEYSTORE_BASE64
- **Name**: `ANDROID_KEYSTORE_BASE64`
- **Value**: Paste the Base64 encoded keystore (from Step 1)

### Secret 2: ANDROID_KEY_ALIAS
- **Name**: `ANDROID_KEY_ALIAS`
- **Value**: `upload` (or your alias name)

### Secret 3: ANDROID_KEYSTORE_PASSWORD
- **Name**: `ANDROID_KEYSTORE_PASSWORD`
- **Value**: Your keystore password

### Secret 4: ANDROID_KEY_PASSWORD
- **Name**: `ANDROID_KEY_PASSWORD`
- **Value**: Your key password (usually same as keystore password)

## Quick PowerShell Script

Run this to get all values at once:

```powershell
# Read keystore and encode
$keystoreBytes = [System.IO.File]::ReadAllBytes("$PWD\upload-keystore.jks")
$keystoreBase64 = [Convert]::ToBase64String($keystoreBytes)

# Prompt for passwords
$keystorePassword = Read-Host "Enter keystore password" -AsSecureString
$keystorePasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($keystorePassword))

$keyPassword = Read-Host "Enter key password (Enter for same as keystore)" -AsSecureString
if ($keyPassword.Length -eq 0) {
    $keyPasswordPlain = $keystorePasswordPlain
} else {
    $keyPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($keyPassword))
}

# Display results
Write-Host "`n=== GitHub Secrets ===" -ForegroundColor Cyan
Write-Host "`n1. ANDROID_KEYSTORE_BASE64" -ForegroundColor Green
Write-Host $keystoreBase64
Write-Host "`n2. ANDROID_KEY_ALIAS" -ForegroundColor Green
Write-Host "upload"
Write-Host "`n3. ANDROID_KEYSTORE_PASSWORD" -ForegroundColor Green
Write-Host $keystorePasswordPlain
Write-Host "`n4. ANDROID_KEY_PASSWORD" -ForegroundColor Green
Write-Host $keyPasswordPlain
```

## Verify Secrets Are Added

After adding all secrets, the workflow will automatically use them when building. The workflow will:
- Build AAB file signed with your production keystore
- Build APK file signed with your production keystore
- Both files will be ready for Google Play Store upload

## Troubleshooting

If you get errors about missing secrets:
1. Double-check all 4 secrets are added correctly
2. Make sure secret names match exactly (case-sensitive)
3. Verify the Base64 string is complete (no line breaks)
4. Check that passwords match your keystore

## Security Notes

- ⚠️ **Never commit** the keystore file or passwords to Git
- ⚠️ **Keep backups** of your keystore file securely
- ⚠️ **Don't share** your keystore passwords
- ✅ The keystore file is in `.gitignore` and won't be committed

