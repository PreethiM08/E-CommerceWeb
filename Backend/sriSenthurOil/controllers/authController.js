const bcrypt=require('bcrypt');
const pool=require('../db');
const jwt = require("jsonwebtoken");


const ADMIN_EMAIL='admin19@gmail.com';
const ADMIN_PASSWORD='admin@123';
const ADMIN_ROLE='admin';
const JWT_SECRET='PreeMscCs25';

const register=async (req,res)=>{
    const {name,phone,email,password,role}=req.body;
    try{
        const [existing] = await
            pool.query('SELECT * FROM users WHERE email =?',[email]);
        if(existing.length > 0)
            return res.status(400).json({msg:'User already exists'});

        //check if trying to creat an admin
        if(role==='admin'){
            const[admins]=await
                pool.query("SELECT * FROM users WHERE role='admin'");
            if(admins.length>0){
                return res.status(403).json({msg:'Admin already exists.'});
            }
            //specific email and phone
            if(email!==ADMIN_EMAIL){
                return res.status(403).json({msg:'Invalid admin email'});
            }
        }
        const hashed =await bcrypt.hash(password,10);

        await pool.query(
            'INSERT INTO users (name,phone,email,password,role) VALUES (?,?,?,?,?)',
            [name,phone,email,hashed,role || 'customer']
        );
        res.status(201).json({msg:'User registered successfully'});

    } catch (err){
        console.error(err);
        res.status(500).json({msg:'Error registering user'});
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ msg: 'All fields are required' });

    try {
        // Admin login (hardcoded)
        if (email === ADMIN_EMAIL) {
            if (password === ADMIN_PASSWORD) {
                const token = jwt.sign(
                    { id: 16, role: ADMIN_ROLE },
                    JWT_SECRET,
                    { expiresIn: '1d' }
                );

                return res.json({
                    msg: 'Admin login successful',
                    token,
                    user: {
                        user_id: 16,
                        email: ADMIN_EMAIL,
                        role: ADMIN_ROLE
                    }
                });
            } else {
                return res.status(401).json({ msg: 'Incorrect admin password' });
            }
        }

        // Normal user login
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length === 0)
            return res.status(404).json({ msg: 'User not found' });

        const user = users[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
            return res.status(401).json({ msg: 'Invalid Credentials' });

        const token = jwt.sign(
            { id: user.user_id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            msg: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Error logging in' });
    }
};


module.exports={register,login};