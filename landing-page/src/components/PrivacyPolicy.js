import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import { Security, VerifiedUser, Lock, Policy } from '@mui/icons-material';
import Navbar from './Navbar';
import Footer from './Footer';

const PrivacyPolicy = () => {
  return (
    <Box>
      <Navbar />
      <Box sx={{ pt: { xs: 8, md: 10 }, pb: { xs: 4, md: 8 }, minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Paper 
            sx={{ 
              p: { xs: 2.5, sm: 3, md: 8 }, 
              mb: { xs: 2, md: 4 },
              borderRadius: { xs: 2, md: 4 },
              boxShadow: '0 8px 32px rgba(5, 47, 42, 0.1)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="Tijaniyah Muslim Pro"
                sx={{
                  height: 60,
                  width: 'auto',
                }}
              />
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                    color: '#052F2A',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                  }}
                >
                  Privacy Policy
                </Typography>
                <Chip
                  icon={<Security />}
                  label="Last Updated: October 26, 2024"
                  sx={{
                    backgroundColor: '#052F2A15',
                    color: '#052F2A',
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>
            <Divider sx={{ my: 4, borderColor: '#052F2A20' }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 4 }}>
              <Policy sx={{ color: '#052F2A', fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#052F2A' }}>
                1. Introduction
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.9, color: '#444', fontSize: '1.05rem' }}>
              Tijaniyah Muslim Pro ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our mobile application ("App"). Please read this Privacy Policy carefully. 
              If you do not agree with the terms of this Privacy Policy, please do not access the App.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 5 }}>
              <Lock sx={{ color: '#052F2A', fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#052F2A' }}>
                2. Information We Collect
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              2.1 Personal Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: '#333' }}>
              We may collect personal information that you voluntarily provide to us when you:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Create an account or profile</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Use our community features</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Contact us for support</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Participate in surveys or feedback forms</Typography></li>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              This may include: Name and email address, Profile picture (if you choose to upload one), 
              Location data (for prayer times and Qibla direction), Device information and usage statistics.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              2.2 Automatically Collected Information
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: '#333' }}>
              When you use our App, we automatically collect certain information, including:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Device information (device type, operating system, unique device identifiers)</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Usage data (features used, time spent in the App, crash reports)</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Location data (with your permission, for accurate prayer times and Qibla direction)</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Camera and microphone access (for profile pictures and audio features)</Typography></li>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              2.3 Islamic Practice Data
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              We collect data related to your Islamic practices, including: Prayer time preferences and settings, 
              Tasbih counts and spiritual progress, Journal entries and reflections, Community interactions and discussions.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 5 }}>
              <VerifiedUser sx={{ color: '#052F2A', fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#052F2A' }}>
                3. How We Use Your Information
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: '#333' }}>
              We use the collected information for the following purposes:
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              3.1 Core App Functionality
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Prayer Times:</strong> Calculate accurate prayer times based on your location</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Qibla Direction:</strong> Provide compass direction to Mecca</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Islamic Calendar:</strong> Display Hijri dates and Islamic holidays</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Digital Tasbih:</strong> Track your dhikr and spiritual practices</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}><strong>Audio Features:</strong> Play Azan and Islamic audio content</Typography></li>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              3.2 Personalization
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              Customize your experience based on your preferences, remember your settings and preferences, 
              and provide personalized Islamic content and guidance.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              3.3 Community Features
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              Enable interaction with other users in community forums, facilitate sharing of Islamic knowledge 
              and experiences, and moderate content to maintain respectful discussions.
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 5 }}>
              <Security sx={{ color: '#052F2A', fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#052F2A' }}>
                4. Information Sharing and Disclosure
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              We do not sell, trade, or otherwise transfer your personal information to third parties without 
              your consent, except in the following circumstances:
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              4.1 Service Providers
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              We may share your information with trusted third-party service providers who assist us in operating 
              our App, including: Cloud storage providers for data backup, Analytics services for App improvement, 
              Push notification services, Payment processors (for donation features).
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              4.2 Legal Requirements
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              We may disclose your information if required to do so by law or in response to valid requests by public authorities.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              5. Data Security
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              We implement appropriate technical and organizational security measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. These measures include: Encryption of 
              data in transit and at rest, Regular security assessments and updates, Access controls and authentication 
              measures, Secure data storage and backup procedures.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              6. Data Retention
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              We retain your personal information only for as long as necessary to fulfill the purposes outlined in this 
              Privacy Policy, unless a longer retention period is required or permitted by law. Specifically: Account 
              information is retained while your account is active, Usage data is retained for up to 2 years for analytics 
              purposes, Location data is retained only while necessary for App functionality, Community posts are retained 
              according to your account settings.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              7. Your Rights and Choices
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: '#333' }}>
              Depending on your location, you may have the following rights regarding your personal information:
            </Typography>
            <Box component="ul" sx={{ pl: 4, mb: 3 }}>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Request access to your personal information</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Receive a copy of your data in a portable format</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Correct inaccurate personal information</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Request deletion of your personal information</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Disable location services, push notifications, or analytics tracking</Typography></li>
              <li><Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>Object to certain processing of your information</Typography></li>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              8. Children's Privacy
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              Our App is not intended for children under 13 years of age. We do not knowingly collect personal information 
              from children under 13. If you are a parent or guardian and believe your child has provided us with personal 
              information, please contact us immediately.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              9. International Data Transfers
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards 
              to protect your information.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              10. Third-Party Services
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              Our App may contain links to third-party websites or services. We are not responsible for the privacy 
              practices of these third parties. We encourage you to read their privacy policies before providing any 
              personal information.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              11. Changes to This Privacy Policy
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              We may update this Privacy Policy from time to time. We will notify you of any changes by: Posting the new 
              Privacy Policy in the App, Sending you an email notification, Updating the "Last Updated" date at the top 
              of this policy. Your continued use of the App after any changes constitutes acceptance of the updated Privacy Policy.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              12. Regional Compliance
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              12.1 European Union (GDPR)
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              If you are in the EU, you have additional rights under the General Data Protection Regulation (GDPR), 
              including the right to data portability, the right to be forgotten, and the right to object to processing.
            </Typography>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              12.2 California (CCPA)
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA), 
              including the right to know what personal information is collected and the right to delete personal information.
            </Typography>

            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#052F2A', mt: 4 }}>
              13. Contact Us
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, color: '#333' }}>
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </Typography>
            <Box sx={{ backgroundColor: '#F8F9FA', p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#333' }}>
                <strong>Email:</strong> privacy@tijaniyahmuslimpro.com<br />
                <strong>Address:</strong> Tech Arena Group, Privacy Department<br />
                <strong>App Support:</strong> Available through the App's settings menu
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, color: '#052F2A', mt: 3 }}>
              Data Protection Officer
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, color: '#333' }}>
              For EU residents, you can contact our Data Protection Officer at: <strong>dpo@tijaniyahmuslimpro.com</strong>
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ textAlign: 'center', mt: 6, p: 4, backgroundColor: '#052F2A10', borderRadius: 3 }}>
              <Box
                component="img"
                src="/logo.png"
                alt="Tijaniyah Muslim Pro"
                sx={{
                  height: 80,
                  width: 'auto',
                  mb: 2,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#052F2A' }}>
                Tijaniyah Muslim Pro
              </Typography>
              <Typography variant="body1" sx={{ color: '#666', fontStyle: 'italic', mb: 2 }}>
                Your trusted companion for Islamic spiritual growth
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                This Privacy Policy is effective as of October 26, 2024, and applies to all users of the Tijaniyah Muslim Pro mobile application.
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default PrivacyPolicy;

