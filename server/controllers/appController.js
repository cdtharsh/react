import UserModel from '../model/User.model.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import otpGenerator from 'otp-generator';

/** middleware for verify user */
export async function verifyUser(req, res, next) {
    try {

        const { username } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ username });
        if (!exist) return res.status(404).send({ error: "Can't find User!" });
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
    }
}


/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
}
*/
export async function register(req, res) {
    try {
        const { username, password, profile, email, address, latitude, longitude } = req.body;

        // Check for existing username
        const existUsername = new Promise((resolve, reject) => {
            UserModel.findOne({ username }, function (err, user) {
                if (err) reject(new Error(err));
                if (user) reject({ error: "Please use a unique username" });

                resolve();
            });
        });

        // Check for existing email
        const existEmail = new Promise((resolve, reject) => {
            UserModel.findOne({ email }, function (err, user) {
                if (err) reject(new Error(err));
                if (user) reject({ error: "Please use a unique email" });

                resolve();
            });
        });

        // Use Promise.all to check for both username and email
        Promise.all([existUsername, existEmail])
            .then(() => {
                if (password) {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            // Create new user object with all required fields
                            const user = new UserModel({
                                username,
                                password: hashedPassword,
                                profile: profile || '',
                                email,
                                address: address || '', // Add address field
                                latitude: latitude || null, // Add latitude field
                                longitude: longitude || null // Add longitude field
                            });

                            // Save the user and return the result as a response
                            user.save()
                                .then(result => res.status(201).send({ msg: "User registered successfully" }))
                                .catch(error => res.status(500).send({ error }));

                        }).catch(error => {
                            return res.status(500).send({
                                error: "Unable to hash password"
                            });
                        });
                }
            }).catch(error => {
                return res.status(500).send({ error });
            });

    } catch (error) {
        return res.status(500).send(error);
    }
}



/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/

// In your server code (e.g., auth.js or a similar file)
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(404).send({ error: "Username not Found" });
        }

        // Compare the password
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).send({ error: "Password does not Match" });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role,
            },
            ENV.JWT_SECRET,
            { expiresIn: "24h" } // Token expiration time
        );

        const loginTime = Date.now(); // Get current time in milliseconds

        return res.status(200).send({
            msg: "Login Successful...!",
            username: user.username,
            token,
            loginTime // Include login time in response
        });
    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}


/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {

    const { username } = req.params;

    try {

        if (!username) return res.status(501).send({ error: "Invalid Username" });

        UserModel.findOne({ username }, function (err, user) {
            if (err) return res.status(500).send({ err });
            if (!user) return res.status(501).send({ error: "Couldn't Find the User" });

            /** remove password from user */
            // mongoose return unnecessary data with object so convert it into json
            const { password, ...rest } = Object.assign({}, user.toJSON());

            return res.status(201).send(rest);
        })

    } catch (error) {
        return res.status(404).send({ error: "Cannot Find User Data" });
    }

}


/** GET: http://localhost:8080/api/user/670af1e8a4ab33ab376c4b86 */
export async function getUserById(req, res) {
    const { id } = req.params;

    try {
        const user = await UserModel.findById(id); // Find user by _id
        if (!user) {
            return res.status(404).send({ error: "User not found!" });
        }

        // Remove password from user data
        const { password, ...rest } = user.toObject();
        return res.status(200).send(rest); // Return user data without password
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/

export async function updateUser(req, res) {
    try {
        const { userId, role } = req.user; // Extract userId and role from authenticated user
        const targetUserId = req.body.userId || userId; // Target userId for update
        const body = req.body; // Get the request body

        if (!targetUserId) {
            return res.status(400).send({ error: "User ID is required" });
        }

        // Hash the password if it's being updated
        if (body.password) {
            try {
                body.password = await bcrypt.hash(body.password, 10);
            } catch (error) {
                return res.status(500).send({ error: "Unable to hash password" });
            }
        }

        // Check if the user is an admin or updating their own data
        if (role !== 'admin' && targetUserId !== userId) {
            return res.status(403).send({ error: "You are not authorized to update this user!" });
        }

        // Update user data - Make sure to only include fields that are allowed to be updated
        const updatedUser = await UserModel.findByIdAndUpdate(targetUserId, body, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validators are run on update
        });

        if (!updatedUser) {
            return res.status(404).send({ error: "User not found or no changes made." });
        }

        return res.status(200).send({ msg: "User updated successfully!", user: updatedUser });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}






/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
    req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
    res.status(201).send({ code: req.app.locals.OTP })
}


/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!' })
    }
    return res.status(400).send({ error: "Invalid OTP" });
}


// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
    if (req.app.locals.resetSession) {
        return res.status(201).send({ flag: req.app.locals.resetSession })
    }
    return res.status(440).send({ error: "Session expired!" })
}


// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
    try {

        if (!req.app.locals.resetSession) return res.status(440).send({ error: "Session expired!" });

        const { username, password } = req.body;

        try {

            UserModel.findOne({ username })
                .then(user => {
                    bcrypt.hash(password, 10)
                        .then(hashedPassword => {
                            UserModel.updateOne({ username: user.username },
                                { password: hashedPassword }, function (err, data) {
                                    if (err) throw err;
                                    req.app.locals.resetSession = false; // reset session
                                    return res.status(201).send({ msg: "Record Updated...!" })
                                });
                        })
                        .catch(e => {
                            return res.status(500).send({
                                error: "Enable to hashed password"
                            })
                        })
                })
                .catch(error => {
                    return res.status(404).send({ error: "Username not Found" });
                })

        } catch (error) {
            return res.status(500).send({ error })
        }

    } catch (error) {
        return res.status(401).send({ error })
    }
}

export async function getAllUsers(req, res) {
    try {
        const users = await UserModel.find({}, 'username email firstName lastName mobile address profile latitude longitude createdAt'); // Include latitude and longitude
        return res.status(200).send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

export async function deleteUser(req, res) {
    try {
        const { userId, role } = req.user; // Extract userId and role from authenticated user
        const targetUserId = req.params.id; // Get the user ID to delete from the request parameters

        // Check if the user is trying to delete their own account or if they are an admin
        if (role !== 'admin' && targetUserId !== userId) {
            return res.status(403).send({ error: "You are not authorized to delete this user!" });
        }

        // Delete the user from the database
        const deletedUser = await UserModel.findByIdAndDelete(targetUserId);
        if (!deletedUser) {
            return res.status(404).send({ error: "User not found!" });
        }

        return res.status(200).send({ msg: "User deleted successfully!" });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
}
