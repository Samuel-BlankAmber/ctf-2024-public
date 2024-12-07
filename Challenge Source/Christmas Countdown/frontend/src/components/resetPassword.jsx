import { useState, useEffect } from 'preact/hooks';
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import '../app.css'
import './resetPassword.css'

export function ResetPassword({ setPath, info }) {
  const [passwordResetQuestion, setPasswordResetQuestion] = useState(null);
  
  useEffect(async () => {
    try {
      const res = await fetch(`/api/reset-password-question?username=${info.passwordResetUsername}`);
      const data = await res.json();
      if (res.ok) {
        setPasswordResetQuestion(data);
      } else {
        alert(`Failed to get password reset question: ${data}`);
      }
    } catch (error) {
      console.error(error);
      alert(`Error: ${error}`);
    }
  }, []);

  async function resetPassword(username, token, password) {
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username, password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Password reset');
        setPath('login');
      } else {
        alert(`Failed to reset password: ${data}`);
      }
    } catch (error) {
      console.error(error);
      alert(`Error: ${error}`);
    }
  }

  async function submit(event) {
    event.preventDefault();
    const form = event.target;
    const resetPasswordAnswer = form.passwordResetAnswer.value;
    if (!resetPasswordAnswer) {
      alert('Password reset answer is required');
      return;
    }
    try {
      const res = await fetch('/api/reset-password-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: info.passwordResetUsername,
          resetPasswordAnswer,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const token = data.token;
        const newPassword = prompt('Enter new password');
        if (!newPassword) {
          return;
        }
        resetPassword(info.passwordResetUsername, token, newPassword);
      } else {
        if (data === 'Invalid forgot password answer') {
          alert('Incorrect answer');
          return;
        }
        alert(`Failed to reset password: ${data}`);
      }
    } catch (error) {
      console.error(error);
      alert(`Error: ${error}`);
    }
  }

  return (
    <>
      <h1>Reset Password</h1>
      <h2 className="username">Username: {info.passwordResetUsername}</h2>
      <h2 className="passwordResetQuestion">{passwordResetQuestion}</h2>
      <form onSubmit={submit}>
        <label htmlFor="passwordResetAnswer">Answer:</label>
        <input type="text" name="passwordResetAnswer" id="passwordResetAnswer" required />
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  )
}
