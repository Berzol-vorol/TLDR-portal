const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error');
const User = require('../models/user');

const verifyToken = (req, res, next) => {
    const token = req.params.token;

    if (!token) {
        return res.status(403).json({ success: false, message: 'Token not provided' });
    }

    try {
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({success: false, message: 'Token expired'});
                }
                return res.status(401).json({success: false, message: 'Invalid token'});
            }

            return res.json({success: true, userId: decoded.userId});
        });
    } catch (err){
        const error = new HttpError(
            'Something went wrong',
            500
        );
        return next(error);
    }
};

const getUserById = async (req, res, next) => {
    const id = req.params.uid; // {pid: 'p1'}
    console.log(id)

    let user;
    try {
        user = await User.findById(id).populate('summaries').populate('reviews');
    } catch(err){
        const error = new HttpError(
            'Something went wrong, could not find a user.',
            500
        );
        return next(error);
    }
    if(!user){
        const error = new HttpError('Could not find user for the provided id.', 404);
        return next(error);
    }

    const tagCountMap = {};

    user.summaries.forEach((summary) => {
        summary.tags.forEach((tag) => {
            tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
        });
    });

    // Sort tags by popularity
    const sortedTags = Object.keys(tagCountMap).sort(
        (a, b) => tagCountMap[b] - tagCountMap[a]
    );

    res.json({ user: user.toObject({getters: true }), tags: sortedTags});
}

const getUsers = async (req, res, next) => {
    let users;
    try{
        users = await User.find({}, '-password'); // exclude password
    } catch(err){
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({users: users.map(user => user.toObject({ getters: true }))});
};

const signup = async (req, res, next) => {
    const { login, email, password, image} = req.body;

    let existingUser;
    try{
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again later', 500)
        return next(error)
    }
    if (existingUser) {
        const error = new HttpError('User already exists, plase login instead.', 422)
        return next(error)
    }
 
    let hashedPassword;
    console.log(req.body)
    try{
        hashedPassword = await bcrypt.hash(password, 12); // second parametr is number of salting rounds; 12 is good 
    } catch(err){
        const error = new HttpError('Could not create user, please try again later.', 500);
        return next(error);
    }

    const createdUser = new User({
        login,
        email,
        password: hashedPassword,
        signup_date: new Date(),
        image, 
        rating: 0,
        summaries: [], 
        reviews: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again', 500);
        return next(error);
    }

    let token;
    try{
        token = jwt.sign(
            { userId: createdUser.id, login: createdUser.login },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: '1h' }
            );
    } catch(err){
        const error = new HttpError('Signing up failed, please try again', 500);
        return next(error); 
    }
    res.status(201).json({ 
        user: createdUser.toObject({getters: true }), 
    });
};

const login = async (req, res, next) => {
    const {login, password} = req.body;
    let existingUser;
    try{
        existingUser = await User.findOne({login: login});
    } catch (err) {
        const error = new HttpError('Logging in failed, please try again later', 500)
        return next(error)
    }
    if (!existingUser) {
        const error = new HttpError('Invalid credentials.', 401)
        return next(error)
    }

    let token;
    try{
        token = jwt.sign(
            { userId: existingUser.id, login: existingUser.login },
            process.env.JWT_PRIVATE_KEY,
            { expiresIn: '1h' }
            );
    } catch(err){
        const error = new HttpError('Logging in failed, please try again', 500);
        return next(error); 
    }
    
    let isValidPassword = false;
    try{
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch(err){
        const error = new HttpError('Logging in failed, please try again later', 500)
        return next(error)
    }
    if(!isValidPassword) {
        const error = new HttpError('Invalid credentials.', 401)
        return next(error)
    }
    res.json({ 
        user: existingUser.toObject({getters: true }),
        token: token,
    })
};

const updateUserImage = async (req, res, next) => {
    const id = req.params.uid;
    const { image } = req.body;
    let user
    try{
        user = await User.findById(id);
    } catch(err){
        const error = new HttpError(
            'Something went wrong, could not update the user', 500
        );
        return next(error);
    }

    // if(summary.creator.toString() !== req.userData.userId){
    //     const error = new HttpError(
    //         'You are not allowed to edit this summary.',
    //         401
    //     )
    //     return next(error);
    // }
    user.image = image;

    try{
        await user.save();
    } catch(err){
        const error = new HttpError(
            'Something went wrong, could not update the user', 500
        );
        return next(error);
    }
    res.status(200).json({user: user.toObject({ getters: true })});
}

exports.verifyToken = verifyToken;
exports.getUserById = getUserById;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.updateUserImage = updateUserImage;