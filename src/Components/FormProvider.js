const FormRepository = require("../Repository/FormRepository");
const TokenChecker = require("./TokenChecker");

class FormProvider {

    static async getBehaviorForms(token) {
        const deToken = TokenChecker.isTokenValid(token)
        if (deToken == null) {
            return null
        }

        const result = await FormRepository.getBehaviorForms()
        return result
    }

    static async addBehaviorForms(token, reqBody) {
        const deToken = TokenChecker.isTokenValid(token)
        if (deToken.is_admin == false) {
            return null
        }
        
        let dataObject = {
            "question": reqBody.question,
            "created_time": reqBody.created_time,
            "created_by_staff_id": deToken.id,
        }

        const result = await FormRepository.addForm(dataObject)

        return result
    }

    static async updateBehaviorForm(token, reqBody) {
    const deToken = TokenChecker.isTokenValid(token);
    if (deToken == null || deToken.is_admin == false) {
        return null;
    }

    const id = reqBody.id;
    const question = reqBody.question;

    if (!id || !question) {
        return null;
    }

    const result = await FormRepository.updateForm(id, question);
    return result;
}
    
    static async deleteBehaviorForm(token, reqBody) {
    const deToken = TokenChecker.isTokenValid(token);
    if (deToken == null || deToken.is_admin == false) {
        return null;
    }
    const id = reqBody.id;

    if (!id) {
        return null;
    }

    const result = await FormRepository.deleteForm(id);
    return result;
}
}

module.exports = FormProvider;