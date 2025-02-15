import { Webhook } from "svix";
import  User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/course.js";

//API Controller function to manage clerk user with database
export const clerkWebhook = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //Verify the webhook request
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        })

        const { data, type } = req.body

        //Handle different webhook events
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id: data.id,
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }

                await User.create(userData)
                res.json({})
                break;
            }

            //Update user data
            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    name: data.first_name + " " + data.last_name,
                    imageUrl: data.image_url,
                }

                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;
            }

            //Delete user data
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;
            }

            default:
                break;
        }

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//Stripe Webhook Controller function
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)

export const stripeWebHooks = async (req, res) => {
    const sig = req.headers['stripe-signature']

    let event

    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (error) {
        console.error('Webhook Error:', error.message)
        return res.status(400).send(`Webhook Error: ${error.message}`)
    }

    //Handle different webhook events
    switch (event.type) {
        case 'payment_intent.succeeded' : {
            const paymentIntent  = event.data.object
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({payment_intent: paymentIntentId})

            const {purchaseId} = session.data[0].metadata

            const purchaseData = await Purchase.findById(purchaseId) //Find the purchase data
            const userData = await User.findById(purchaseData.userId) //Find the user data
            const courseData = await Course.findById(purchaseData.courseId.toString()) //Find the course data

            courseData.enrolledStudents.push(userData) //Add the user to the course
            await courseData.save() //Save the course data

            userData.enrolledCourses.push(courseData._id) //Add the course to the user
            await userData.save() //Save the user data

            purchaseData.status = 'completed' //Update the purchase status
            await purchaseData.save() //Save the purchase data          

            break;
        }

        //Handle payment failed event
        case 'payment_intent.payment_failed': {     
            const paymentIntent  = event.data.object
            const paymentIntentId = paymentIntent.id;

            const session = await stripeInstance.checkout.sessions.list({payment_intent: paymentIntentId})

            const {purchaseId} = session.data[0].metadata

            const purchaseData = await Purchase.findById(purchaseId)
            purchaseData.status = 'failed'
            await purchaseData.save()

            break;
        }
        
        
        default:
            console.log(`Unhandled event type ${event.type}`);
        }

        res.json({received: true})
}


