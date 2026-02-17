# Application Flow Chart

## Entry Point

```
START → INDEX PAGE
```

## Roles & Flows

```
INDEX PAGE
├── ADMIN LOGIN
│   └── ADMIN DASHBOARD
│       ├── Maintain User
│       │   ├── Add User
│       │   └── Update User
│       └── Maintain Vendor
│           ├── Add Vendor (+ Add Membership for Vendor)
│           └── Update Vendor (+ Update Membership for Vendor)
│
├── VENDOR LOGIN / SIGNUP
│   └── VENDOR DASHBOARD
│       ├── Add New Item    → Insert Product
│       ├── Your Items      → Delete / Update Product
│       ├── Transactions    → Update Order Status
│       │                     (Received → Ready for Shipping → Out for Delivery → Delivered)
│       ├── Product Status  → Delete / Update
│       └── Request Item    → View user requests → Fulfill by adding to catalog
│
└── USER LOGIN / SIGNUP
    └── USER PORTAL (Browse by Category)
        │   Categories: Catering / Florist / Decoration / Lighting
        ├── Vendor Page     → View Vendor Products
        ├── Products        → Add to Cart
        ├── Cart            → Remove Item / Delete All / Proceed to Checkout
        │   └── CheckOut    → Delivery details + Payment (Cash / UPI)
        │       └── SUCCESS / THANK YOU popup
        ├── Guest List      → Manage event guest list
        ├── Order Status    → Check Status (Received / Shipped / Delivered)
        └── Request Item    → Request unlisted items from vendors
```

## Business Rules

1. Admin has exclusive access to the Maintenance module.
2. Users cannot access the Maintenance module.
3. Users and Vendors both have access to reports and transactions.
4. Passwords are masked on all login/signup screens.
5. All form fields are validated before submission.
6. Sessions are maintained per role; unauthorized access redirects to login.
7. Radio buttons — only one can be selected at a time.
8. Checkboxes — checked = yes, unchecked = no.
9. Payment options: Cash or UPI (dropdown).
10. Vendor category options: Catering, Florist, Decoration, Lighting.
