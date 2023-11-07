const FactProvider = require("../Components/Factprovider");


class FactController{

    static async addFact(req,res){
        try {
            const result = await FactProvider.addFact(req.headers.authorization,req.body)
            res.json(result)
        } catch (error) {
            console.log(error)
            res.json(null)
        }
    }

    static async getFacts(req,res){
        try {
            const result = await FactProvider.getFacts()
            res.json(result)
        } catch (error) {
            console.log(error)
            res.json(null)
        }
    }

    static async updateFact(req,res){
        try {
            const result = await FactProvider.updateFact()
            res.json(result)
        } catch (error) {
            console.log(error)
            res.json(null)
        }
    }

    static async deleteFact(req,res){
        try {
            const result = await FactProvider.deleteFact()
            res.json(result)
        } catch (error) {
            console.log(error)
            res.json(null)
        }
    }
}

module.exports = FactController;