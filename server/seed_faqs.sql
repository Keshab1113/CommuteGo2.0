-- Seed FAQs for CommuteGo database
-- Run this SQL to populate the faqs table

-- First, ensure the faqs table exists (if not already created)
-- CREATE TABLE IF NOT EXISTS faqs (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   question VARCHAR(255) NOT NULL,
--   answer TEXT NOT NULL,
--   category VARCHAR(50) DEFAULT NULL,
--   order_index INT DEFAULT 0,
--   is_visible BOOLEAN DEFAULT TRUE,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

-- Clear existing FAQs (optional - comment out if you want to keep existing)
-- DELETE FROM faqs;

-- Insert FAQs by category

-- === Getting Started (Category: General) ===
INSERT INTO faqs (question, answer, category, order_index, is_visible) VALUES
('How do I create my first commute route?', 'Creating your first route is easy! Simply enter your starting point and destination in the search bar on the home page. You can add multiple stops, choose your preferred transport modes, and save the route for future use. Our AI will also suggest optimal routes based on your preferences and real-time traffic data.', 'General', 1, TRUE),
('What transport modes are supported?', 'CommuteGo supports multiple transport modes including driving, public transit (bus, train, subway), walking, cycling, and ride-sharing. You can also enable multi-modal routes that combine different transport modes for the most efficient journey.', 'General', 2, TRUE),
('Is CommuteGo available in my city?', 'CommuteGo is available in major cities worldwide. We continuously expand our coverage to include more locations. You can check if your city is supported by entering a route in the app. If it''s not available yet, you can join our waitlist to be notified when we launch in your area.', 'General', 3, TRUE),
('How accurate is the traffic data?', 'We use real-time traffic data from multiple sources including GPS data from millions of users, traffic cameras, and government transportation APIs. Our predictions are updated every few minutes to ensure accuracy. Historical data also helps us predict traffic patterns for scheduled trips.', 'General', 4, TRUE);

-- === Account & Billing ===
INSERT INTO faqs (question, answer, category, order_index, is_visible) VALUES
('How do I reset my password?', 'To reset your password, click "Forgot Password" on the login page and enter your email address. You''ll receive a link to create a new password. The link expires after 24 hours for security. If you don''t receive the email, check your spam folder or contact support.', 'Account', 1, TRUE),
('Can I change my subscription plan?', 'Yes! You can upgrade or downgrade your plan at any time from the Settings page. Upgrades take effect immediately, while downgrades apply at the end of your current billing cycle. Your data is preserved regardless of plan changes.', 'Account', 2, TRUE),
('How do I cancel my subscription?', 'You can cancel your subscription anytime from Account Settings > Subscription > Cancel Plan. Your access continues until the end of your billing period. We''d love to know why you''re leaving - your feedback helps us improve!', 'Account', 3, TRUE),
('What payment methods do you accept?', 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. Enterprise customers can also pay via bank transfer or invoice. All payments are processed securely through Stripe.', 'Account', 4, TRUE);

-- === Features & Usage ===
INSERT INTO faqs (question, answer, category, order_index, is_visible) VALUES
('How does AI route optimization work?', 'Our AI analyzes thousands of factors including real-time traffic, historical patterns, weather conditions, your preferences, and even local events to suggest the optimal route. The more you use CommuteGo, the better it learns your preferences and habits.', 'Features', 1, TRUE),
('Can I share my route with others?', 'Absolutely! You can share any route via a unique link, QR code, or directly to messaging apps. Recipients can view the route without needing a CommuteGo account. You can also collaborate on routes with family or colleagues.', 'Features', 2, TRUE),
('Does CommuteGo work offline?', 'Yes! Saved routes are available offline. You can download maps for offline use in the app settings. Note that real-time traffic updates require an internet connection, but turn-by-turn directions will still work offline using cached data.', 'Features', 3, TRUE),
('How do notifications work?', 'You can set up notifications for various events: departure reminders, traffic delays, route changes, price drops on gas, and more. Customize your notification preferences in Settings > Notifications. Push notifications require the app to be installed.', 'Features', 4, TRUE);

-- === Privacy & Security ===
INSERT INTO faqs (question, answer, category, order_index, is_visible) VALUES
('How is my data protected?', 'We use bank-level encryption (AES-256) for all data storage and TLS 1.3 for data in transit. Your location data is anonymized and aggregated for analytics. We never sell your personal data to third parties. You can request a complete data export or deletion at any time.', 'Privacy', 1, TRUE),
('Can I delete my account and data?', 'Yes, you can delete your account and all associated data from Settings > Privacy > Delete Account. This action is irreversible - all your routes, history, and preferences will be permanently removed within 30 days. You can cancel this deletion within that period.', 'Privacy', 2, TRUE),
('Who can see my location?', 'Your real-time location is only shared with people you explicitly choose to share with. By default, your location is private. You can enable location sharing for specific contacts or share your ETA during an active trip. All location sharing is opt-in.', 'Privacy', 3, TRUE),
('Is my commute data anonymous?', 'Yes! We aggregate and anonymize all commute data used for improvements and analytics. Individual trip data is never shared. You can opt out of contributing anonymized data in your privacy settings.', 'Privacy', 4, TRUE);

-- === Troubleshooting ===
INSERT INTO faqs (question, answer, category, order_index, is_visible) VALUES
('Why is my location not accurate?', 'Location accuracy depends on your device''s GPS and network. Ensure location services are enabled for CommuteGo in your device settings. For better accuracy, enable high-accuracy mode in your phone''s location settings. Indoor locations may have reduced accuracy.', 'Troubleshooting', 1, TRUE),
('The app is running slowly. What should I do?', 'Try these steps: 1) Close and reopen the app, 2) Check your internet connection, 3) Clear the app cache in settings, 4) Ensure you have the latest version, 5) Restart your device. If issues persist, contact support with details about your device and OS version.', 'Troubleshooting', 2, TRUE),
('I''m not receiving notifications. How do I fix this?', 'Check the following: 1) Notifications are enabled in app settings, 2) Your device''s notification settings allow CommuteGo, 3) You''re signed in to your account, 4) Do Not Disturb isn''t active. On iOS, also check notification grouping settings.', 'Troubleshooting', 3, TRUE),
('My route isn''t showing the expected results', 'This could be due to: 1) Invalid addresses (try adding more details), 2) No transit options available for that route, 3) Temporary service disruptions. Try adjusting your transport mode preferences or contact support if the issue persists.', 'Troubleshooting', 4, TRUE);

-- === Pricing FAQs ===
INSERT INTO faqs (question, answer, category, order_index, is_visible) VALUES
('What plans do you offer?', 'We offer three main plans: Starter (free), Pro ($9.99/month), and Enterprise (custom pricing). The Starter plan includes basic route planning with ads. Pro removes ads and adds AI optimization and unlimited saved routes. Enterprise includes custom integrations and dedicated support.', 'Pricing', 1, TRUE),
('Is there a free trial?', 'Yes! All paid plans come with a 14-day free trial. No credit card required to start. You can access all Pro features during the trial period.', 'Pricing', 2, TRUE),
('Can I get a refund?', 'We offer a 30-day money-back guarantee for annual subscriptions. Monthly subscriptions can be cancelled anytime but are not refunded for partial months.', 'Pricing', 3, TRUE),
('Do you offer discounts for students?', 'Yes! Students with a valid .edu email address receive 50% off Pro subscriptions. Contact our support team to apply for the student discount.', 'Pricing', 4, TRUE),
('What''s included in the Enterprise plan?', 'Enterprise includes custom route algorithms, API access, dedicated account manager, SLA guarantees, advanced analytics, SSO integration, and custom branding options. Contact sales for a personalized quote.', 'Pricing', 5, TRUE),
('How do I upgrade my plan?', 'Go to Settings > Subscription > Change Plan to upgrade or downgrade. Upgrades take effect immediately with prorated billing. Downgrades apply at the start of your next billing cycle.', 'Pricing', 6, TRUE);

-- === Documentation FAQs ===
INSERT INTO faqs (question, answer, category, order_index, is_visible) VALUES
('How do I integrate CommuteGo with my app?', 'Use our REST API with your API key found in Settings > Developer. We provide SDKs for JavaScript, Python, and mobile platforms. Check our API documentation for endpoints and rate limits.', 'Documentation', 1, TRUE),
('What API endpoints are available?', 'Key endpoints include: /routes (create/manage routes), /optimize (AI optimization), /geocode (address lookup), /traffic (real-time data), and /analytics (usage stats). Full documentation available in the Developer section.', 'Documentation', 2, TRUE),
('Is there a rate limit?', 'Free tier: 100 requests/day. Pro: 10,000 requests/day. Enterprise: Custom limits with burst options. Rate limit headers are included in all API responses.', 'Documentation', 3, TRUE);