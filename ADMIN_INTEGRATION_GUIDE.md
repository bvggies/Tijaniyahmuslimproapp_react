# Admin Dashboard Integration Guide

## 🚀 Quick Integration Steps

### 1. **Add Admin Dashboard to Main App Navigation**

Add the admin dashboard to your main app's navigation. Here's how to integrate it:

#### **Option A: Add to Settings Screen**
```typescript
// In your SettingsScreen.tsx
import AdminMainScreen from '../screens/AdminMainScreen';

// Add this to your settings list
const settingsItems = [
  // ... existing settings
  {
    id: 'admin',
    title: 'Admin Panel',
    subtitle: 'Manage app content',
    icon: 'shield-checkmark',
    onPress: () => navigation.navigate('AdminPanel'),
  },
];
```

#### **Option B: Add as Hidden Menu Item**
```typescript
// Add a hidden admin access (e.g., tap app logo 5 times)
const handleLogoPress = () => {
  setLogoPressCount(prev => prev + 1);
  if (logoPressCount >= 4) {
    navigation.navigate('AdminPanel');
  }
};
```

### 2. **Update Navigation Stack**

Add the admin panel to your navigation stack:

```typescript
// In your main navigation file (e.g., AppNavigator.tsx)
import AdminMainScreen from '../screens/AdminMainScreen';
import { AdminAuthProvider } from '../contexts/AdminAuthContext';

// Add to your stack navigator
<Stack.Screen 
  name="AdminPanel" 
  component={AdminMainScreen} 
  options={{ headerShown: false }}
/>

// Wrap your app with AdminAuthProvider
<AdminAuthProvider>
  {/* Your existing app components */}
</AdminAuthProvider>
```

### 3. **Environment Configuration**

Create environment variables for admin settings:

```typescript
// In your .env file
ADMIN_EMAIL=admin@tijaniyahpro.com
ADMIN_PASSWORD=admin123
ADMIN_ENABLED=true
```

### 4. **Add Admin Context to App**

Wrap your main app with the AdminAuthProvider:

```typescript
// In your App.tsx or main component
import { AdminAuthProvider } from './src/contexts/AdminAuthContext';

export default function App() {
  return (
    <AdminAuthProvider>
      {/* Your existing app structure */}
      <NavigationContainer>
        {/* Your navigation */}
      </NavigationContainer>
    </AdminAuthProvider>
  );
}
```

## 🔧 **Configuration Options**

### **Access Control**
You can control admin access in several ways:

1. **Hidden Access**: Tap app logo multiple times
2. **Settings Menu**: Add to settings screen
3. **Secret Code**: Enter a secret code in settings
4. **User Role**: Check if user has admin role

### **Demo Credentials**
The admin dashboard comes with demo credentials:

- **Super Admin**: admin@tijaniyahpro.com / admin123
- **Moderator**: moderator@tijaniyahpro.com / moderator123

### **Customization**
You can customize the admin dashboard by:

1. **Colors**: Update colors in `src/utils/theme.ts`
2. **Permissions**: Modify permissions in `AdminAuthContext.tsx`
3. **Features**: Enable/disable features in settings
4. **Branding**: Update logos and app name

## 📱 **Usage Examples**

### **Basic Integration**
```typescript
// Simple integration in SettingsScreen
const AdminButton = () => {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity
      style={styles.adminButton}
      onPress={() => navigation.navigate('AdminPanel')}
    >
      <Ionicons name="shield-checkmark" size={24} color={colors.accentTeal} />
      <Text style={styles.adminButtonText}>Admin Panel</Text>
    </TouchableOpacity>
  );
};
```

### **Conditional Access**
```typescript
// Show admin button only for specific users
const AdminButton = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  
  if (!user?.isAdmin) return null;
  
  return (
    <TouchableOpacity
      style={styles.adminButton}
      onPress={() => navigation.navigate('AdminPanel')}
    >
      <Ionicons name="shield-checkmark" size={24} color={colors.accentTeal} />
      <Text style={styles.adminButtonText}>Admin Panel</Text>
    </TouchableOpacity>
  );
};
```

### **Secret Access**
```typescript
// Secret admin access via code
const SecretAdminAccess = () => {
  const [code, setCode] = useState('');
  const navigation = useNavigation();
  
  const checkCode = () => {
    if (code === 'ADMIN2024') {
      navigation.navigate('AdminPanel');
      setCode('');
    }
  };
  
  return (
    <View style={styles.secretAccess}>
      <TextInput
        style={styles.codeInput}
        placeholder="Enter admin code"
        value={code}
        onChangeText={setCode}
        secureTextEntry
      />
      <TouchableOpacity style={styles.submitButton} onPress={checkCode}>
        <Text>Access Admin</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## 🎨 **Styling Integration**

### **Theme Integration**
The admin dashboard uses the same theme as your main app:

```typescript
// In src/utils/theme.ts
export const colors = {
  // Your existing colors
  accentTeal: '#2E7D32',
  accentGreen: '#4CAF50',
  // ... other colors
};
```

### **Custom Styling**
You can customize the admin dashboard appearance:

```typescript
// Override admin styles
const customAdminStyles = StyleSheet.create({
  header: {
    backgroundColor: '#your-brand-color',
  },
  sidebar: {
    backgroundColor: '#your-sidebar-color',
  },
});
```

## 🔐 **Security Considerations**

### **Access Control**
- Admin access should be restricted
- Use strong authentication
- Implement session timeout
- Log all admin activities

### **Data Protection**
- Encrypt sensitive data
- Use secure storage
- Implement backup encryption
- Regular security audits

## 📊 **Analytics Integration**

### **Track Admin Usage**
```typescript
// Track admin panel usage
const trackAdminAccess = () => {
  analytics.track('admin_panel_accessed', {
    timestamp: new Date().toISOString(),
    user_id: user.id,
  });
};
```

### **Monitor Admin Actions**
```typescript
// Track admin actions
const trackAdminAction = (action: string, details: any) => {
  analytics.track('admin_action', {
    action,
    details,
    timestamp: new Date().toISOString(),
    admin_id: adminUser.id,
  });
};
```

## 🚀 **Deployment**

### **Production Setup**
1. Update admin credentials
2. Enable security features
3. Configure backup settings
4. Set up monitoring
5. Test all features

### **Environment Variables**
```bash
# Production environment
ADMIN_EMAIL=your-admin@domain.com
ADMIN_PASSWORD=your-secure-password
ADMIN_ENABLED=true
BACKUP_ENABLED=true
ANALYTICS_ENABLED=true
```

## 🔄 **Updates & Maintenance**

### **Regular Updates**
- Update admin credentials
- Review user permissions
- Monitor system logs
- Backup data regularly
- Update security patches

### **Feature Updates**
- Add new admin features
- Improve user interface
- Enhance security
- Optimize performance
- Add new integrations

## 📞 **Support**

### **Troubleshooting**
- Check network connectivity
- Verify admin credentials
- Review error logs
- Test in development mode
- Contact support team

### **Documentation**
- Read the full README
- Check API documentation
- Review code comments
- Test with demo data
- Follow best practices

---

**Ready to integrate?** Follow these steps and you'll have a fully functional admin dashboard in your Tijaniyah Muslim Pro app!
