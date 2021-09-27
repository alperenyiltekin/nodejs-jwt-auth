const router = require("express").Router();
const bcrypt = require("bcryptjs")
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken")
const User = require("../model/User");

const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().max(200).email().required(),
    password: Joi.string().min(6).max(256).required(),
});
const loginSchema = Joi.object({
    email: Joi.string().max(200).email().required(),
    password: Joi.string().min(6).max(256).required(),
});

/* 
If you want to password confirm operation, you can apply below code for entering second time password

password: Joi.string().min(6).required(),
confirmPassword: Joi.string().valid(Joi.ref('password')).required(),

*/

const optionJoi = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
};

router.post("/register", async (req, res) => {
    // Validation data before sending response
    const { error, value } = registerSchema.validate(req.body, optionJoi);
    if (error) return res.status(400).send(error.details[0].message);

    // Check for exist user
    const existUser = await User.findOne({
        email: req.body.email,
    });
    if (existUser) return res.status(400).send("Email already exists");

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send(err);
    }
});


// Login

router.post('/login', async (req, res) => {
    const { error, value } = loginSchema.validate(req.body, optionJoi);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking user with email 
    const user = await User.findOne({
        email: req.body.email,
    });

    if (!user) return res.status(400).send("Email not found");

    // Password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send('Invalid password')

    // Create a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET_KEY)
    res.header('auth-token', token).send(token)
})

module.exports = router;
