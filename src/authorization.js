const jwt = require('jsonwebtoken')


function authenticateToken(req, res, next){
		const authHeader = req.headers['authorization']
		// we split because its: BEARER <token>
		const token = authHeader && authHeader.split(' ')[1]
	
		if(token == null){
				res.status(400)
		}
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
			if(err) return res.sendStatus(403)
	
			req.user = user;
			next()
		})
	}
	
	function authorizeRoles(allowedRoles) {
		return (req, res, next) => {
			if (!allowedRoles.includes(req.user.user.role)) {
				return res.status(403).send('Access forbidden: insufficient rights');
			}
			next();
		}
	}


module.exports = {
								 authenticateToken, authorizeRoles}