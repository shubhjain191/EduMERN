import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhook } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/userRoutes.js'
import { stripeWebHooks } from './controllers/webhooks.js'

// Create the express app
const app = express()

// Connect to the database
connectDB()

// Connect to the cloudinary
connectCloudinary()

// Use the cors middleware
app.use(cors())
app.use(clerkMiddleware())

// Define the routes
app.get('/', (req, res) => res.send('App is running'))
app.post('/clerk', express.json(), clerkWebhook)
app.use('/api/educator', express.json(), educatorRouter)
app.use('/api/course', express.json(), courseRouter)
app.use('/api/user', express.json(), userRouter)
app.post('/stripe', express.raw({type: 'application/json'}), stripeWebHooks)

// Get the port from the environment variables
const port = process.env.PORT || 5000

// Listen to the port
app.listen(port, () => 
    {console.log(`Server is running on port ${port}`)
})