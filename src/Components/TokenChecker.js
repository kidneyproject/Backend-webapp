const jwt = require("jsonwebtoken");

class TokenChecker{

    static isTokenValid(token){
        try {
            const decodedToken = jwt.verify(token,process.env.TOKEN_SECRET);
            return decodedToken
        } catch (error) {
            return null
        }
    }
}

module.exports = TokenChecker;