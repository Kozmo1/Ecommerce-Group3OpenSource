import express, {NextFunction, Request, Response} from 'express';
import bcrypt from "bcrypt";
import { ConnectToDb } from '../../../infrastructure/mongodb/connection';
import { User } from '../../../infrastructure/mongodb/models/user';
import { body, validationResult } from 'express-validator';

const userDb: { userEmail: string, userPassword: string }[] = [];

const router = express.Router();

ConnectToDb();

router.post('/users/register', // Express validator middleware
    body('name').notEmpty().withMessage('Name is required'), 
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    async (req: Request, res: Response, next: NextFunction) => { 
      const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return; 
      }
  
      try { 
        const { name, email, password } = req.body; // Destructure the request body
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt
  
        const newUser = new User({ // Create a new user document
          name: name,
          email: email,
          password: hashedPassword
        });
  
        await newUser.save(); // Save the user document to the database
        res.status(201).json({ message: 'User registered successfully' });
      } catch (error) {
        console.error('Error registering user', error);
        res.status(500).json({ message: 'Error registering user' });
      }
    }
  );

  router.post("/users/login",
    body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    async (req: Request, res: Response, next: NextFunction) => { 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }
  
      try {
        const { email, password } = req.body; // Destructure the request body
        const user = await User.findOne({ email }); // Find the user by email
  
        if (!user) {
          res.status(404).json({ message: "User not found" }); // Return a 404 if the user is not found
          return;
        }
  
        const isValidPassword = await bcrypt.compare(password, user.password); // Compare the password with the hashed password
        if (!isValidPassword) {
          res.status(401).json({ message: "Invalid credentials" }); // Return a 401 if the password is incorrect
          return;
        }
  
        res.status(200).json({
          message: "User logged in successfully!", // Return a 200 if the user is logged in successfully
          user: { id: user._id, name: user.name, email: user.email }
        });
      } catch (error) {
        console.error(`Error in login: ${error}`);
        res.status(500).json({ message: "Error during login" });
      }
    }
  );
  //Additional Endpoints we might need

  router.get("/users/:id", async (req: Request, res: Response) => { // Get a user by ID
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
  });

  router.put("/users/:id", async (req: Request, res: Response) => { // Update a user by ID
    try {
        const userId = req.params.id;
        const updateUser = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });
        if (updateUser) {
            res.json(updateUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
  });

  router.delete("/users/:id", async (req: Request, res: Response) => { // Delete a user by ID
    try {
        const userId = req.params.id;
        const deleteUser = await User.findByIdAndDelete(userId);
        if (deleteUser) {
            res.json(deleteUser);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
  });

  router.post("/logout", (req: Request, res: Response) => { // Logout endpoint
    res.json({ message: "User logged out successfully" });
    });

    router.post('/users/:id/taste-profile', // Update a user's taste profile
        body('tasteProfile').isObject().withMessage('Taste profile must be an object'),
        async (req: Request, res: Response) => {
          try {
            const userId = req.params.id;
            const newTasteProfile = req.body.tasteProfile;
      
            const user = await User.findById(userId);
            if (user) {
              if (user.tasteProfile) {
                user.tasteProfile = { ...user.tasteProfile, ...newTasteProfile };
              } else {
                user.tasteProfile = newTasteProfile;
              }
              await user.save();
              res.json({ message: 'Taste profile updated', user });
            } else {
              res.status(404).send('User not found');
            }
          } catch (error) {
            res.status(500).json({ message: "Error updating taste profile" });
          }
        }
      );
    

      //this is just a place holder, we need to figure out how to connect to the orders service
    //   router.get('/users/:id/orders', async (req: Request, res: Response) => {
    //     try {
    //       const userId = req.params.id;
          
    //       // Check if the user exists in your service
    //       const user = await User.findById(userId);
    //       if (!user) {
    //         return res.status(404).send('User not found');
    //       }
      
    //       // Now, fetch orders from the orders service
    //       const ordersServiceUrl = 'http://orders-service/orders'; // Replace with the actual URL of your orders service
          
    //       const response = await axios.get(`${ordersServiceUrl}/${userId}/orders`);
          
    //       if (response.status === 200) {
    //         res.json(response.data);
    //       } else {
    //         // If the orders service returns a non-200 status, forward that information
    //         res.status(response.status).send('Error retrieving orders from service');
    //       }
    //     } catch (error) {
    //       console.error('Error in retrieving orders:', error);
    //       if (error.response) {
    //         // Forward the error from the orders service
    //         res.status(error.response.status).json({ message: "Error retrieving orders", error: error.response.data });
    //       } else {
    //         // For any other errors like network issues, etc.
    //         res.status(500).json({ message: "Error retrieving orders" });
    //       }
    //     }
    //   });   

export = router;