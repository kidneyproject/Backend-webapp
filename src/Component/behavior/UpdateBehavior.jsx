import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';
import './Behavior.css'; // Import the CSS file

const UpdateBehavior = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('A-token');
  const apiUrl = 'http://localhost:3000/api/v1/admin/behaviorForm';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const [behaviorData, setBehaviorData] = useState([]);

  const fetchBehaviorData = async () => {
    try {

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBehaviorData(data);
      } else {
        console.error('Error fetching behavior data:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching behavior data:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchBehaviorData();
  }, []);


  const [editableBehaviorId, setEditableBehaviorId] = useState(null);
  const [newBehavior, setNewBehavior] = useState("");
  const [isAddingNewBehavior, setIsAddingNewBehavior] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);

  const handleQuestionChange = (id, newQuestion) => {
    const updatedBehaviorData = behaviorData.map((item) =>
      item.id === id ? { ...item, question: newQuestion } : item
    );
    setBehaviorData(updatedBehaviorData);
  };

  const handleEditClick = (id) => {
    setEditableBehaviorId(id);
  };

  const handleSaveClick = async () => {
    try {
      const behaviorToSave = behaviorData.find((item) => item.id === editableBehaviorId);

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(behaviorToSave),
      });

      if (response.ok) {

        setEditableBehaviorId(null);
      } else {
        console.error('Error saving data:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };


  const toggleNewBehaviorModal = () => {
    if (isAddingNewBehavior) {
      setIsAddingNewBehavior(false);
      setNewBehavior('');
    } else {
      setIsAddingNewBehavior(true);
    }
  };

  const handleNewBehaviorChange = (e) => {
    setNewBehavior(e.target.value);
  };

  const handleSaveNewBehavior = async () => {

    try {
      if (newBehavior !== '') {
        const newEntry = {
          question: newBehavior,
          created_time: new Date().toISOString(),
        };

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEntry),
        });
        console.log(response.ok)

        if (response.ok) {
          fetchBehaviorData();
          toggleNewBehaviorModal();
        } else {
          console.error('Error saving data:', response.statusText);
        }

      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirmation(id);
    setDeleteConfirmationVisible(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: deleteConfirmation,
        }),
      });

      if (response.ok) {

        const updatedBehaviorData = behaviorData.filter(item => item.id !== deleteConfirmation);
        setBehaviorData(updatedBehaviorData);
      } else {
        console.error('Error saving data:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }

    setDeleteConfirmation(null);
    setDeleteConfirmationVisible(false);
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
    setDeleteConfirmationVisible(false);
  };

  return (
    <div className="update-behavior-container">
      <h2 className="update-behavior-title">Update Question Page</h2>

      <button className="btn btn-success add-btn" onClick={toggleNewBehaviorModal}>
        {isAddingNewBehavior ? 'Close' : 'Add'}
      </button>

      {isAddingNewBehavior && (
        <div className="behavior-modal">
          <div className="behavior-item">
            <label className="behavior-question-label">Question</label>
            <input
              className="behavior-question-input"
              type="text"
              name="question"
              value={newBehavior}
              onChange={handleNewBehaviorChange}
            />
            <button className="behavior-action-btn save-btn" onClick={handleSaveNewBehavior}>
              Save
            </button>
          </div>
        </div>
      )}

      {behaviorData.map((item) => (
        <div className={`behavior ${editableBehaviorId === item.id ? 'open' : ''}`} key={item.id}>
          <div className={`behavior-question ${editableBehaviorId === item.id ? 'open' : ''}`}>
            {editableBehaviorId === item.id ? (
              <>
                <label className="behavior-question-label">Question : {item.id}</label>
                <input
                  className="behavior-question-input"
                  type="text"
                  value={item.question}
                  onChange={(e) => handleQuestionChange(item.id, e.target.value)}
                />
                <button className="behavior-action-btn save-btn" onClick={handleSaveClick}>
                  Save
                </button>
              </>
            ) : (
              <>
                <label className="behavior-question-label">Question : {item.id}</label>
                <div className="behavior-question">{item.question}</div>
                <div className="behavior-action-btn-group">
                  <button className="btn btn-warning behavior-action-btn edit-btn" onClick={() => handleEditClick(item.id)}>
                    Edit
                  </button>
                  <button className="behavior-action-btn delete-btn" onClick={() => handleDeleteClick(item.id)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
      {isDeleteConfirmationVisible && (
        <>
          <div className="overlay"></div>
          <div className="delete-confirmation">
            <p>Are you sure you want to delete this Question (id: {deleteConfirmation}) ?</p>
            <button className="confirm-delete-btn" onClick={confirmDelete}>
              Confirm Delete
            </button>
            <button className="cancel-delete-btn" onClick={cancelDelete}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UpdateBehavior;