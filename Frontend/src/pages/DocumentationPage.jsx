import React from 'react';
import '../doc.css'; // Import custom CSS for styling
import emailIcon from '../assetss/email.png';
import phoneIcon from '../assetss/phone.png';
import Navbar from '../components/navbar';

const DocumentationPage = () => {
  return (
    <div className="documentation-container">
      <Navbar />
      <header className="header">
        <h1>Recipe Genie Documentation</h1>
      </header>
      <main className="main-content">
        <section className="faq-section">
          <h2 className="main-section-title">Frequently Asked Questions (FAQs)</h2>
          <div className="faq-item">
            <h3 className="faq-question">How do I create an account?</h3>
            <p className="faq-answer">To create an account, navigate to the Sign Up page and fill in the required fields (Name, Username, Email, Password, Confirm Password). Click the 'Sign Up' button to complete the process.</p>
          </div>
          {/* <div className="faq-item">
            <h3 className="faq-question">How do I reset my password?</h3>
            <p className="faq-answer">If you forget your password, click on the 'Forgot Password?' link on the Login page. Follow the instructions to reset your password.</p>
          </div> */}
          <div className="faq-item">
            <h3 className="faq-question">How do I post a recipe?</h3>
            <p className="faq-answer">Click on the 'Post Recipe' button on the main navigation bar. Fill in the recipe details, including title, ingredients, instructions, and upload an image. Click 'Submit' to post your recipe.</p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">How do I follow a recipe creator?</h3>
            <p className="faq-answer">Navigate to a recipe creator's profile and click the 'Follow' button. Their posted recipes will be added to your home page under the tag of following.</p>
          </div>
          <div className="faq-item">
            <h3 className="faq-question">How do I use the AI chatbot?</h3>
            <p className="faq-answer">Go to the AI Chatbot page and type your cooking-related question or request in the chatbox. The AI will provide a response or recommendation.</p>
          </div>
        </section>
        <section className="help-section">
          <h2 className="section-title">Need More Help?</h2>
          <p className="help-info">
            You can also download our complete user manual here:&nbsp;
            <a href="/Recipe_Genie_User_Manual.docx" download>
              Recipe Genie User Manual (Word)
            </a>
          </p>
          <p className="help-info">If you have any further questions or need assistance, please feel free to contact our support team:</p>
          <div className="contact-info">
            <div className="contact-item">
              <img src={emailIcon} alt="Email Icon" className="contact-icon" />
              <p><strong>Email:</strong> <a href="mailto:support@recipegenie.com">support@recipegenie.com</a></p>
            </div>
            <div className="contact-item">
              <img src={phoneIcon} alt="Phone Icon" className="contact-icon" />
              <p><strong>Phone:</strong> <a href="tel:+1234567890">+1 (234) 567-890</a></p>
            </div>
            <div className="contact-item">
              <p><strong>Contact Person:</strong> Jane Doe</p>
            </div>
          </div>
        </section>

      </main>
      <footer className="footer">
        <p>&copy; 2025 Recipe Genie. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DocumentationPage;