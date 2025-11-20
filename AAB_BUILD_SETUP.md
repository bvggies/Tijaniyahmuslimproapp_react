# AAB Build Setup for Google Play Store

This guide explains how to build Android App Bundle (AAB) files for Google Play Store production using GitHub Actions.

## Overview

The AAB (Android App Bundle) format is required by Google Play Store for all new apps and app updates. This workflow builds a production-ready AAB file that can be uploaded directly to Google Play Console.

## Prerequisites

1. **GitHub Repository** - Your code must be in a GitHub repository
2. **Android Keystore** - A production signing keystore file (`.jks` or `.keystore`)
3. **GitHub Secrets** - Configure signing credentials as GitHub Secrets

## Setting Up Signing Secrets

### Step 1: Generate a Production Keystore

If you don't have a production keystore yet, generate one:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore upload-keystore.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

**Important**: Save the keystore file and passwords securely. You cannot recover them if lost!

### Step 2: Encode Keystore to Base64

Convert your keystore file to base64:

**On macOS/Linux:**
```bash
base64 -i upload-keystore.jks | pbcopy  # macOS
# or
base64 upload-keystore.jks | xclip -selection clipboard  # Linux
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("upload-keystore.jks")) | Set-Clipboard
```

### Step 3: Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

1. **ANDROID_KEYSTORE_BASE64**
   - Value: The base64-encoded keystore file (paste the entire output)

2. **ANDROID_KEY_ALIAS**
   - Value: The alias you used when creating the keystore (e.g., `upload`)

3. **ANDROID_KEYSTORE_PASSWORD**
   - Value: The password for the keystore file

4. **ANDROID_KEY_PASSWORD**
   - Value: The password for the key alias (can be the same as keystore password)

## Building the AAB File

### Option 1: Manual Trigger (Recommended)

1. Go to your GitHub repository
2. Click on **Actions** tab
3. Select **Build AAB for Google Play Production** workflow
4. Click **Run workflow**
5. Fill in:
   - **Version Code**: Increment this number for each release (e.g., 1, 2, 3...)
   - **Version Name**: User-facing version (e.g., 1.0.0, 1.0.1, 1.1.0)
6. Click **Run workflow**

### Option 2: Tag-Based Trigger

Create a git tag to automatically trigger the build:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The workflow will automatically extract the version from the tag.

## Downloading the AAB File

After the workflow completes:

1. Go to the **Actions** tab in GitHub
2. Click on the completed workflow run
3. Scroll down to **Artifacts**
4. Download **tijaniyah-pro-aab-production**
5. Extract the `app-release.aab` file

## Uploading to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app
3. Navigate to **Production** → **Create new release**
4. Click **Upload** and select your `app-release.aab` file
5. Fill in:
   - **Release name**: e.g., "Version 1.0.0"
   - **Release notes**: Describe what's new in this version
6. Review and submit for review

## Version Management

### Version Code
- Must be an integer
- Must increase with each release
- Cannot be decreased
- Example: 1, 2, 3, 4...

### Version Name
- User-facing version string
- Can be any format (e.g., 1.0.0, 1.0.1, 2.0.0)
- Example: "1.0.0", "1.0.1", "1.1.0"

## Troubleshooting

### Build Fails with Signing Error

**Problem**: "Keystore file not found" or "Signing config not found"

**Solution**: 
- Verify all GitHub Secrets are set correctly
- Check that `ANDROID_KEYSTORE_BASE64` contains the complete base64 string
- Ensure the keystore alias matches `ANDROID_KEY_ALIAS`

### Build Succeeds but AAB is Not Signed

**Problem**: AAB builds but shows as unsigned

**Solution**:
- Verify signing secrets are configured
- Check that the workflow step "Setup signing keystore" completed successfully
- Review the build logs for signing configuration messages

### Version Code Already Used

**Problem**: Google Play rejects upload with "Version code already used"

**Solution**:
- Increment the version code in the next build
- Check current version code in Google Play Console → App → Production

## Security Best Practices

1. **Never commit keystore files** to the repository
2. **Use GitHub Secrets** for all sensitive information
3. **Backup your keystore** file securely (encrypted storage)
4. **Document keystore location** in a secure password manager
5. **Use different keystores** for different apps

## Workflow Features

- ✅ Automatic Android project generation
- ✅ Production signing with GitHub Secrets
- ✅ Version code and name management
- ✅ AAB file generation
- ✅ Artifact upload (90-day retention)
- ✅ Automatic GitHub Release creation (on tags)

## Related Files

- `.github/workflows/build-aab-production.yml` - The workflow file
- `android/app/build.gradle` - Android build configuration
- `app.json` - Expo app configuration

## Additional Resources

- [Google Play Console](https://play.google.com/console)
- [Android App Bundle Guide](https://developer.android.com/guide/app-bundle)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Expo Prebuild Documentation](https://docs.expo.dev/workflow/prebuild/)

