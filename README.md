# Logins
Social logins with multiple strategies

## App Registration

   Create Facebook, Google and Github apps to obtain ids and secrets passport authentication here:
   
   Facebook: `https://developers.facebook.com/apps/create/`

   Google OAuth 2.0 Client IDs: `https://console.cloud.google.com/apis/credentials`

   Github: `https://github.com/settings/developers`

## .env File
   Copy and Paste the Application ids and secrets in the respective fields. Create a new .env file in root folder and copy this information after populating
   
   ```s
   FACEBOOK_APP_NAME = " "
   FACEBOOK_APP_ID = " "
   FACEBOOK_APP_SECRET = " "
   FACEBOOK_CALLBACK_URL = "http://localhost:3000/auth/facebook/callback"

   GITHUB_APP_NAME = " "
   GITHUB_APP_ID = " "
   GITHUB_APP_SECRET = " "
   GITHUB_CALLBACK_URL = "http://localhost:3000/auth/github/callback"

   GOOGLE_APP_NAME = " "
   GOOGLE_APP_ID = " "
   GOOGLE_APP_SECRET = " "
   GOOGLE_CALLBACK_URL = "http://localhost:3000/auth/google/callback"
   ```

## Starting Instructions

1. Clone the repsoitory and type `npm install` to install dependancies

2. Since this project uses MongoDB, make sure that its installed in the system and service is running. Alternatively type
   
   ```shell
   brew tap mongodb/brew

   brew install mongodb-community@5.0

   brew services start mongodb-community
   ```

3. Open the terminal and type `node app.js` or `nodemon app.js` from the parent directory


## Authorization flow, Thought Process and Solution

1. Go to `http://localhost:3000` to navigate to home page
   
2. On home page, there are 3 different options to login

    **Solution 1** : 
    
    Since I had to check whether the same user has already logged in after logging in from any of the social login option, there will be a alert stating that the user has already logged in from some other provider in case of true. Since the verification is done through database, it will also be shown in case of Linking the accounts. I am simply checking that whether the user with same `email` already exists in database against the stored providers. If the user `email` already exists in the database linked to other provider, alert will be shown everytime stating that the same `email` has already been used against the specific provider.

    However, this is not ideal, but for demonstration purposes I have simply let user login even with same `email` and redirected to the profile page. If the `email` is found, an Alert message will be shown. This could be handled in many ways but for simplicity I have decided to use the alert message. The profile page will show the information after that
    

3. Select any of the login options to be redirected to a profile page where all the account + linked accounts information is listed. This page is rendered based on authentication of use
   with the help of passport library
   
4. Link the accounts using Link button and Unlink later with same button
   
   **Solution 2** :
   

   This is solution to the other question, that if the user login from first account (eg facebook) and then later with github or google and then try to link the facebook account. The other account will be linked based on checking the `token` property in database. The specific route `connect` will be called on requested linked account, and it will verify that whether a user have a token property set against the chosen provider in database. 
   
   Type `http://localhost:3000` in different browser window to login from other provider in the same session

   If a `token` is found then, the callback will redirect to the profile page with fresh information. Note that alert will be shown in this case as well if a user has already logged in with the same `email` from other provider

5. Unlinking the account will set the token property to `null` against the selected provider
   
6. Logout of the application will clear all sessions and cookies. If the login from any provider is not done in the same session, then a new entry will be created in database. So accounts may 
   have to be linked again if they are not already linked.

   *Note* => I also have an alternative schema design to handle the logout option much better, but for this task, try linking and unlinking all the accounts in the same session


