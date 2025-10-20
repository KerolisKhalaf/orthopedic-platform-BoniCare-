import jwt from 'jsonwebtoken';

export const protect = (roles = [])=>(req, res, next)=>{
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized (have no token)' });

            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; //{id,role}

            if (roles.length && !roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });

            next();
        }
    }catch(err){
        return res.status(401).json({message:'❌ Auth Middleware Error: Invalid Token'} );    
        }
    };