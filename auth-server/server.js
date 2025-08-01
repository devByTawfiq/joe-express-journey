
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, setupDatabase } = require('./db');
const auth = require('./middleware/auth');
const { validateRegister, validateLogin } = require('./middleware/validate');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const TOKEN_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY = '7d';

// Initialize database
setupDatabase().catch(console.error);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory user database as fallback
const users = [
  {
    id: 1,
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com',
    // Password: "demo123"
    password: '$2a$10$XFE3UJp8aVsJvnEcKRPImO3ZHuZ8nTnxReCZr1UBJcR6MoN1akNvG',
    course: 'Software Development',
    registrationDate: '2024-05-01T10:30:00Z',
    lastLogin: '2024-05-03T08:45:00Z',
    progress: [
      {
        course: 'Software Development',
        completed: 3,
        totalModules: 12
      }
    ],
    profileImage: null
  }
];

// Register endpoint
app.post('/api/register', validateRegister, async (req, res) => {
    try {
        const { firstName, lastName, email, password, course, phone } = req.body;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Get current date in ISO format
        const currentDate = new Date().toISOString();
        
        try {
            // Try to use database
            const [userExists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            
            if (userExists && userExists.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }
            
            // Insert user into database
            const [result] = await pool.query(
                'INSERT INTO users (firstName, lastName, email, password, course, registrationDate, lastLogin) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [firstName, lastName, email, hashedPassword, course, currentDate, currentDate]
            );
            
            const userId = result.insertId;
            
            // Insert initial progress
            await pool.query(
                'INSERT INTO user_progress (userId, course, completed, totalModules) VALUES (?, ?, ?, ?)',
                [userId, course, 0, getCourseModules(course)]
            );
            
            // Get the newly created user (without password)
            const [rows] = await pool.query(
                'SELECT id, firstName, lastName, email, course, registrationDate, lastLogin, profileImage FROM users WHERE id = ?', 
                [userId]
            );
            
            // Create JWT token
            const token = jwt.sign(
                { id: userId, email },
                JWT_SECRET,
                { expiresIn: TOKEN_EXPIRY }
            );
            
            // Create refresh token with longer expiry
            const refreshToken = jwt.sign(
                { id: userId, email },
                JWT_SECRET,
                { expiresIn: REFRESH_TOKEN_EXPIRY }
            );
            
            res.status(201).json({
                message: 'User registered successfully',
                token,
                refreshToken,
                user: rows[0]
            });
        } catch (dbError) {
            console.error('Database error, using in-memory fallback:', dbError);
            
            // Fallback to in-memory if database fails
            // Check if user already exists
            if (users.find(user => user.email === email)) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user
            const newUser = {
                id: users.length + 1,
                firstName,
                lastName,
                email,
                password: hashedPassword,
                course,
                phone: phone || null,
                registrationDate: currentDate,
                lastLogin: currentDate,
                progress: [
                    {
                        course,
                        completed: 0,
                        totalModules: getCourseModules(course)
                    }
                ],
                profileImage: null
            };

            users.push(newUser);
            
            // Create JWT token
            const token = jwt.sign(
                { id: newUser.id, email: newUser.email },
                JWT_SECRET,
                { expiresIn: TOKEN_EXPIRY }
            );
            
            // Create refresh token with longer expiry
            const refreshToken = jwt.sign(
                { id: newUser.id, email: newUser.email },
                JWT_SECRET,
                { expiresIn: REFRESH_TOKEN_EXPIRY }
            );

            // Return user info without password
            const { password: _, ...userWithoutPassword } = newUser;

            res.status(201).json({
                message: 'User registered successfully',
                token,
                refreshToken,
                user: userWithoutPassword
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login endpoint
app.post('/api/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        try {
            // Try to use database
            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
            
            if (rows.length === 0) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            
            const user = rows[0];
            
            // Validate password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            
            // Update last login time
            await pool.query('UPDATE users SET lastLogin = ? WHERE id = ?', [new Date().toISOString(), user.id]);
            
            // Create JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: TOKEN_EXPIRY }
            );
            
            // Create refresh token with longer expiry
            const refreshToken = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: REFRESH_TOKEN_EXPIRY }
            );
            
            // Remove password from response
            delete user.password;
            
            res.json({
                message: 'Login successful',
                token,
                refreshToken,
                user
            });
        } catch (dbError) {
            console.error('Database error, using in-memory fallback:', dbError);
            
            // Fallback to in-memory if database fails
            // Find user
            const user = users.find(user => user.email === email);
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Validate password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Update last login time
            user.lastLogin = new Date().toISOString();

            // Create JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: TOKEN_EXPIRY }
            );
            
            // Create refresh token with longer expiry
            const refreshToken = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: REFRESH_TOKEN_EXPIRY }
            );

            // Return user info without password
            const { password: _, ...userWithoutPassword } = user;

            res.json({
                message: 'Login successful',
                token,
                refreshToken,
                user: userWithoutPassword
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Refresh token endpoint
app.post('/api/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token is required' });
        }
        
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        
        // Create new access token
        const token = jwt.sign(
            { id: decoded.id, email: decoded.email },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
        );
        
        res.json({
            message: 'Token refreshed successfully',
            token
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
});

// Protected route - Get user profile
app.get('/api/me', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        try {
            // Try to use database
            const [rows] = await pool.query(
                'SELECT id, firstName, lastName, email, course, registrationDate, lastLogin, profileImage FROM users WHERE id = ?', 
                [userId]
            );
            
            if (rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            const user = rows[0];
            
            // Get user progress
            const [progressRows] = await pool.query(
                'SELECT course, completed, totalModules FROM user_progress WHERE userId = ?',
                [userId]
            );
            
            user.progress = progressRows;
            
            res.json(user);
        } catch (dbError) {
            console.error('Database error, using in-memory fallback:', dbError);
            
            // Fallback to in-memory if database fails
            const user = users.find(user => user.id === userId);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            // Return user info without password
            const { password, ...userWithoutPassword } = user;
            
            res.json(userWithoutPassword);
        }
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
app.put('/api/profile', auth, async (req, res) => {
    try {
        const { firstName, lastName, profileImage } = req.body;
        const userId = req.user.id;
        
        try {
            // Try to use database
            // Update fields if provided
            let updateQuery = 'UPDATE users SET ';
            const updateParams = [];
            
            if (firstName) {
                updateQuery += 'firstName = ?, ';
                updateParams.push(firstName);
            }
            
            if (lastName) {
                updateQuery += 'lastName = ?, ';
                updateParams.push(lastName);
            }
            
            if (profileImage) {
                updateQuery += 'profileImage = ?, ';
                updateParams.push(profileImage);
            }
            
            // Remove trailing comma and space
            updateQuery = updateQuery.slice(0, -2);
            
            updateQuery += ' WHERE id = ?';
            updateParams.push(userId);
            
            if (updateParams.length > 1) {
                await pool.query(updateQuery, updateParams);
            }
            
            // Get updated user
            const [rows] = await pool.query(
                'SELECT id, firstName, lastName, email, course, registrationDate, lastLogin, profileImage FROM users WHERE id = ?', 
                [userId]
            );
            
            if (rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json({
                message: 'Profile updated successfully',
                user: rows[0]
            });
        } catch (dbError) {
            console.error('Database error, using in-memory fallback:', dbError);
            
            // Fallback to in-memory if database fails
            const user = users.find(user => user.id === userId);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            // Update fields if provided
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (profileImage) user.profileImage = profileImage;
            
            // Return updated user without password
            const { password, ...userWithoutPassword } = user;
            
            res.json({
                message: 'Profile updated successfully',
                user: userWithoutPassword
            });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update course progress
app.put('/api/progress', auth, async (req, res) => {
    try {
        const { course, completed } = req.body;
        const userId = req.user.id;
        
        if (!course || completed === undefined) {
            return res.status(400).json({ message: 'Course name and completed modules are required' });
        }
        
        try {
            // Try to use database
            // Check if progress entry exists
            const [rows] = await pool.query(
                'SELECT * FROM user_progress WHERE userId = ? AND course = ?',
                [userId, course]
            );
            
            if (rows.length === 0) {
                // Create new progress entry
                await pool.query(
                    'INSERT INTO user_progress (userId, course, completed, totalModules) VALUES (?, ?, ?, ?)',
                    [userId, course, completed, getCourseModules(course)]
                );
            } else {
                // Update existing progress entry
                await pool.query(
                    'UPDATE user_progress SET completed = ? WHERE userId = ? AND course = ?',
                    [completed, userId, course]
                );
            }
            
            // Get all progress for user
            const [progressRows] = await pool.query(
                'SELECT course, completed, totalModules FROM user_progress WHERE userId = ?',
                [userId]
            );
            
            res.json({
                message: 'Progress updated successfully',
                progress: progressRows
            });
        } catch (dbError) {
            console.error('Database error, using in-memory fallback:', dbError);
            
            // Fallback to in-memory if database fails
            const user = users.find(user => user.id === userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            // Find the course progress entry or create one
            const progressEntry = user.progress.find(p => p.course === course);
            
            if (progressEntry) {
                progressEntry.completed = completed;
            } else {
                user.progress.push({
                    course,
                    completed,
                    totalModules: getCourseModules(course)
                });
            }
            
            res.json({
                message: 'Progress updated successfully',
                progress: user.progress
            });
        }
    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all courses (non-protected route)
app.get('/api/courses', (req, res) => {
    const coursesData = [
        {
            id: "c001",
            title: "Software Development",
            modules: 12
        },
        {
            id: "c002",
            title: "Data Analysis",
            modules: 10
        },
        {
            id: "c003",
            title: "UI/UX Design",
            modules: 8
        },
        {
            id: "c004",
            title: "Forex Trading",
            modules: 9
        },
        {
            id: "c005",
            title: "Graphics Design & Video Editing",
            modules: 11
        }
    ];
    
    res.json(coursesData);
});

// Helper function to get course modules count
function getCourseModules(course) {
    switch(course) {
        case 'softwareDev':
        case 'Software Development': return 12;
        case 'dataAnalysis':
        case 'Data Analysis': return 10;
        case 'UI/UX Design': return 8;
        case 'forex':
        case 'Forex Trading': return 9;
        case 'videoGraphics':
        case 'Graphics Design & Video Editing': return 11;
        default: return 10;
    }
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

console.log(`
-------------------------------------
IMPORTANT: This is a demo server only!
In a production environment, you should:
1. Use a real database (MySQL, etc.) - Already included but using fallback
2. Store JWT secret in environment variables
3. Add proper error handling - Improved but can be enhanced further
4. Implement rate limiting
5. Use HTTPS
-------------------------------------
`);
