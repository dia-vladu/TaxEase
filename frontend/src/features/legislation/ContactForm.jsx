import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './ContactForm.scss';
import axios from 'axios';

function ContactForm() {
  const form = useRef();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [userData, setUserData] = useState({
    nume: null,
    prenume: null,
    email: null,
  });
  axios.defaults.withCredentials = true;

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_aien3ba', 'template_1euk1l8', form.current, 'LbdFy_GNMx-bzN7zv')
      .then((result) => {
        console.log(result.text);
      }, (error) => {
        console.log(error.text);
      });
    setIsSubmitted(true);
    e.target.reset();
    setUserData({
      nume: userData.nume,
      prenume: userData.prenume,
      email: userData.email,
    });
    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  const [setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/login');
        const { loggedIn, user } = response.data;
        //console.log('user:', user, 'userId:', user.userId);
        if (loggedIn) {
          setLoggedIn(true);
        }
        if (user) {
          const utilizator = await axios.get(`http://localhost:8080/api/get-utilizator/${user.userId}`);
          if (utilizator) {
            setUserData((prevUserData) => ({
              ...prevUserData,
              nume: utilizator.data.nume,
              prenume: utilizator.data.prenume,
              email: utilizator.data.email,
            }));
            console.log('UserData:', userData, 'utilizator:', utilizator.data);
          }
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      }
    };

    checkLoginStatus();
    console.log('UserData2:', userData)
  }, [isSubmitted]);

  useEffect(() => {
    console.log('UserData3:', userData);
  }, [userData]);

  return (
    <div>
      {isSubmitted && (
        <div className="notification">
          <p>Message successfully sent!</p>
        </div>
      )}

      <form ref={form} className="contact-form" onSubmit={sendEmail}>
        <label>Full Name:</label>
        <input type="text" name="user_name"
          value={userData.nume !== null ? `${userData.nume} ${userData.prenume}` : ''}
          onChange={(e) => {
            const [nume, prenume] = e.target.value.split(' ');
            setUserData((prevUserData) => ({
              ...prevUserData,
              nume,
              prenume,
            }));
          }} required />
        <label>Email Address:</label>
        <input type="email" name="user_email"
          value={userData.email !== null ? userData.email : ''}
          onChange={(e) => {
            setUserData((prevUserData) => ({
              ...prevUserData,
              email: e.target.value,
            }));
          }} required />
        <label>Subject:</label>
        <input type="text" name="email_subject" />
        <label>Content:</label>
        <textarea name="message" required />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
}

export default ContactForm;
