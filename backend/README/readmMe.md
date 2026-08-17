POST http://localhost:5000/api/auth/verify-otp
Body: {
  "email": "your_email@gmail.com",
  "otp": "431860",
  "name": "Rahul Sharma"
}

//admin login 
POST http://localhost:5000/api/auth/admin/login
Body: {
  "email": "admin@shop.com",
  "password": "Admin@123"
}

add krene ke liye product 
POST http://localhost:5000/api/categories
Headers: Cookie: token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Body: {
  "name": "Men's Clothing",
  "description": "Premium men's fashion collection",
  "image": "https://example.com/men.jpg",
  "order": 1
}

http://localhost:5000/api/auth/verify-otp
{
  "email": "gondprinceg@gmail.com",
  "otp": "934046",
  "name": "Rahul Sharma"
}

http://localhost:5000/api/auth/send-otp
{
  "email": "gondprinceg@gmail.com"
}

📋 Required vs Optional Fields:
Field	Required?	Default
name	✅ Required	-
description	✅ Required	-
price	✅ Required	-
quantity	✅ Required	-
category	✅ Required	-
images	✅ Required	-
thumbnail	✅ Required	-
comparePrice	❌ Optional	null
shortDescription	❌ Optional	""
colors	❌ Optional	[]
sizes	❌ Optional	[]
tags	❌ Optional	[]
sku	❌ Optional	""
isFeatured	❌ Optional	false
isActive	❌ Optional	true