const { initializeApp } = require('firebase/app')
const { getFirestore } = require('firebase/firestore')

const { doc, deleteDoc, collection, addDoc, updateDoc, arrayUnion, getDocs, getDoc, query, where } = require("firebase/firestore");

const db = require('../Data/db')


class RecordRepository {

    static async getRecordsForPatients(patientIds, lineIds, recordTypes) {
        const recordRef = collection(db, "Patient");
        const result = await getDocs(recordRef);

        const patientRecords = [];
        result.docs.forEach(doc => {
            const data = doc.data();
            const id = doc.id;
            const lineId = data.lineId;

            const filteredData = {
                id,
                lineId
            };

            recordTypes.forEach(type => {
                filteredData[type] = data[type] || [];
            });

            if (patientIds != null) {
                if (patientIds.includes(id)) {
                    patientRecords.push(filteredData);
                }
            }
            if (lineIds != null) {
                if (lineIds.includes(lineId)) {
                    patientRecords.push(filteredData);
                }
            }
        });
        return patientRecords;
    }

    static async getRecordsForAllPatients(recordTypes) {
        const recordRef = collection(db, "Patient");
        const result = await getDocs(recordRef);

        const patientRecords = [];
        result.docs.forEach(doc => {
            const data = doc.data();
            const id = doc.id;
            const lineId = data.lineId;

            const filteredData = {
                id,
                lineId
            };

            recordTypes.forEach(type => {
                filteredData[type] = data[type] || [];
            });

            patientRecords.push(filteredData);
        });
        return patientRecords;
    }

    static async getAllPatientCollection() {

        const recordRef = collection(db, "Patient");
        const result = await getDocs(recordRef)

        let result_array = []

        result.docs.forEach(doc => {
            const data = doc.data();
            const id = doc.id;
            result_array.push({ id, ...data });
        });

        return result_array;
    }

    static async getRecords(id) {

        const recordRef = doc(db, "Patient", id);
        const result = await getDoc(recordRef)

        return result.data()
    }

    static async updateRecord(id, answer) {
        const formRef = doc(db, "Record", id);

        await updateDoc(formRef, {
            answer: answer
        });

        const result = { "answer": answer }

        return result
    }

    static async deleteRecord(id) {
        await deleteDoc(doc(db, "Record", id));

        return "Deleted"
    }

    static async addSubRecord(collection_name, id, sub_name, record) {

        const recordRef = doc(db, collection_name, id);

        var add_object = {};
        add_object[sub_name] = arrayUnion(record);

        const res = await updateDoc(recordRef, add_object);

        return res
    }

    static async updateSubRecord(collection_name, id, sub_name, record) {
        const recordRef = doc(db, collection_name, id);

        // Create an object to update the specific subrecord field
        const updateData = {};
        updateData[`${sub_name}.${record.index}`] = record.updatedValue;

        await updateDoc(recordRef, updateData);

        return "Subrecord updated";
    }

    static async deleteSubRecord(collection_name, id, sub_name, indexToDelete) {
        const recordRef = doc(db, collection_name, id);

        const deleteData = {};
        deleteData[`${sub_name}.${indexToDelete}`] = FieldValue.delete();

        await updateDoc(recordRef, deleteData);

        return "Subrecord deleted";
    }

    static async addRecord(formID, userID, answer, createdAt, isBehavior) {

        const addRecord = {
            "form_id": formID,
            "patient_id": userID,
            "answer": answer,
            "created_at": createdAt,
            "is_behavior": isBehavior
        }

        await addDoc(collection(db, "Record"), addRecord);

        return addRecord
    }

}

module.exports = RecordRepository