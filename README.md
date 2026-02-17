# 🎉 Event Management System

A full-stack web application for managing events, vendors, users, and orders — with role-based access for **Admin**, **Vendor**, and **User**.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [User Roles](#user-roles)
- [Application Flow](#application-flow)
- [Screenshots](#screenshots)

---

## Overview

The Event Management System allows:
- **Admins** to manage users, vendors, memberships, and maintain the platform.
- **Vendors** to list products/services, manage inventory, and update order statuses.
- **Users** to browse vendors, add items to cart, checkout, and track orders.

---

## Features

### Admin
- Login with credentials
- Maintain Users (Add / Update)
- Maintain Vendors (Add / Update)
- View all orders and transactions

### Vendor
- Signup & Login
- Add / Update / Delete products
- View product status
- Handle item requests from users
- Update order delivery status (Received → Ready for Shipping → Out for Delivery)

### User
- Signup & Login
- Browse vendors by category (Catering, Florist, Decoration, Lighting)
- View products and add to cart
- Manage cart (quantity, remove items)
- Checkout with delivery details & payment method (Cash / UPI)
- View order status

---

## Tech Stack

| Layer      | Technology                     |
|------------|-------------------------------|
| Frontend   | HTML5, CSS3, JavaScript (Vanilla) |
| Backend    | Node.js, Express.js            |
| Database   | MongoDB (Mongoose ODM)         |
| Auth       | Express-Session, bcryptjs      |
| Templating | HTML pages (served statically) |

---

## Project Structure

```
event-management-system/
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── pages/
│       ├── index.html
│       ├── admin-login.html
│       ├── admin-signup.html
│       ├── vendor-login.html
│       ├── vendor-signup.html
│       ├── user-login.html
│       ├── user-signup.html
│       ├── vendor-dashboard.html
│       ├── user-portal.html
│       ├── vendor-page.html
│       ├── products.html
│       ├── cart.html
│       ├── checkout.html
│       ├── success.html
│       ├── request-item.html
│       ├── product-status.html
│       ├── update-order.html
│       ├── order-status.html
│       ├── admin-dashboard.html
│       ├── maintain-user.html
│       └── maintain-vendor.html
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Vendor.js
│   │   ├── Admin.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Cart.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── vendorRoutes.js
│   │   └── userRoutes.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── vendorController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── auth.js
│   └── server.js
│
├── docs/
│   └── flow-chart.md
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/event-management-system.git
cd event-management-system

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI and session secret

# 4. Start the server
npm start
```

Visit `http://localhost:3000` in your browser.

---

## Usage

1. **Admin** logs in via `/pages/admin-login.html`
2. **Vendor** signs up via `/pages/vendor-signup.html`, then logs in
3. **User** signs up via `/pages/user-signup.html`, then browses and orders

---

## User Roles

| Role   | Access                                            |
|--------|---------------------------------------------------|
| Admin  | Maintenance, Reports, Transactions                |
| Vendor | Products, Orders, Requests, Status Updates        |
| User   | Browse, Cart, Checkout, Order Status              |

> **Note:** Users cannot access the Maintenance module. Admin has exclusive access.

---

## Application Flow

```
START → INDEX
  ├── Admin Login → Admin Dashboard → Maintain User / Maintain Vendor
  ├── Vendor Login → Vendor Dashboard → Add Item / Your Items / Transactions
  │                                        └── Product Status / Request Item
  └── User Login  → User Portal (by category)
                         └── Vendors → Products → Cart → Checkout → Success
                                                              └── Order Status
```

---

## Validations

- All forms have mandatory field validation
- Passwords are hidden on login screens
- Radio buttons: only one selection allowed
- Checkboxes: checked = Yes, unchecked = No
- Session management is enforced throughout
- Payment methods: Cash / UPI (dropdown)

---

## License

This project is for educational/demo purposes.
