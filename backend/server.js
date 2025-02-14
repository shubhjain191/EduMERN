import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhook } from './controllers/webhooks.js'


// Create the express app
const app = express()

// Connect to the database
connectDB()

// Use the cors middleware
app.use(cors())

// Define the routes
app.get('/', (req, res) => res.send('App is running'))
app.post('/clerk', express.json(), clerkWebhook)

// Get the port from the environment variables
const port = process.env.PORT || 5000

// Listen to the port
app.listen(port, () => 
    {console.log(`Server is running on port ${port}`)
})