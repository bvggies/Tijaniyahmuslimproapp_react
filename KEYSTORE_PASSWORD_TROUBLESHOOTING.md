# Keystore Password Troubleshooting Guide

If you're getting the error **"keystore password was incorrect"** during the AAB build, follow these steps:

## Common Causes

1. **Password mismatch**: The password in GitHub Secrets doesn't match the actual keystore password
2. **Wrong keystore file**: The base64-encoded keystore doesn't match the one you're using
3. **Key alias mismatch**: The key alias in GitHub Secrets doesn't match the one in the keystore

## Verification Steps

### 1. Verify Your Keystore Locally

First, verify your keystore file works locally:

```bash
# Replace with your actual values
keytool -list -v -keystore your-keystore.jks -storepass YOUR_STORE_PASSWORD -alias YOUR_KEY_ALIAS
```

If this command fails locally, your keystore file or passwords are incorrect.

### 2. Verify GitHub Secrets

Make sure your GitHub Secrets match exactly:

- **ANDROID_KEYSTORE_BASE64**: Base64-encoded keystore file
- **ANDROID_KEYSTORE_PASSWORD**: Store password (password for the keystore file)
- **ANDROID_KEY_PASSWORD**: Key password (password for the specific key)
- **ANDROID_KEY_ALIAS**: Key alias (name of the key in the keystore)

**Important**: 
- Store password and key password can be different
- Make sure there are no extra spaces or newlines in the secrets
- The key alias is case-sensitive

### 3. Generate Base64 Keystore Correctly

To regenerate the base64 string:

**On Windows (PowerShell):**
```powershell
$bytes = [System.IO.File]::ReadAllBytes("path\to\your\keystore.jks")
$base64 = [System.Convert]::ToBase64String($bytes)
$base64 | Set-Clipboard
```

**On Linux/Mac:**
```bash
base64 -i your-keystore.jks | tr -d '\n' | pbcopy  # Mac
base64 -i your-keystore.jks | tr -d '\n' | xclip -selection clipboard  # Linux
```

### 4. Check Workflow Logs

The workflow now includes a verification step that will:
- Check if the keystore file exists
- Verify the keystore password using `keytool`
- Show clear error messages if verification fails

Look for these messages in the workflow logs:
- ✅ `Keystore password verified successfully` - Everything is correct
- ❌ `Keystore password verification failed!` - Password or alias is wrong

## Quick Fix Checklist

- [ ] Keystore file exists and is valid
- [ ] Store password matches the keystore password
- [ ] Key password matches the key password (if different from store password)
- [ ] Key alias matches exactly (case-sensitive)
- [ ] Base64 string is complete and valid (no truncation)
- [ ] No extra spaces or newlines in GitHub Secrets
- [ ] All secrets are set in GitHub repository settings

## Testing Locally

You can test the signing configuration locally before pushing:

```bash
cd android
./gradlew bundleRelease --no-daemon
```

If this works locally but fails on GitHub Actions, check:
1. GitHub Secrets are set correctly
2. Base64 string is complete
3. No special characters in passwords that might be interpreted differently

## Still Having Issues?

If you've verified everything above and still get errors:

1. **Regenerate the keystore** (if you have the original source):
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore upload-keystore.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Double-check all secrets** in GitHub:
   - Go to Settings → Secrets and variables → Actions
   - Verify each secret value is correct

3. **Check the workflow logs** for the verification step output

4. **Try building without signing first** to isolate the issue:
   - Temporarily comment out the signing configuration
   - Build with debug keystore to verify the build process works

