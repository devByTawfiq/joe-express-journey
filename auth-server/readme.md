
# Authentication Server Setup

This server provides authentication and user management for the application.

## Database Setup

Before starting the server, you need to set up the MySQL database:

1. Create the MySQL user:
```sql
CREATE USER 'fresh_user'@'localhost' IDENTIFIED BY 'my_secure_password';
```

2. Grant privileges to the user:
```sql
GRANT ALL PRIVILEGES ON *.* TO 'fresh_user'@'localhost';
FLUSH PRIVILEGES;
```

3. Create the database:
```sql
CREATE DATABASE IF NOT EXISTS fresh_web_craft_db;
```

4. Verify setup:
```sql
SHOW DATABASES;
SHOW GRANTS FOR 'fresh_user'@'localhost';
```

## Environment Configuration

1. Create a `.env` file in the auth-server directory based on the `.env.example` template
2. Update the values as needed for your environment

## Starting the Server

Run the following commands in the auth-server directory:

```
npm install
npm start
```

The server will automatically create the required database tables on startup if they don't exist.
