# ChatApp

ChatApp is a real-time chat application that allows users to register, chat in a chatroom, and manage their accounts. The app supports image sharing and message history, with special admin privileges for user management.

## Features

- User registration and authentication using JWT
- Real-time messaging with Socket.IO
- View and delete previous messages
- Image sharing functionality
- Admin user with special privileges to view user messages and delete accounts
- Account deletion and password change options
- MySQL database for storing user info and messages

## Installation

To install and set up ChatApp, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ChatApp.git
   ```
2. Navigate to the project directory:
  ```bash
   cd ChatApp
   ```
3. Install the necessary dependencies:
   ```bash
   npm install express express-session crypto body-parser mysql2 sequelize socket.io dotenv path ejs jsonwebtoken
   ```
4. Set up your MySQL database:

Create a new database and update the database configuration in your .env file.
Make sure to create the necessary tables for users and messages.

5. Run the application:
  ```bash
  node app.js
   ```

## Usage
1. Register a new account to start chatting.
2. Once registered, log in using your credentials.
3. Join the chatroom to start messaging.
4. As an admin user (username: admin), you can view user messages and delete users as needed.   

## Contributing
Contributions are welcome! If you have suggestions or improvements, feel free to fork the repository and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.