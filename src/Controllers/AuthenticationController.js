const AuthProvider = require('../Components/AuthProvider')

class AuthenticationController {

    static async signup (req,res){
        const result = await AuthProvider.addPatient(req.body)
        return res.json(result)
    }

    static async signin(req,res){
        const {
            lineId,
            password
        } = req.body

        const token = await AuthProvider.patientSignIn(lineId,password)

        const result = {
            "token" : token
        }

        res.json(result)
        
    }

    static async adminSignup (req,res){
        const result = await AuthProvider.addAdmin(req.body)
        return res.json(result)
    }

    static async adminSignin(req,res){
        const {
            username,
            password
        } = req.body

        const token = await AuthProvider.AdminSignIn(username,password)
        const result = {
            "token" : token
        }

        res.json(result)
        
    }

    
}

module.exports = AuthenticationController