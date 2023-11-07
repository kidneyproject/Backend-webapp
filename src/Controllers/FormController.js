const FormProvider = require("../Components/FormProvider");

class FormController {

    static async getBehaviorForms(req,res){
        try {
            const result = await FormProvider.getBehaviorForms(req.headers.authorization)
            res.json(result)
        } catch (error) {
            console.log(error)
            return null
        }
    }

    static async addBehaviorForms(req,res){
        try {
            const result = await FormProvider.addBehaviorForms(req.headers.authorization,req.body)
            res.json(result)
        } catch (error) {
            console.log(error)
            return null
        }
    }

    static async updateBehaviorForm(req,res){
        try {
            const result = await FormProvider.updateBehaviorForm(req.headers.authorization,req.body)
            res.json(result)
        } catch (error) {
            console.log(error)
        }
    }

    static async deleteBehaviorForm(req,res){
        try {
            const result = await FormProvider.deleteBehaviorForm(req.headers.authorization,req.body)
            res.json(result)
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = FormController;