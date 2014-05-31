# Express4 + Passport + MongoDB template

Simple starter template for an Express3 server with access control using Passport. Passport uses the local strategy and connects to MongoDB to verify the user. If the user is not authenticated, the Express server serves a Sign-in page. After successful authentication, the user can access the pages under access control. 

Users can create a new account in the Sign-up page, which adds the new user to the mongo database. 
