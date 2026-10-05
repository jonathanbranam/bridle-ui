# Login

How the UI gets a session from the gateway. The browser never stores credentials; the gateway's `HttpOnly` cookie is the session.

## Requirements

### Requirement: The login form is friendly to password managers  {#r-b8cb}

The login form SHALL label its username and password fields and mark them with the `username` and `current-password` autocomplete values.

#### Scenario: The fields carry autocomplete hints  {#s-d9a3}

*Verification*: **non-executable**

The username input has `autocomplete="username"`, the password input `autocomplete="current-password"`, and each label points at its input by id.

### Requirement: A failed login shows the gateway's reason  {#r-499c}

A rejected login SHALL show the gateway's error in an alert and stay on the form; an accepted one SHALL hand the session to the app.

#### Scenario: Wrong password  {#s-d53a}

*Verification*: **non-executable**

Submitting credentials the gateway rejects shows its message and keeps the form.
