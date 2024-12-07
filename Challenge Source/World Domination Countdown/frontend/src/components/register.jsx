import Cookies from 'js-cookie'
import '../app.css'
import './register.css'

export function Register({ setPath }) {
  async function submit(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;
    const resetPasswordQuestion = form.resetPasswordQuestion.value;
    const resetPasswordAnswer = form.resetPasswordAnswer.value;
    const [year, month, day] = form.date.value.split('-');
    const countdownTitle = form.countdownTitle.value;
    const countdownDescription = form.countdownDescription.value;
    if (!username || !password || !resetPasswordQuestion || !resetPasswordAnswer) {
      alert('Username, password, password reset question, and password reset answer are required');
      return;
    }
    if (!year || !month || !day) {
      alert('Year, month, and day are required');
      return;
    }
    if (!countdownTitle || !countdownDescription) {
      alert('Countdown title and description are required');
      return;
    }
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username, password,
          resetPasswordQuestion, resetPasswordAnswer,
          year, month, day,
          title: countdownTitle, description: countdownDescription,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const token = data.token;
        Cookies.set('worldDominationCountdownToken', token);
        setPath('home');
      } else {
        alert(`Registration failed: ${data}`);
      }
    } catch (err) {
      alert(`Registration failed: ${err}`);
    }
  }

  return (
    <>
      <h1>Register</h1>
      <form onSubmit={submit}>
        <div className="sections">
          <div className="section">
            <div>
              <label htmlFor="username">Username:</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" required minLength="8" />
            </div>
            <div>
              <label htmlFor="resetPasswordQuestion">Password Reset Question:</label>
              <input type="text" id="resetPasswordQuestion" name="resetPasswordQuestion" required />
            </div>
            <div>
              <label htmlFor="resetPasswordAnswer">Password Reset Answer:</label>
              <input type="text" id="resetPasswordAnswer" name="resetPasswordAnswer" required />
            </div>
          </div>
          <div className="section">
            <div>
              <label htmlFor="date">Date:</label>
              <input type="date" id="date" name="date" required />
            </div>
            <div>
              <label htmlFor="countdownTitle">Countdown Title:</label>
              <input type="text" id="countdownTitle" name="countdownTitle" required />
            </div>
            <div>
              <label htmlFor="countdownDescription">Countdown Description:</label>
              <input type="text" id="countdownDescription" name="countdownDescription" required />
            </div>
          </div>
        </div>
        <button className="register" type="submit">Register</button>
      </form>
    </>
  )
}
