# ACHARYA_PATH

## Education Platform for Students

ACHARYA_PATH is a comprehensive education platform designed to help students access courses, government education policies, community resources, and freelance opportunities.

### Key Features

- **Interactive 3D Book Animation** on homepage using Three.js
- **Course Management System** with dynamic pagination and filtering
  - Includes Cisco NetAcad courses (CCNA, Cybersecurity, Python, etc.)
- **Government Policy Portal** with National Education Policy 2020 details
- **Community Features**:
  - Group chat functionality
  - Discussion forums
  - Study groups
  - Mentorship programs
- **Freelance Job Board** for students
- **User Management** with authentication system
  - Registration/login
  - Admin/user roles
  - Profile management

### Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript
- Bootstrap 5 for responsive design
- Three.js for 3D animations
- Chart.js for data visualization

**Backend:**
- Node.js with Express
- SQLite database (previously MongoDB)
- Sequelize ORM

**Authentication:**
- JWT-based session management
- Role-based access control

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ACHARYA_PATH.git
   ```
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Configure environment variables (create .env file):
   ```
   PORT=8000
   JWT_SECRET=your_secret_key
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Access the application at `http://localhost:8000`

### Recent Updates

- Implemented dynamic pagination for courses page
- Added 3D book animation to homepage
- Improved community page with chat functionality
- Transitioned from MongoDB to SQLite database
- Enhanced UI with educational image carousels

### Contributing

Contributions are welcome! Please fork the repository and submit pull requests.

### License

This project is licensed under the MIT License.
