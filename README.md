# TaxEase - Web Application for Managing Tax Payments

### *Overview*

TaxEase is a web application designed to simplify the process of paying taxes and fees for individuals and public institutions. It is offering an online platform that streamlines tax payments for both taxpayers and tax-collecting institutions.

TaxEase acts as an intermediary between individuals (taxpayers) and public institutions (tax collectors), allowing users to easily manage and pay their taxes online.

## Table of Contents

- [Use Cases](#use_cases)
- [Features](#features)
- [Tehnical Details](#tehnical_details)

##  Use Cases

### 1) Taxpayer (Individual)

- **Without account:** Can make one-time payments without needing to log in. Must provide personal data and tax details.

- **With account:** Registered users can log in to pay taxes and view payments history.
    - Payment History: View past payments with visual representations (line and pie charts).

### 2) Public Institutions (Tax Collectors)

- **Institutions** must enroll in the system to be available for tax payments.

    - Upon registration, an institution will be listed in the available institutions for taxpayers to select.

    - Institutions are responsible for ensuring the accuracy of the tax data provided in the system.

## Features

- [Institution](#institution)
- [Registered User](#registered_user)
- [Unregistered Users](#unregistered_users)

## Institution

In the application, public tax-collecting institutions can register to collect local taxes and fees directly from users (individuals) through online payments. To be visible in the selection lists of the payment forms provided to users, institutions must go through an enrollment process.

### 1. Accessing the Enrollment Page

The first step in the institution enrollment process is to access the enrollment page.

- Step 1: On the registration page, the user will click the "Enroll Now" button. This will open a modal window, which will prompt the user to enter their email address.

![SignIn Page](./documentation%20photos/SignIn%20Page.png)

![Request Link Modal](./documentation%20photos/requestLinkModal.png)

### 2. Email Address Verification

The system stores the official email addresses of designated representatives (administrators) of public tax-collecting institutions. To prevent unauthorized enrollments, the email address entered in the modal window is checked against the database.

- Step 2: If the provided email address is authorized, an email will be sent containing a link to the enrollment page.

### 3. Enrollment Form Submission

Once the enrollment page is accessed, it consists of two main sections:

1. Download Section:
    - In this section, the user can click the "Download" button to download the application form in PDF format.

2. Upload Section:
    - In this section, the completed form should be uploaded. Only PDF format is accepted. After uploading, the system will automatically extract and validate the relevant data.

![Enrollment Page](./documentation%20photos/enrollmentPage.png)

### 4. Data Validation

Once the form is uploaded, the system will check if all essential data is present and valid. If the data meets the validation criteria, the institution will be added to the database.

- Step 3: After successful enrollment, the institution will be visible in the lists presented to users in the web application.

### 5. Institution Visibility

Once successfully enrolled, the institution will be visible in the main forms available to users within the web application. One of the places where enrolled institutions are listed is the Institutions Page.

- Step 4: By selecting the region of interest, users will see a list of institutions from that region, as shown in the example.

Additionally, by clicking on the icon button next to the institution’s name in the displayed list, users can view more detailed information about the selected institution.

![Institutions Page](./documentation%20photos/institutionsPage.png)

## Registered User

Users who choose to create an account in the application will have access to several exclusive features, including:

- Viewing a history of completed payments
- Checking their outstanding tax obligations

### 1. Account Creation

To create an account, users must navigate to the account registration page, where they will fill out a form divided into three sections:

1. Personal Information
2. Account Details
3. Card Information

Since the sections are completed sequentially, users must fill in all required fields before proceeding to the next step. If any field is left empty or invalid, warning messages will be displayed below.

![Enrollment Page](./documentation%20photos/enrollmentPage.png)

At the end of the registration process, if all fields are correctly filled, the system generates a random verification code, which is sent to the user’s email for validation. A modal window will appear, prompting the user to enter the verification code. If the entered code matches the generated one, the user is successfully added to the database.

![Enrollment Page](./documentation%20photos/enrollmentPage.png)

### 2. Secure Login and Authentication

During the registration process, the password provided by the user is encrypted before being stored in the database to ensure data security.

When logging in, the system first checks for the existence of the username in the database. If found, it then verifies the password by applying the decryption method.

If both the username and password are correct, the user is granted access to their account, and a new session is created with a 1-hour TTL (Time-To-Live).

![LogIn Page](./documentation%20photos/logInPage.png)

### 3. User Dashboard and Payment Processing

Once logged in, the user is redirected to their personal dashboard, where they can view:

- The tax obligations owed to the institutions they are registered under
- Detailed information about each tax, including the total amount due

![LogIn Page](./documentation%20photos/logInPage.png)

*Making a Payment*

If the user wants to pay their taxes for a specific institution, they can click the "Pay" button, which redirects them to the payment portal.

- The payment portal is implemented using Stripe
- Late payment penalties and early payment discounts are automatically applied where applicable

![LogIn Page](./documentation%20photos/logInPage.png)

### 4. Payment History & Visualization

Users with an account can track their payment history through visual representations:

- Line chart for an overview of payments over time
- Doughnut chart for a breakdown of payment categories

![LogIn Page](./documentation%20photos/logInPage.png)

![LogIn Page](./documentation%20photos/logInPage.png)

### 5. Profile Customization

Registered users can personalize their profile by:

- Uploading a profile picture
- Updating personal data

![LogIn Page](./documentation%20photos/logInPage.png)

## Unregistered Users

The application also accommodates users who choose not to create an account. While these users do not have access to the features available on the personal dashboard, they can still perform a key action.

### 1. Making Tax Payments Without an Account

Unregistered users can pay their tax obligations, provided they already know the exact amount due. However, in the case of tax payments, the amount will be automatically filled in by the system.

To complete a payment, users must fill out a payment form.

![LogIn Page](./documentation%20photos/logInPage.png)