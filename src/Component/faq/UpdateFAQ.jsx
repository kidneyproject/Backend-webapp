import React, { useState, useEffect } from 'react';
import './UpdateFaq.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../authentication/AuthContext';


const UpdateFaq = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const [faqs, setFaqs] = useState([
    { id: 1, question: 'โรคไตเรื้อรังรักษาหายไหม', answer: 'โรคไตเรื้อรังไม่สามารถรักษาให้หายขาดได้ เนื่องจากเนื้อเยื่อไตเสียหายเป็นเวลานานจนเกิดพังผืดในไต คล้ายแผลเป็นจำนวนมาก การรักษาจึงทำได้แค่เพียงชะลอการเสื่อมของไตให้เข้าสู่ระยะที่ต้องฟอกไตให้ช้าที่สุด' },
    { id: 2, question: 'อาการของโรคไตเรื้อรัง', answer: 'ในช่วงแรกแทบไม่มีสัญญาณเตือน โดยอาการมักจะปรากฏในช่วงระยะท้ายๆ เนื่องจากไตได้รับความเสียหายไปมากแล้ว ทั้งนี้ผู้ป่วยโรคไตมักจะมีอาการต่างๆ \n 1. ปัสสาวะบ่อยกลางคืน \n 2. ปัสสาวะขัด, ขาบวมและกดบุ๋ม \n 3. ความดันโลหิตสูง \n 4. คลื่นไส้อาเจียน เบื่ออาหาร \n 5. คันตามร่างาย อ่อนเพลีย \n 6. ปวดหลัง ปวดบั้นเอว' },
    { id: 3, question: 'โรคไตเรื้อรังเกิดจากอะไร', answer: 'โรคไตเรื้อรังเกิดขึ้นได้จากหลายสาเหตุ แต่สาเหตุที่พบบ่อยได้ที่สุด ได้แก่ โรคความดันโลหิตสูง โรคเบาหวาน การใข้ยาแก้ปวดที่ไม่ใช่สเตียรอยด์ (NSAIDs)  ภาวะกรดยูริกในเลือดสูง นอกจากนี้โรคไตเรื้อรังสาสามารถเกิดได้จากการใช้สารที่มีผลต่อไต ได้แก่ โลหะหนัก เช่น ตะกั่ว สารหนู ปรอท เป็นต้น' },
    { id: 4, question: 'วิธีรักษาโรคไตเรื้อรัง', answer: '1. รักษาด้วยการชะลอความเสื่อมของไต ได้แก่ \n - ควบคุมโรคประจำตัวให้ดี เช่น ความคุมโรคเบาหวานและความดันโลหิตสูงให้ดี ยาลดความดันบางกลุ่มหรือยาเบาหวานบางกลุ่มสามารถช่วยชะลอความเสื่อมของไตได้ ควบคุมระดับไขมันในเลือด \n - ควบคุมอาหาร ลดการรับประทานอาหารหวาน มัน เค็ม รับประทานโปรตีนที่เหมาะสม ได้รับพลังงานที่เพียงพอ ควบคุมระดับโพแทสเซียมและฟอสฟอรัสในอาหารไม่ให้มากจนเกินไป \n - รับประทานยาตามแผนการรักษา \n - การปรับเปลี่ยนพฤติกรรมสุขภาพ เช่น ลดน้ำหนัก งดสูบบุหรี่และหลีกเลี่ยงควันบุหรี่ ออกกำลังกาย หลักเลี่ยงยาหรือสารที่เป็นพิษต่อ \n 2. การรักษาด้วยการบำบัดทดแทนไต การบำบัดทดแทนไตเป็นการรักษาผู้ป่วยไตเรื้อรังระยะสุดท้ายหรือระยะที่ 5 ได้แก่ การปลูกถ่ายไต การล้างไตทางช่องท้อง การฟอกเลือดด้วยเครื่องไตเทียม และการรักษาชนิดประคับประคอง โดยผู้ป่วยแต่ละรายจะมีทางเลือกวิธีที่เหมาะสมและปลอดภัยกับตนเอง' },
    { id: 5, question: 'ค่าอัตราการกรองของไต', answer: 'โรคไตเรื้อรังแบ่งระยะตามระดับอัตราการกรองของไตหรือ eGFR (estimated glomerular filtration rate) ออกเป็น 5 ระยะ ดังนี้ \n ระยะที่ 1 หรือค่า eGFR มากกว่า 90% เป็นระยะที่อยู่ในระดับที่มีความเสี่ยงต่ำ \n ระยะที่ 2 หรือค่า eGFR อยู่ในช่วงระยะ 60 \n - 89% เป็นระยะที่จะเริ่มประเมินและชะลอการเสื่อมของโรคไตเรื้อรัง \n ระยะที่ 3 หรือค่า eGFR อยู่ในช่วงระยะ 30 \n - 60% เป็นระยะที่แพทย์จะเพิ่มการดูแลภาวะแทรกซ้อนของไต และต้องระวังในเรื่องของโรคหัวใจที่จะเป็นภาวะแทรกซ้อน \n ระยะที่ 4 หรือค่า eGFR น้อยกว่า 30% เป็นระยะที่ผู้ป่วยและแพทย์จะต้องเริ่มปรึกษากันเรื่องการทำบำบัดทดแทนไต เพราะการฟอกไตไม่ว่าจะฟอกเลือดด้วยเครื่องฟอกไตเทียม การฟอกไตทางหน้าท้อง หรือการปลูกถ่ายไต \n ระยะที่ 5 เมื่อ eGFR น้อยกว่า 15% แพทย์จะเริ่มการบำบัดทดแทนไต ตามที่ได้ปรึกษากันแล้วก่อนหน้านี้ โดยเริ่มการบำบัดทดแทนไตในเวลาที่เหมาะสม' },
  ]);

  const [editableFaqId, setEditableFaqId] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [isAddingNewFaq, setIsAddingNewFaq] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [isDeleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);


  const handleQuestionChange = (id, newQuestion) => {
    const updatedFaqs = faqs.map(faq =>
      faq.id === id ? { ...faq, question: newQuestion } : faq
    );
    setFaqs(updatedFaqs);
  };

  const handleAnswerChange = (id, newAnswer) => {
    const updatedFaqs = faqs.map(faq =>
      faq.id === id ? { ...faq, answer: newAnswer } : faq
    );
    setFaqs(updatedFaqs);
  };

  const handleEditClick = (id) => {
    setEditableFaqId(id);
  };

  const handleSaveClick = () => {
    setEditableFaqId(null);
  };

  const calculateTextareaRows = content => {
    const lineBreaks = (content.match(/\n/g) || []).length;
    return Math.min(10, lineBreaks + 3); // Increase the default height
  };

  const toggleNewFaqModal = () => {
    if (isAddingNewFaq) {
      setIsAddingNewFaq(false);
      setNewFaq({ question: '', answer: '' });
    } else {
      setIsAddingNewFaq(true);
    }
  };

  const handleNewFaqChange = (e) => {
    const { name, value } = e.target;
    setNewFaq({ ...newFaq, [name]: value });
  };

  const handleSaveNewFaq = () => {
    // Ensure both question and answer are filled out before saving
    if (newFaq.question && newFaq.answer) {
      const updatedFaqs = [...faqs, { ...newFaq, id: Date.now() }];
      setFaqs(updatedFaqs);
      toggleNewFaqModal();
    }
  };

  const handleDeleteClick = (id) => {
    // Show the confirmation dialog and freeze the screen
    setDeleteConfirmation(id);
    setDeleteConfirmationVisible(true);
    document.body.style.overflow = 'hidden'; // Disable scrolling
    document.body.style.paddingRight = '17px'; // Create space for the scrollbar
  };

  const confirmDelete = (id) => {
    // Implement the logic to delete the FAQ with the given id
    const updatedFaqs = faqs.filter(faq => faq.id !== deleteConfirmation);
    setFaqs(updatedFaqs);

    // Close the confirmation dialog and unfreeze the screen
    setDeleteConfirmation(null);
    setDeleteConfirmationVisible(false);
    document.body.style.overflow = 'auto'; // Enable scrolling
    document.body.style.paddingRight = '0'; // Reset padding
  };

  const cancelDelete = () => {
    // Close the confirmation dialog and unfreeze the screen
    setDeleteConfirmation(null);
    setDeleteConfirmationVisible(false);
    document.body.style.overflow = 'auto'; // Enable scrolling
    document.body.style.paddingRight = '0'; // Reset padding
  };

  return (
    <div className="update-faq-container">
      <h2 className="update-faq-title">Update FAQ Page</h2>

      <button className="faq-action-btn add-btn" onClick={toggleNewFaqModal}>
        {isAddingNewFaq ? 'Close' : 'Add'}
      </button>

      {isAddingNewFaq && (
        <div className="faq-modal">
          <div className="faq-item">
            <label className="faq-question-label">Question</label>
            <input
              className="faq-question"
              type="text"
              name="question"
              value={newFaq.question}
              onChange={handleNewFaqChange}
            />
            <label className="faq-answer-label">Answer</label>
            <textarea
              className="faq-answer"
              name="answer"
              value={newFaq.answer}
              onChange={handleNewFaqChange}
            />
            <button className="faq-action-btn save-btn" onClick={handleSaveNewFaq}>
              Save
            </button>
          </div>
        </div>
      )}

      {faqs.map(faq => (
        <div className="faq-item" key={faq.id}>
          {editableFaqId === faq.id ? (
            <>
              <label className="faq-question-label">Question</label>
              <input
                className="faq-question"
                type="text"
                value={faq.question}
                onChange={e => handleQuestionChange(faq.id, e.target.value)}
              />
              <label className="faq-answer-label">Answer</label>
              <textarea
                className="faq-answer"
                rows={calculateTextareaRows(faq.answer)}
                value={faq.answer}
                onChange={e => handleAnswerChange(faq.id, e.target.value)}
              />
              <button className="faq-action-btn save-btn" onClick={handleSaveClick}>
                Save
              </button>
            </>
          ) : (
            <>
              <div className="faq-question-label">Question</div>
              <div className="faq-question">{faq.question}</div>
              <div className="faq-answer-label">Answer</div>
              <div className="faq-answer">{faq.answer}</div>
              <div className="faq-action-btn-group">
                <button className="faq-action-btn edit-btn" onClick={() => handleEditClick(faq.id)}>
                  Edit
                </button>
                <button className="faq-action-btn delete-btn" onClick={() => handleDeleteClick(faq.id)}>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
      {isDeleteConfirmationVisible && (
        <>
          <div className="overlay"></div>
          <div className="delete-confirmation">
            <p>Are you sure you want to delete this FAQ?</p>
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

export default UpdateFaq;