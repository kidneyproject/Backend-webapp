const FactRepository = require("../Repository/FactRepository")
const TokenChecker = require("./TokenChecker")


class FactProvider{

    static async addFact(token,body){
        const deToken = TokenChecker.isTokenValid(token)

        if(deToken.is_admin == false){
            return null
        }

        const factAdd = {
            "fact" : body.fact,
            "created_by_staff_id" : deToken.id
        }

        const result = await FactRepository.addFact(factAdd)
        return result

    }
    

    static async getFacts(){
        const result = await FactRepository.getFacts()
        return result

    }

    static async updateFact(){
        
    }

    static async deleteFact(){
        
    }
}

module.exports = FactProvider