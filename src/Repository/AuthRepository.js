const { collection, query, where, getDocs, addDoc, setDoc, getDoc, doc, orderBy, limit } = require("firebase/firestore");
const db = require('../Data/db')

class AuthRepository{

    static async findPatients(lineId){
    
        const q = query(collection(db, "Patient"), where("lineId", "==", lineId));
        const result = await getDocs(q);
        return result
    }

    static async findPatient(lineId){
    
        const q = query(collection(db, "Patient"), where("lineId", "==", lineId));
        const result = await getDoc(q);
        return result
    }

    static async addPatient(patientInfo) {
        try {
            const patientRef = collection(db, "Patient");
            const latestPatientQuery = query(patientRef, orderBy("id", "desc"), limit(1));
            const latestPatientSnapshot = await getDocs(latestPatientQuery);
    
            let newPatientId = 1;
    
            if (!latestPatientSnapshot.empty) {
                const latestPatient = latestPatientSnapshot.docs[0].data();
                newPatientId = latestPatient.id + 1;
            }
    
            await setDoc(doc(db, "Patient", newPatientId.toString()), { id: newPatientId, ...patientInfo });
    
            return { id: newPatientId, ...patientInfo };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async findAdmins(username){
    
        const q = query(collection(db, "Admin"), where("username", "==", username));
        const result = await getDocs(q);
        return result
    }

    static async findAdminStaff(username){
    
        const q = query(collection(db, "Admin"), where("username", "==", username));
        const result = await getDoc(q);
        return result
    }

    static async addAdminStaff(adminInfo) {
        try {
            const adminRef = collection(db, "Admin");
            const latestAdminQuery = query(adminRef, orderBy("id", "desc"), limit(1));
            const latestAdminSnapshot = await getDocs(latestAdminQuery);
    
            let newAdminId = 1;
    
            if (!latestAdminSnapshot.empty) {
                const latestAdmin = latestAdminSnapshot.docs[0].data();
                newAdminId = latestAdmin.id + 1;
            }
    
            await setDoc(doc(db, "Admin", newAdminId.toString()), { id: newAdminId, ...adminInfo });
    
            return { id: newAdminId, ...adminInfo };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }    
}

module.exports = AuthRepository