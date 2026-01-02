import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
} from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

const TermsAndConditions = () => {
  return (
    <Box>
      <Navbar />
      <Box sx={{ pt: 10, pb: 8, minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: { xs: 3, md: 6 }, mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#052F2A',
              }}
            >
              Terms and Conditions
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mb: 4 }}>
              <strong>Effective Date:</strong> October 26, 2024<br />
              <strong>Last Updated:</strong> October 26, 2024
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              1. Agreement to Terms
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              By downloading, installing, or using the Tijaniyah Muslim Pro mobile application ("App"), 
              you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, 
              please do not use the App.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              2. Description of Service
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              Tijaniyah Muslim Pro is a comprehensive Islamic mobile application designed to support Muslims 
              in their spiritual journey, particularly those following the Tijaniyya Tariqa. The App provides:
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              2.1 Core Features
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Prayer Times:</strong> Accurate prayer time calculations based on your location</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Qibla Compass:</strong> Direction to Mecca using device sensors</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Islamic Calendar:</strong> Hijri dates and Islamic holidays</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Azan Player:</strong> Beautiful Azan audio from around the world</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Digital Tasbih:</strong> Digital dhikr counter for spiritual practices</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Islamic Lessons:</strong> Educational content about Islam and Tijaniyya</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Community Features:</strong> Connect with fellow Muslims</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Donation System:</strong> Support Islamic causes and education</Typography></li>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              2.2 Tijaniyya-Specific Features
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Wazifa:</strong> Daily Islamic practices with proper niyyah (intention)</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Lazim:</strong> Morning and evening spiritual routines</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Zikr Jum'ah:</strong> Special Friday dhikr practices</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Niyyah Supplications:</strong> Proper intention prayers for all practices</Typography></li>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              3. User Accounts
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              3.1 Account Creation
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>You may create an account to access enhanced features</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>You must provide accurate and complete information</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>You are responsible for maintaining the security of your account</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>You must be at least 13 years old to create an account</Typography></li>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              3.2 Account Responsibilities
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Keep your login credentials secure</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Notify us immediately of any unauthorized use</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>You are responsible for all activities under your account</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>We reserve the right to suspend or terminate accounts for violations</Typography></li>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              4. Acceptable Use
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              4.1 Permitted Uses
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: '#333' }}>
              You may use the App for:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Personal spiritual development and Islamic practice</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Educational purposes related to Islam and Tijaniyya</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Community engagement with other Muslims</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Sharing Islamic knowledge and experiences</Typography></li>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              4.2 Prohibited Uses
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: '#333' }}>
              You may not use the App to:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Violate any applicable laws or regulations</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Infringe on intellectual property rights</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Spread misinformation about Islam or Islamic practices</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Harass, abuse, or harm other users</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Post inappropriate, offensive, or harmful content</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Attempt to hack, reverse engineer, or modify the App</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Use the App for commercial purposes without permission</Typography></li>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              5. Content and Intellectual Property
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              5.1 Our Content
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>The App and its content are owned by Tech Arena Group</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>All Islamic texts, audio, and educational materials are used with proper permissions</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Our original content is protected by copyright and other intellectual property laws</Typography></li>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              5.2 User-Generated Content
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>You retain ownership of content you create and share</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>By sharing content, you grant us a license to use it within the App</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>You are responsible for ensuring you have rights to any content you share</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>We reserve the right to remove content that violates these Terms</Typography></li>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              6. Privacy and Data Protection
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              Your privacy is important to us. Our collection and use of your information is governed by our Privacy Policy, 
              which is incorporated into these Terms by reference. Key points include: We collect location data for prayer 
              times and Qibla direction, We may collect usage data to improve the App, We do not sell your personal information, 
              You can control your privacy settings within the App.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              7. Disclaimers and Limitations
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              7.1 Religious Guidance
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              The App provides Islamic information and tools for spiritual practice. It is not a substitute for guidance 
              from qualified Islamic scholars. Users should consult local imams or Islamic scholars for religious questions. 
              We are not responsible for individual religious practices or interpretations.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              7.2 Technical Disclaimers
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              The App is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free 
              service. Prayer times and Qibla directions are calculated using standard algorithms. Users should verify 
              critical information independently when possible.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              7.3 Limitation of Liability
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              To the maximum extent permitted by law: We are not liable for any indirect, incidental, or consequential 
              damages, Our total liability is limited to the amount you paid for the App (if any), We are not responsible 
              for any loss of data or spiritual practices.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              8. App Store Terms
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              8.1 Download and Installation
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              The App is available through official app stores (App Store, Google Play). You must comply with the terms 
              of service of the respective app store. We are not responsible for app store policies or changes.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              8.2 Updates and Modifications
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              We may update the App from time to time. Updates may include new features, bug fixes, or security improvements. 
              Continued use of the App after updates constitutes acceptance of changes.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              9. Termination
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              9.1 By You
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              You may stop using the App at any time. You may delete your account through the App settings. Deletion of 
              your account will remove your personal data (subject to our Privacy Policy).
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              9.2 By Us
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: '#333' }}>
              We may terminate or suspend your access to the App if you:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Violate these Terms of Service</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Engage in harmful or illegal activities</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Misuse the App or its features</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Fail to comply with our policies</Typography></li>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              10. Governing Law and Dispute Resolution
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              These Terms are governed by applicable laws. We encourage resolving disputes through direct communication. 
              For formal disputes, we prefer mediation over litigation.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              11. Modifications to Terms
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              We may modify these Terms from time to time. We will notify you of significant changes by: Posting updated 
              Terms in the App, Sending email notifications to registered users, Updating the "Last Updated" date. Your 
              continued use of the App after changes constitutes acceptance of the updated Terms.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              12. Contact Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: '#333' }}>
              For questions about these Terms of Service, please contact us:
            </Typography>
            <Box sx={{ backgroundColor: '#F8F9FA', p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>
                <strong>Email:</strong> legal@tijaniyahmuslimpro.com<br />
                <strong>Support:</strong> Available through the App's help section<br />
                <strong>Address:</strong> Tech Arena Group, Legal Department
              </Typography>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#052F2A' }}>
                Tijaniyah Muslim Pro
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                Serving the Muslim community with technology and faith
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', mt: 2 }}>
                These Terms of Service are effective as of October 26, 2024, and apply to all users of the Tijaniyah Muslim Pro mobile application.
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default TermsAndConditions;

