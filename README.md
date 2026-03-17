# Home Booking System Fullstack
A fullstack home booking system web application. Where users can view, browse and host homes. Project is built with React, Node JS and MongoDB containerized with Docker.

## Technologies Used
- Frontend: React
- Backend: Node.js / Express
- Database: MongoDB
- Docker

## Features
- User can book a home
- User can login / register
- Host Dashboard
- Host can manually confirm booking

## Docker Image
Front End and Backend : https://hub.docker.com/r/xploreprabhat/home-booking-fullstack

## Getting Started\
Install Docker
Create Stripe Account
### Step 1 — Clone the repo
```
git clone https://github.com/your-username/home-booking-fullstack.git
cd home-booking-fullstack
```

### Step 2 — Create environment files

Create `./backend/.env`:
```
PORT=3000
MONGO_URL = "mongodb://mongo:27017/airbnbLocal"
PORT = 3000
HOST = 0.0.0.0
SESSION_SECRET = your secret key
STRIPE_SECRET = your secret key


STRIPE_WEBHOOK_SECRET = webhook secret
```

Create `./client/.env`:
```
VITE_API_URL=http://localhost:3000
```
Stripe publishable key
```
VITE_STRIPE_PUBLISHABLE_KEY=**********
```

### Step 3 — Run the app
```
docker compose up --build
```

### Step 4 — Open your browser
```
Frontend → http://localhost:5173
Backend  → http://localhost:3000
```


## Screenshots

Client view


<img width="1908" height="908" alt="Screenshot 2026-03-17 233500" src="https://github.com/user-attachments/assets/b024e81e-acd6-41c4-bb80-29f7b2831492" />

<img width="1908" height="908" alt="image" src="https://github.com/user-attachments/assets/358e33d4-7c2e-4859-91ff-b0896c483f31" />


Host view


<img width="1626" height="834" alt="Screenshot 2026-03-17 233317" src="https://github.com/user-attachments/assets/3d5f3870-698a-441c-b6a0-677131e02f85" />
<img width="1895" height="905" alt="Screenshot 2026-03-17 233426" src="https://github.com/user-attachments/assets/6f152df2-6e8a-42fb-9684-1b60bea4d55e" />



## License
MIT
