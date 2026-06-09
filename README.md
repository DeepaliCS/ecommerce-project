
# E-Commerce Platform

A full stack e-commerce web application built with Django REST Framework and React. Demonstrates end-to-end product management, cart functionality, and real payment processing via Stripe.

---

## Live Demo Features

- Browse products with category filtering and real-time search
- Add to cart with quantity controls and live total calculation
- Dark mode toggle
- Loading skeleton UI for professional UX
- Toast notifications for user feedback
- Stripe payment integration with test card support

<img width="2816" height="1626" alt="Screenshot 2026-06-09 162138" src="https://github.com/user-attachments/assets/0dcd3b18-84f6-4f37-8662-cf7969e00332" />

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Django 5.2 | Web framework |
| Django REST Framework | REST API |
| PostgreSQL | Relational database |
| Stripe Python SDK | Payment processing |
| django-cors-headers | Cross-origin request handling |
| djangorestframework-simplejwt | JWT authentication (ready to extend) |
| python-dotenv | Environment variable management |

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Stripe.js + React Stripe.js | Secure card input and payment confirmation |
| CSS-in-JS (inline styles) | Component-scoped styling |
| Fetch API | HTTP requests to Django backend |

---

## Project Structure

```
ecommerce-project/
├── backend/                        # Django REST API
│   ├── backend/                    # Project settings, URLs, Stripe views
│   ├── products/                   # Product and Category models, serializers, views
│   ├── orders/                     # Order and OrderItem models, serializers, views
│   ├── users/                      # User app (extendable for auth)
│   ├── manage.py
│   └── .env.example                # Environment variable template
└── frontend/                       # React application
    └── src/
        ├── components/
        │   ├── Navbar.jsx           # Navigation with dark mode and cart toggle
        │   ├── ProductCard.jsx      # Individual product display
        │   ├── CartSidebar.jsx      # Slide-out cart with quantity controls
        │   └── CheckoutForm.jsx     # Stripe card input and payment submission
        └── App.js                   # Main app, state management, API calls
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products/` | List all products |
| POST | `/api/products/` | Create a product |
| GET | `/api/products/{id}/` | Get product detail |
| GET | `/api/categories/` | List all categories |
| GET | `/api/orders/` | List all orders |
| POST | `/api/orders/` | Create an order |
| POST | `/api/create-payment-intent/` | Create Stripe payment intent |

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js v20+ (via nvm recommended)
- PostgreSQL
- Stripe account (free, test mode)

---

### Backend Setup

1. Clone the repo
```bash
git clone https://github.com/DeepaliCS/ecommerce-project.git
cd ecommerce-project
```

2. Create and activate a conda environment
```bash
conda create -n ecommerce python=3.11
conda activate ecommerce
```

3. Install dependencies
```bash
cd backend
pip install django djangorestframework psycopg2-binary stripe djangorestframework-simplejwt django-cors-headers python-dotenv
```

4. Create your `.env` file from the example
```bash
cp .env.example .env
```

Edit `.env` with your values:
```
STRIPE_SECRET_KEY=sk_test_your_key_here
DATABASE_PASSWORD=your_postgres_password
```

5. Create the PostgreSQL database
```bash
sudo -u postgres psql -c "CREATE DATABASE ecommerce_db;"
```

6. Run migrations
```bash
python manage.py migrate
```

7. (Optional) Load sample data
```bash
python manage.py shell
```
```python
from products.models import Category, Product
electronics = Category.objects.create(name='Electronics')
clothing = Category.objects.create(name='Clothing')
Product.objects.create(name='Wireless Headphones', description='Premium noise cancelling headphones', price=99.99, stock=50, category=electronics, image_url='')
Product.objects.create(name='Cotton T-Shirt', description='100% organic cotton t-shirt', price=19.99, stock=100, category=clothing, image_url='')
exit()
```

8. Start the backend server
```bash
python manage.py runserver
```

Backend runs at `http://localhost:8000`

---

### Frontend Setup

1. Navigate to frontend and install dependencies
```bash
cd ../frontend
npm install
```

2. Create your `.env` file
```bash
echo "REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here" > .env
```

3. Start the React development server
```bash
npm start
```

Frontend runs at `http://localhost:3000`

---

## Testing Stripe Payments

Use Stripe's test card details — no real money is charged:

| Field | Value |
|---|---|
| Card number | 4242 4242 4242 4242 |
| Expiry | Any future date e.g. 12/28 |
| CVC | Any 3 digits e.g. 123 |
| Postcode | Any 5 digits e.g. 12345 |

---

## What This Demonstrates

- Full stack architecture with decoupled Django API and React frontend
- RESTful API design with Django REST Framework ViewSets and Routers
- Real payment integration using Stripe PaymentIntents API
- React component architecture with props-based data flow
- State management with React hooks (useState, useEffect)
- Environment variable handling for secret management
- CORS configuration for cross-origin API communication
- PostgreSQL integration with Django ORM
- Production-ready patterns: loading states, error handling, toast notifications

---

## Author

Deepali — Senior Python Developer  
[GitHub](https://github.com/DeepaliCS) | [Upwork](https://www.upwork.com/freelancers/deepalics)
