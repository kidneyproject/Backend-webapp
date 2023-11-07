const ProfileProvider = require('../Components/ProfileProvider');

class ProfileController {
  static async getUserProfile(req, res) {
    try {
      const userProfile = await ProfileProvider.getUserProfile(req.headers.authorization);

      if (userProfile == null) {
        // Handle the case when the profile is not found or the token is invalid
        return res.status(404).json({ error: 'Profile not found or invalid token' });
      }

      // Return the user profile as JSON
      return res.json(userProfile);
    } catch (error) {
      console.error(error);
      // Handle other errors here
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async updateUserProfile(req, res) {
    try {
      const updatedProfile = await ProfileProvider.updateUserProfile(req.headers.authorization, req.body);

      if (updatedProfile == null) {
        // Handle the case when the profile is not found or the token is invalid
        return res.status(404).json({ error: 'Profile not found or invalid token' });
      }

      // Return the updated user profile as JSON
      return res.json(updatedProfile);
    } catch (error) {
      console.error(error);
      // Handle other errors here
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async adminGetProfiles(req,res){
    const result = await ProfileProvider.adminGetProfiles(req.headers.authorization)
    return res.json(result)
}
}

module.exports = ProfileController;
