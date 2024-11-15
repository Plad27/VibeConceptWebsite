import dotenv from 'dotenv';
dotenv.config();
import express, { response } from 'express'

import  {logger}  from './middleware/logger.js'
import { fileURLToPath } from 'url'
import path from 'path'



import connectDB from './config/database.js'

//calling the schema 
import User from "./models/userSchema.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const app = express()
const PORT = 3000

app.use('/assests', express.static('assests'));
app.use(express.static('public'));

//using middleware
app.use(logger)

//using a route to receive static files 
app.use('/assests', express.static('assests'))

app.use(express.static('.'))

//configuring express 
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//connecting to database
connectDB();
// mongoose.connect('mongodb://127.0.0.1:27017/')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// //defining a new user and saving it 
// const createUser = async () => {
//     try {
//         const newUser = new User({
//             userId: "plad",
//             password: "plassword"
//         });
//         const savedUser = await newUser.save();
//         console.log('User saved:', savedUser);
//     } catch (err) {
//         console.error('Error saving user:', err);
//     }
// };

// // Call the function to create a user
// createUser();

//Static routes are here - PLAD : YOU CAN MAKE THE FILE STRUCTURE SUCH THAT IT REFLECTS THIS BETTER 
// YOU CAN ALSO DO THIS WITH THE IMPORT ROUTER THINGY

app.get('/', (request, response) => {
    response.render('index')
  })
app.get('/contact', (request, response) => {
    response.send('Reach out to us if you have any questions.')
  })
  
app.get('/test', (request, response) => {
    response.send('test t e s t') 
  })



//PAGE NAV ROUTES 

app.get('/feedback', (request, response) => {
    response.sendFile('feedback.html', { root: '.' })
})

app.get('/register', (request, response) => {
    response.render('signupPage')
  })

//DYNAMIC ROUTES 
app.get('/users/:userId', (request, response) => {
    const userId = request.params.userId
  
    response.send(`You are now viewing ${userId}'s page`)
  })

//Nested Routes 
app.get('/users/:userId/friend/:frndId', (request, response) => {
    const userId = request.params.userId
    const frndId = request.params.frndIdId
  
    response.send(`the user ID is ${userId} they are friends with ${frndId}`)
  })


//FORM action route

app.post('/feedback/send', (request, response) => {
    console.log('Contact form submission: ', request.body)
    response.send('thank you for your feedback')
 })

app.post('/register/send', async(request, response) => {
    try{
        const userRegis = new User({
            userId : request.body.username,
            password: request.body.password,
            emailId: request.body.email

        })
        await userRegis.save()
        response.send("new user succesfully created")
    }
    catch (error) {
        console.error(error)
        response.send('user could not be created')
    }
 })

//route for database reading 

app.get('/getinfo/:userId', async (request, response) => {
    try {
        const userId = request.params.userId;
        const user = await User.findOne({ userId: userId });
        
        if (user) {
            response.render('userPage', { User: user });
        } else {
            response.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error fetching user:', error);
    }
});

app.get('/edit/:userId', async (request, response) => {
    try {
        const userId = request.params.userId;
        const user = await User.findOne({ userId: userId }).exec();
        
        if (!user) {
            return response.status(404).send('User not found');
        }

        response.render('userUpdaDelPage', { User: user });
    } catch (error) {
        console.error('Error fetching user:', error);
    }
});
app.post('/edit/:userId', async (request, response) => {
    try {
        const userId = request.params.userId;  // Define userId here
        console.log('Updating user:', userId);
        console.log('New data:', request.body);

        const updatedUser = await User.findOneAndUpdate(
            { userId: userId },  // Use userId here
            {
                userId: request.body.userId,
                emailId: request.body.emailId
                // Add other fields you want to update
            },
            { new: true}
        );

        if (!updatedUser) {
            console.log('User not found:', userId);
        }

        console.log('Updated user:', updatedUser);
        response.redirect(`/edit/${updatedUser.userId}`);


    } catch (error) {
        console.error('Error updating user:', error);
    }
});


app.post('/edit/:userId/del', async (request, response) => {
    try {
        const userId = request.params.userId;
        console.log('Attempting to delete user:', userId);

        const deletedUser = await User.findOneAndDelete({ userId: userId });

        if (!deletedUser) {
            console.log('User not found:', userId);
            return response.status(404).send('User not found');
        }

        console.log('Deleted user:', deletedUser);
        response.redirect('/'); // Redirect to home page or user list page
    } catch (error) {
        console.error('Error deleting user:', error);
        response.status(500).send('Error: The user could not be deleted. ' + error.message);
    }
});


app.listen(PORT, () => {
  console.log(`👋 Started server on port ${PORT}`)
})