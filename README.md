# 🌴 Discover Diani

**Discover Diani** is an AI-powered local search and discovery tool designed to help you find anything in Diani, Kenya — from restaurants, hotels, events, and services, to hidden gems off the beaten path. Whether you're a tourist, a local, or a business, Discover Diani is your go-to platform to explore and connect with the vibrant coastal life of Diani.


---

## 🔍 What You Can Do
- 🌐 Search for businesses, services, and locations in Diani
- 🤖 Chat with DianiBot to get personalized recommendations
- 📍 Explore curated listings and insider tips
- 📅 Stay updated with upcoming events and happenings

## Authentication System

The application uses Supabase for authentication with the following features:

- Email/password authentication
- Social login (Google) 
- Email verification
- Password reset

### Authentication Improvements

Recent improvements to the authentication system include:

- Enhanced error handling for auth-related issues
- Automatic profile creation on signup and login
- Retry mechanisms for profile creation when Row-Level Security (RLS) policies interfere
- Improved session handling with PKCE flow
- Better OAuth and email confirmation flows

### Authentication Debugging

If you experience authentication issues, you can use the built-in Auth Debugger:

1. Navigate to `/auth/debug` in your browser
2. The tool will analyze your authentication state
3. Click "Check Health" to diagnose issues
4. Use "Repair Issues" to fix common problems
5. "Refresh Token" can help with expired sessions

### Common Authentication Issues and Solutions

- **Missing Profile**: The system will attempt to create one automatically. If this fails, use the Auth Debugger.
- **Session Expiration**: Click "Refresh Token" in the Auth Debugger.
- **OAuth Callback Issues**: Make sure your redirect URLs are properly configured in Supabase.
- **RLS Policy Errors**: Ensure your database has appropriate policies configured.

> Made with ❤️ in Diani by [ZaidiLab](https://zaidilab.com)

```

---

Let me know if you'd like me to generate a cool banner image for the top, or help with any copywriting for the Instagram or landing page.
