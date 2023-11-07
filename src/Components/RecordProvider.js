
const RecordRepository = require('../Repository/RecordRepository')
const TokenChecker = require('./TokenChecker')

class RecordProvider {

    static async queryRecords(token, patientIdsArray, lineIdsArray, recordTypesArray) {
        try {
            const decodedToken = TokenChecker.isTokenValid(token);

            if (!decodedToken) {
                return null;
            }

            if (!decodedToken.is_admin) {
                return null;
            }

            let queryResults;

            if (!patientIdsArray && !lineIdsArray && !recordTypesArray) {
                const result = await RecordRepository.getAllPatientCollection();
                queryResults = result.map(patient => ({
                    id: patient.id,
                    lineId: patient.lineId,
                    behavior_records: patient.behavior_records,
                    blood_pressure_records: patient.blood_pressure_records,
                    weight_records: patient.weight_records,
                    eGFR_records: patient.eGFR_records,
                    Hba1c_records: patient.Hba1c_records,
                }));
            } else if ((patientIdsArray || lineIdsArray) && !recordTypesArray) {
                const defaultRecordTypesArray = ['blood_pressure_records', 'behavior_records', 'eGFR_records', 'weight_records', 'Hba1c_records']
                queryResults = await RecordRepository.getRecordsForPatients(patientIdsArray, lineIdsArray, defaultRecordTypesArray);
            } else if (!patientIdsArray && !lineIdsArray && recordTypesArray) {
                queryResults = await RecordRepository.getRecordsForAllPatients(recordTypesArray);
            } else {
                queryResults = await RecordRepository.getRecordsForPatients(patientIdsArray, lineIdsArray, recordTypesArray);
            }

            if (queryResults && queryResults.length > 0) {
                return queryResults;
            } else {
                return 'No matching records found';
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static async getPatientRecords(token) {
        try {
            const deToken = TokenChecker.isTokenValid(token)

            if (deToken == null) {
                return null
            }

            const result = await RecordRepository.getRecords(deToken.id)

            const selectedFields = {
                blood_pressure_records: result.blood_pressure_records,
                weight_records: result.weight_records,
                eGFR_records: result.eGFR_records,
                Hba1c_records: result.Hba1c_records,
                behavior_records: result.behavior_records,
            };

            const isAllFieldsUndefined = Object.values(selectedFields).every(value => value === undefined);
            const isAllFieldsEmpty = Object.values(selectedFields).every(value => Array.isArray(value) && value.length === 0);

            if (isAllFieldsUndefined || isAllFieldsEmpty) {
                return 'no data available';
            } else {
                return selectedFields;
            }

        } catch (error) {
            console.log(error)
        }
    }

    static async addSubRecord(record, token, record_name) {
        try {
            const sub_record_list = ["weight_records", "blood_pressure_records", "behavior_records", "Hba1c_records", "eGFR_records"]
            if (!(sub_record_list.includes(record_name))) {
                return null
            }
            const id = TokenChecker.isTokenValid(token).id
            if (id == null) {
                return null
            }
            const collection_name = "Patient"
            const result = await RecordRepository.addSubRecord(collection_name, id, record_name, record)
            return result
        } catch (error) {
            console.log(error)
        }
    }

    static async updateSubRecord(token, id, sub_name, indexToUpdate, updatedValue) {
        try {
            const deToken = TokenChecker.isTokenValid(token);
            if (deToken == null) {
                return null;
            }

            if (!sub_name || !indexToUpdate || indexToUpdate < 0) {
                return null;
            }

            const collection_name = "Patient"
            const recordRef = doc(db, collection_name, id);

            // Create an object to update the specific subrecord field
            const updateData = {};
            updateData[`${sub_name}.${indexToUpdate}`] = updatedValue;

            await updateDoc(recordRef, updateData);

            return "Subrecord updated";
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static async deleteSubRecord(token, id, sub_name, indexToDelete) {
        try {
            const deToken = TokenChecker.isTokenValid(token);
            if (deToken == null) {
                return null;
            }

            if (!sub_name || !indexToDelete || indexToDelete < 0) {
                return null;
            }

            const collection_name = "Patient"
            const recordRef = doc(db, collection_name, id);

            // Create an object to delete the specific subrecord field
            const deleteData = {};
            deleteData[`${sub_name}.${indexToDelete}`] = FieldValue.delete();

            await updateDoc(recordRef, deleteData);

            return "Subrecord deleted";
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static async addRecord(token, record) {
        try {

            const id = TokenChecker.isTokenValid(token).id

            if (id == null) {
                return null
            }

            const result = await RecordRepository.addRecord(record.form_id, id, record.answer, record.created_at, false)
            return result
        } catch (error) {
            console.log(error)
        }
    }

    static async updateRecord(token, reqBody) {
        const deToken = await TokenChecker.isTokenValid(token)
        if (deToken == null) {
            return null
        }

        const { id, answer } = reqBody
        const result = await RecordRepository.updateRecord(id, answer)
        return result
    }

    static async deleteRecord(token, reqBody) {

        const deToken = await TokenChecker.isTokenValid(token)
        if (deToken == null) {
            return null
        }

        const { id } = reqBody
        const result = await RecordRepository.deleteRecord(id)
        return result
    }

    static async addBehaviorRecord(token, record) {
        const id = TokenChecker.isTokenValid(token).id

        if (id == null) {
            return null
        }

        const result = await RecordRepository.addRecord(record.form_id, id, record.answer, record.created_at, true)
        return result
    }

}

module.exports = RecordProvider