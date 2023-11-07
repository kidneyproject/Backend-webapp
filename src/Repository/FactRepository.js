const {addDoc,collection,getDocs} = require("firebase/firestore")

const db = require('../Data/db')

class FactRepository{

    static async addFact(fact){
        const result = await addDoc(collection(db, "Fact"), fact);
        return fact
    }

    static async getFacts(){
        const recordRef = collection(db, "Fact");
        const res = await getDocs(recordRef)
        let result = []
        
        res.forEach(element => {
            const addId = {
                "id" : element.id,
                "created_by_staff_id": element.data().created_by_staff_id,
                "fact": element.data().fact
            }
            result.push(addId)
        });
        return result
    }
}

module.exports = FactRepository;