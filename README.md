# Inventory & Accounting Management System

A web-based **Inventory & Accounting Management System** designed to help small and medium-sized businesses manage products, inventory, sales, purchasing, customers, employees, attendance, accounting, and business reports through a centralized interface.

> **Project Type:** University / Team Project
> **Current Implementation:** Frontend prototype with client-side JavaScript and browser storage
> **Status:** Functional prototype / Academic project

---

## 📌 Overview

The Inventory & Accounting Management System is designed around common business operations such as purchasing products, receiving goods, managing inventory, processing sales, managing customers and employees, recording accounting information, and generating management reports.

The system provides separate interfaces and workflows for **Administrators** and **Staff**, with authentication-related pages such as login, registration, OTP verification, password recovery, and password changing.

The project was developed collaboratively using Git and GitHub.

---

## 🎯 Objectives

The main objectives of this project are to:

* Digitize common inventory management activities
* Simplify product and stock management
* Support purchasing and receiving workflows
* Manage sales and customer information
* Manage employees and attendance
* Provide accounting-related interfaces
* Provide management reports
* Separate administrative and staff workflows
* Create a responsive web-based business management interface

---

## ✨ Main Features

### 🔐 Authentication

* Admin Login
* Staff Login
* Registration
* Forgot Password
* OTP Verification
* Change Password

### 📊 Dashboard

* Business overview
* Management navigation
* Summary information
* Administrative navigation
* Staff navigation

### 👨‍💼 Employee Management

* Employee management
* Employee attendance
* Today's attendance
* Attendance sheet
* Attendance-related workflows

### 📦 Product Management

* Product management
* Product information
* Product categorization
* Product status
* Product-related actions

### 🏪 Inventory Management

* Inventory overview
* Product search
* Category filtering
* Status filtering
* Stock In
* Stock Out
* Stock Adjustment
* Inventory status display

### 🛒 Sales Management

* Sales records
* Customer information
* Product catalog
* Invoice-related workflow
* Payment status
* Paid / unpaid sales
* Cancelled sales
* Sales history
* Sales activity information

### 🚚 Purchasing

The purchasing workflow includes:

* Purchase Request
* Create Purchase Order
* Approve Purchase
* Pending Purchase Orders
* Receive Goods
* Purchase Return
* Purchase History

### 👥 Customer Management

* Customer records
* Customer information
* Customer-related management workflows

### 💰 Accounting

The project includes accounting-related interfaces and workflows for:

* Accounting management
* Income
* Expenses
* Supplier-related information
* Purchase-related accounting
* Profit and Loss reporting
* Cash Flow reporting

### 📈 Reports

* Management reports
* Business information summaries
* Report interfaces
* Accounting-related reports

### ⚙️ Settings

* System settings
* Administrative configuration interface

---

## 🛠️ Technologies

### Frontend

* HTML5
* CSS3
* JavaScript (ES6+)
* Bootstrap 5
* Bootstrap Icons
* Font Awesome

### Development Tools

* Git
* GitHub
* Visual Studio Code
* Web Browser Developer Tools

### Client-side Data

Some prototype functionality uses:

* JavaScript objects/arrays
* Browser `localStorage`

---

## 📁 Project Structure

```text
Inventory-Accounting-Manage/
│
├── index.html
├── contactUs.html
│
├── assest/
│   ├── css/
│   │   ├── AdminCheat.css
│   │   ├── cheatDBAdmin.css
│   │   ├── cheatDBStaff.css
│   │   ├── contact.css
│   │   ├── invantory.css
│   │   ├── lymengAccounting.css
│   │   ├── lymengPurchase.css
│   │   ├── Report.css
│   │   ├── setting.css
│   │   └── ...
│   │
│   ├── js/
│   │   ├── accounting.js
│   │   ├── inventory.js
│   │   ├── sales.js
│   │   ├── productManagement.js
│   │   ├── customerManagement.js
│   │   ├── employeeManagement.js
│   │   ├── purchaseRequest.js
│   │   ├── purchaseReturn.js
│   │   ├── receiveGoods.js
│   │   └── ...
│   │
│   ├── image/
│   │
│   ├── pages/
│   │   ├── AdminANT/
│   │   ├── Forms/
│   │   │   ├── admin/
│   │   │   └── staff/
│   │   └── Staff/
│   │
│   └── vendor/
│       └── bootstrap/
│
└── README.md
```

---

## 👥 User Roles

### Administrator

The administrator interface is designed to manage major business operations, including:

* Employees
* Attendance
* Products
* Inventory
* Sales
* Customers
* Purchasing
* Accounting
* Reports
* Settings

### Staff

The staff interface provides access to operational workflows required for day-to-day business activities.

---

## 🔄 Example Business Workflow

A typical purchasing workflow can be represented as:

```text
Purchase Request
       ↓
Create Purchase Order
       ↓
Approve Purchase
       ↓
Pending Purchase Order
       ↓
Receive Goods
       ↓
Update Inventory
       ↓
Purchase History
```

A sales workflow can be represented as:

```text
Select Customer
       ↓
Select Products
       ↓
Create Sale / Invoice
       ↓
Payment
       ↓
Update Sales History
       ↓
Management Reports
```

---

## 🧩 My Contributions

This is a **team project**, and different team members contributed to different parts of the application.

My contributions primarily included:

* Accounting module development and UI implementation
* Purchasing-related pages and workflows
* Accounting and purchasing CSS/UI development
* Authentication and contact-related interface work
* Frontend page improvements and integration
* Git-based collaboration, updates, and project integration

The project was developed collaboratively rather than being created entirely by one developer.

---

## 💡 Key Learning Outcomes

Through this project, I gained practical experience with:

* Structuring a multi-page web application
* HTML5 page development
* Responsive UI development with Bootstrap
* CSS organization and customization
* JavaScript DOM manipulation
* JavaScript event handling
* Client-side filtering and searching
* Modal and toast interactions
* Browser `localStorage`
* Business workflow design
* Inventory management concepts
* Purchasing workflows
* Sales workflows
* Accounting-related workflows
* Git branching and merging
* Team-based software development

---

## ⚠️ Current Limitations

This version is primarily a **frontend/client-side prototype**.

The current implementation does not yet provide a complete production backend with:

* REST API
* Spring Boot backend
* Relational database integration
* Server-side authentication
* JWT/session security
* Role-based authorization
* Server-side validation
* Production database transactions
* Real-time multi-user synchronization

Some prototype data is stored in JavaScript or browser `localStorage`.

---

## 🚀 Future Improvements

Planned improvements include:

### Backend

* Build a Spring Boot REST API
* Implement service and repository layers
* Add MySQL or PostgreSQL
* Implement JPA/Hibernate
* Add DTOs and validation
* Implement centralized exception handling

### Security

* Spring Security
* JWT authentication
* Role-based authorization
* Password hashing
* Secure API endpoints

### Database

Potential entities include:

```text
User
Role
Employee
Customer
Supplier
Product
Category
Inventory
Purchase
PurchaseItem
Sales
SalesItem
Payment
Expense
Income
Account
Attendance
```

### Architecture

Move toward:

```text
Frontend
    ↓
REST API
    ↓
Service Layer
    ↓
Repository Layer
    ↓
Database
```

### DevOps

Future improvements may include:

* Maven
* Docker
* Docker Compose
* API testing with Postman
* CI/CD
* Deployment to a cloud platform

---

## 🧪 Running the Project

Because the current version is a frontend prototype, it can be opened using a local web server.

For example, using Visual Studio Code with Live Server:

```text
1. Clone the repository
2. Open the project in VS Code
3. Start a local web server
4. Open index.html
5. Navigate through the system
```

Using a local web server is recommended instead of opening every HTML file directly with `file://`.

---

## 📸 Project Screenshots

Screenshots can be added here to demonstrate the main modules:

* Dashboard
* Inventory Management
* Product Management
* Sales Management
* Purchasing
* Accounting
* Reports
* Employee Management

Example:

```text
docs/screenshots/
├── dashboard.png
├── inventory.png
├── sales.png
├── purchasing.png
├── accounting.png
└── reports.png
```

---

## 📚 Project Purpose

This project was developed as an academic/team project to practice real-world software development concepts and business system workflows.

It demonstrates how common business processes can be translated into a structured web application interface.

---

## 👨‍💻 Development Approach

The project was developed collaboratively using Git-based workflows.

Team members worked on different modules and integrated their changes into the shared project.

This provided practical experience with:

* Git branches
* Feature development
* Merging
* Conflict resolution
* Collaborative development
* Code integration

---

## 📌 Project Status

**Current Status:** Functional academic frontend prototype

### Completed

* Multi-page application
* Admin interface
* Staff interface
* Authentication pages
* Product management
* Inventory management
* Sales management
* Customer management
* Purchasing workflows
* Employee management
* Attendance
* Accounting interface
* Reports
* Settings
* Responsive Bootstrap-based UI
* Client-side JavaScript interactions

### Future

* Spring Boot backend
* REST APIs
* Database integration
* Secure authentication
* Role-based authorization
* Production deployment

---

## 📄 License

This project was created for educational and portfolio purposes.

If you intend to reuse or distribute the project, please contact the project contributors.
