# NEU Library Visitor Log

This is a React app for logging visitors to the NEU Library with **Google Authentication** and **role-based access**.

## Live App
[https://YOUR-FIREBASE-APP-LINK.web.app](https://YOUR-FIREBASE-APP-LINK.web.app)

## Features
- Login with **Google** (only NEU account allowed)
- Role-Based Access: switch between **User** and **Admin**
- Visitor logging with:
  - Reason for visit
  - College
  - Employee status (teacher/staff)
- Admin Dashboard:
  - View visitor statistics (total, filtered)
  - Filter by reason, college, and employee
  - Display statistics in cards

## Test Account
**Email:** jcesperanza@neu.edu.ph

## Available Scripts

In the project directory, you can run:

### `npm start`
Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`
Builds the app for production in the `build` folder.  
Ready for deployment.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run eject`
Removes the single build dependency and copies configuration files so you can fully customize. **Note: this is one-way!**

## Deployment

This app is deployed using **Firebase Hosting**.  
Make sure to update the `Live App` link above with your Firebase Hosting URL.

---

**Security / Defense Tip:**  
- Uses **Google OAuth** for authentication  
- Only allows `@neu.edu.ph` emails  
- Role-based authorization controlled with Firestore flags
