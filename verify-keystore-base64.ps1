# PowerShell script to verify keystore base64 string
# This helps ensure the base64 string is valid before adding to GitHub Secrets

Write-Host "=== Keystore Base64 Verification ===" -ForegroundColor Cyan
Write-Host ""

# Read the base64 string from github-secrets-values.txt
$secretsFile = "github-secrets-values.txt"
if (-not (Test-Path $secretsFile)) {
    Write-Host "❌ Error: github-secrets-values.txt not found!" -ForegroundColor Red
    Write-Host "Please run generate-github-secrets.ps1 first" -ForegroundColor Yellow
    exit 1
}

# Extract base64 string from the file
$content = Get-Content $secretsFile -Raw
if ($content -match 'ANDROID_KEYSTORE_BASE64\s*\n([A-Za-z0-9+/=\s]+)') {
    $base64String = $matches[1].Trim()
} else {
    Write-Host "❌ Error: Could not find ANDROID_KEYSTORE_BASE64 in $secretsFile" -ForegroundColor Red
    exit 1
}

# Remove all whitespace
$cleanedBase64 = $base64String -replace '\s', ''

Write-Host "Base64 String Analysis:" -ForegroundColor Yellow
Write-Host "  Original length: $($base64String.Length) characters"
Write-Host "  Cleaned length: $($cleanedBase64.Length) characters"
Write-Host ""

# Validate base64 format
$isValidBase64 = $true
$errors = @()

# Check length
if ($cleanedBase64.Length -lt 100) {
    $isValidBase64 = $false
    $errors += "Base64 string is too short (expected >100 characters, got $($cleanedBase64.Length))"
}

# Check for valid base64 characters
if ($cleanedBase64 -notmatch '^[A-Za-z0-9+/=]+$') {
    $isValidBase64 = $false
    $invalidChars = ($cleanedBase64 -replace '[A-Za-z0-9+/=]', '') | Select-Object -Unique
    $errors += "Contains invalid characters: $($invalidChars -join ', ')"
}

# Try to decode
Write-Host "Attempting to decode base64..." -ForegroundColor Yellow
try {
    $bytes = [Convert]::FromBase64String($cleanedBase64)
    $decodedSize = $bytes.Length
    Write-Host "✅ Base64 decoded successfully!" -ForegroundColor Green
    Write-Host "  Decoded size: $decodedSize bytes" -ForegroundColor White
    
    # Check if it looks like a keystore file (should start with specific bytes)
    if ($decodedSize -gt 0) {
        $firstBytes = $bytes[0..3]
        $hexString = ($firstBytes | ForEach-Object { $_.ToString("X2") }) -join ' '
        Write-Host "  First 4 bytes (hex): $hexString" -ForegroundColor White
        
        # PKCS12 keystores typically start with specific magic bytes
        if ($bytes[0] -eq 0x30 -or $bytes[0] -eq 0xFE -or $bytes[0] -eq 0xFF) {
            Write-Host "  ✅ File format looks valid" -ForegroundColor Green
        } else {
            Write-Host "  ⚠️  Warning: File format might not be a valid keystore" -ForegroundColor Yellow
        }
    }
} catch {
    $isValidBase64 = $false
    $errors += "Failed to decode base64: $($_.Exception.Message)"
}

Write-Host ""

if ($isValidBase64) {
    Write-Host "✅ Base64 string is VALID and ready for GitHub Secrets!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Copy the cleaned base64 string below" -ForegroundColor White
    Write-Host "2. Go to GitHub Secrets: https://github.com/bvggies/Tijaniyahmuslimproapp_react/settings/secrets/actions" -ForegroundColor White
    Write-Host "3. Add/Update ANDROID_KEYSTORE_BASE64 secret" -ForegroundColor White
    Write-Host "4. Paste the cleaned base64 string (all on one line, no spaces)" -ForegroundColor White
    Write-Host ""
    Write-Host "Cleaned Base64 String (copy this):" -ForegroundColor Yellow
    Write-Host $cleanedBase64 -ForegroundColor White
    Write-Host ""
    
    # Save cleaned version to file
    $cleanedFile = "keystore-base64-cleaned.txt"
    $cleanedBase64 | Out-File -FilePath $cleanedFile -Encoding ASCII -NoNewline
    Write-Host "✅ Cleaned base64 saved to: $cleanedFile" -ForegroundColor Green
} else {
    Write-Host "❌ Base64 string is INVALID!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Errors found:" -ForegroundColor Yellow
    foreach ($error in $errors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Please check your keystore file and regenerate the base64 string." -ForegroundColor Yellow
    exit 1
}

