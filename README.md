Overall Functionality
User Authentication & Profile Management:

Signup: Users create an account by providing name, email, phone number, and password.
Login: Users log in with their email and password. A JWT token is issued and stored (in localStorage).
Profile Page: After login, users are redirected to a profile page where their details are fetched and displayed. They can update their profile information.
Navigation: From the profile page, users can navigate to:
Make a donation.
View donation history.
Manage charity (for users who are charity owners).
Access the admin dashboard (visible only if the logged-in user is admin).
Donation Process & Tracking:

Search & Donate: Users can search for charities by name, mission, location, or category on the donation page.
Razorpay Integration:
When a user initiates a donation, a Razorpay order is created.
The Razorpay checkout opens, and upon successful payment, the backend updates the donation record with the payment details.
Email Notification: Once a donation is marked successful, a donation confirmation email is sent to the user using SendGrid.
Donation History:
Users can view a list of their donations (with details such as amount, date, charity name, and payment status).
They can also download their donation history as a CSV file. The CSV is generated server-side, uploaded to AWS S3, and a URL is provided for download.
Charity Management:

Registration & Update: Users can register new charities and update existing charity information (such as name, mission, location, and category).
Impact Reports: Charities can update an impact report to inform donors how donations are being used.
Approval Process: An admin has the ability to approve (or reject) charity registrations.
Admin Dashboard:

User Management: Admins can view all users (without sensitive information) and delete users.
Charity Management: Admins can view all charities, approve pending charity registrations, or reject (delete) charities.
Access Control: The admin dashboard is only accessible to users whose token indicates they are admins (for example, the token payload might include name: "admin").
Flow of Execution
User Signup & Login:

Signup Page: A user fills in the signup form.
The data is sent to the server via an API (/user/signup).
If successful, the user is redirected to the login page.
Login Page: The user logs in by entering email and password.
Upon success, a JWT token is returned and stored in localStorage.
The user is then redirected to the profile page (/charity).
User Profile & Navigation:

Profile Page (/charity):
The page fetches the user’s profile data using the token.
It also fetches donation history (if any) to display.
Navigation links are provided:
Make a Donation (redirects to /donation).
View Donation History (redirects to /donation-history).
Manage Charity (redirects to /charity-manage).
Admin Dashboard (visible only if the user is admin; redirects to /admin-dashboard).
Donation Process:

Donation Page (/donation):
The user can search for charities.
After entering a charity ID and donation amount, the form submits to create a Razorpay order.
The Razorpay checkout interface opens for payment.
On successful payment, a handler function calls an API (/donations/update-transaction) to update the donation record.
After updating, a donation confirmation email is automatically sent to the user.
Donation History & CSV Download:

Donation History Page (/donation-history):
The page retrieves and displays the user's donation history.
If there are no donations, it shows a message like “No donation history found.”
A download button allows the user to download their donation history as a CSV file.
The server generates a CSV from the donation data, uploads it to AWS S3, and returns a file URL.
The browser uses this URL to download the file.
Charity Management:

Charity Management Page (/charity-manage):
Users can register a new charity or update an existing charity.
Admin-only functionalities (such as approving a charity) are available.
Impact reports can be updated to show how donations are being used.
Admin Dashboard:

Admin Dashboard Page (/admin-dashboard):
Accessible only if the logged-in user is an admin.
Admins can view all users, delete users, view all charities, approve charity registrations, or reject charities.
These actions are done via API endpoints secured with admin middleware.
Email Notifications & S3 Integration:

Donation Confirmation Email:
When a donation transaction is updated to “SUCCESS,” the server sends an email confirmation using SendGrid.
CSV Receipt Download:
The donation history CSV is generated, uploaded to AWS S3, and a public URL is returned to the user for download.
