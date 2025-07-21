const jwt=require('jsonwebtoken');
const secret='PreeMscCs25';

const generateToken=(user) =>{
    return jwt.sign({user_id:user.user_id},secret,{expiresIn:'1h'});
};

const verifyToken=(token)=>{
    return jwt.verify(token,secret);
};

module.exports={generateToken,verifyToken};