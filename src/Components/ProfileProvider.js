const ProfileRepository = require('../Repository/ProfileRepository');
const RecordRepository = require('../Repository/RecordRepository');
const TokenChecker = require('./TokenChecker');

class ProfileProvider {
  static async getUserProfile(token) {
    try {
      const deToken = TokenChecker.isTokenValid(token);

      if (deToken == null) {
        console.log('Invalid token');
        return null;
      }

      const profile = await ProfileRepository.getProfileByEmail(deToken.email);

      if (profile == null) {
        console.log('Profile not found');
        return null;
      }

      const selectedFields = {
        gender: profile.gender,
        birthday: profile.birthday,
        education: profile.education,
        financialStatus: profile.financialStatus,
        sufficiency: profile.sufficiency,
        caregiver: profile.caregiver,
        lineId: profile.lineId,
        diagnosis: profile.diagnosis,
        height: profile.height,
        selectedComorbidities: profile.selectedComorbidities,
        selectedDrugs: profile.selectedDrugs,
      };

      return selectedFields;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async updateUserProfile(token, newProfileData) {
    try {
      const deToken = TokenChecker.isTokenValid(token);

      if (deToken == null) {
        console.log('Invalid token');
        return null;
      }

      const updatedProfile = await ProfileRepository.updateProfile(
        deToken.email,
        newProfileData
      );

      if (updatedProfile == null) {
        console.log('Profile not found');
        return null;
      }

      return updatedProfile;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static async adminGetProfiles(token) {
    try {

      const detoken = TokenChecker.isTokenValid(token)

      if (detoken.id == null || detoken.is_admin == false) {
        return null
      }

      const profiles = await RecordRepository.getAllPatientCollection()

      const selectedProfiles = profiles.map(profile => ({
        id: profile.id,
        gender: profile.gender,
        birthday: profile.birthday,
        education: profile.education,
        financialStatus: profile.financialStatus,
        sufficiency: profile.sufficiency,
        caregiver: profile.caregiver,
        lineId: profile.lineId,
        diagnosis: profile.diagnosis,
        height: profile.height,
        selectedComorbidities: profile.selectedComorbidities || [],
        selectedDrugs: profile.selectedDrugs || [],
      }));

      return selectedProfiles;

    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = ProfileProvider;
