# Luink.ai - React Native App

Luink.ai is an innovative React Native application that lets users create, share, and monetize their content. The app includes a variety of features like creating reels and posts, purchasing services, and earning money through uploaded content. With an integrated payment gateway and seamless user experience, Luink.ai is designed to empower content creators.

## Key Features

- **Video Storage with Bunny.net**: All videos uploaded by users are stored securely and efficiently using [Bunny.net](https://bunny.net).
- **CodePush Integration**: CodePush ensures automatic updates, allowing users to access the latest features without manual app updates.
- **Monetization Features**: Users can earn money by uploading content and provide or purchase services using the in-app payment gateway.
- **Modern UI/UX**: The app includes several screens to provide a seamless experience:
  - **Splash Screen**: Welcome screen with branding.
  - **Login/Sign Up**: User authentication with options for forgot password and account recovery.
  - **Home Screen**: Browse content and navigate to other sections.
  - **Search Screen**: Discover content, users, and services.
  - **Profile Screen**: Manage user information, reels, posts, and services.
  - **Reels Screen**: Watch or create engaging short videos.
  - **Service Screen**: Offer or purchase services.
  - **Create Reel and Post**: Tools for creating and uploading reels and posts.

## Getting Started

Follow the steps below to get started with the Luink.ai app.

### Step 1: Environment Setup

Ensure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions before proceeding.

### Step 2: Start Metro Server

Run the following commands from the root directory:

#start the metro server 
npm start

### Step 3: Run the Application

Run the app in either Android or iOS:

Android
npm run android

### Step 4: CodePush Updates

To test the latest features without manual updates:

Enable CodePush: Ensure your app is connected to the CodePush service.
Deploy Updates: Use the following command to push updates:
bash
Copy code
appcenter codepush release-react -a <app-name> -d <deployment-name>
The app will fetch updates automatically.


# Monetization Features

Earning Money: Upload content like reels or services and earn money based on engagement.
Payment Gateway: Integrated payment gateway for purchasing services and receiving payouts.

# Screens Overview
Splash Screen: Initial branding with animations.
Login & Registration: Secure authentication and account creation.
Forgot Password: Recover accounts easily.
Home Screen: Access trending content and navigation shortcuts.
Search Screen: Look up users, reels, posts, and services.
Profile Screen: Manage personal information, view uploaded content, and track earnings.
Reels Screen: Create or browse short video content.
Service Screen: Offer or purchase services from other users.
Create Reel & Post: Tools for uploading engaging content with monetization options.

# Video Storage with Bunny.net
All videos are stored on Bunny.net for high-speed delivery and efficient video handling.

# Payment Gateway Integration
The app includes a robust payment gateway for buying and selling services seamlessly.

