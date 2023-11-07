const { doc, setDoc,collection, addDoc, updateDoc,arrayUnion, getDocs, getDoc,query, where, deleteDoc, orderBy, limit } = require("firebase/firestore")
const db = require('../Data/db')

class FormRepository{

    static async updateForm(id,question){
        const formRef = doc(db, "Form", id);

        await updateDoc(formRef, {
            question: question
        });

        return {"question" : question}
    }

    static async deleteForm(id){
        await deleteDoc(doc(db, "Form", id));

        return "Deleted"
    }

    static async addForm(formData){
        try {
            const formRef = collection(db, "Form");
            const latestFormQuery = query(formRef, orderBy("id", "desc"), limit(1)); 
            const latestFormSnapshot = await getDocs(latestFormQuery);

            let newFormId = 1;
            if (!latestFormSnapshot.empty) {
                const latestForm = latestFormSnapshot.docs[0].data();
                newFormId = latestForm.id + 1;
            }

            await setDoc(doc(db, "Form", newFormId.toString()), { id: newFormId, ...formData });

            return { id: newFormId, ...formData };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getBehaviorForms(){
        const q = query(collection(db, "Form"));
        const result = await getDocs(q);
        
        let dataResult = []

        result.forEach((doc) => {
            const temp = {
                "id" : doc.id,
                "question" : doc.data().question
            }
            dataResult.push(temp)
        });

        return dataResult
    }

}

module.exports = FormRepository;