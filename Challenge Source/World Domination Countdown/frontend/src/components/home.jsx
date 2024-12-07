import { useState, useEffect } from 'preact/hooks'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import '../app.css'

async function getCountdown(token) {
  try {
    const res = await fetch(`/api/countdown`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (error) {
    console.error(error);
    alert(`Error: ${error}`);
    return null;
  }
}

export function Home({ setPath }) {
  const [year, setYear] = useState();
  const [month, setMonth] = useState();
  const [day, setDay] = useState();
  const [countdownTitle, setCountdownTitle] = useState('');
  const [countdownDescription, setCountdownDescription] = useState('');

  const [timeLeft, setTimeLeft] = useState({});
  const [username, setUsername] = useState();

  useEffect(() => {
    const token = Cookies.get('worldDominationCountdownToken');
    if (token) {
      updateCountdown(token);
      setUsername(jwtDecode(token).username);
    } else {
      updateCountdown();
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  });

  useEffect(() => {
    if (!year || !month || !day) {
      return;
    }
    setTimeLeft(calculateTimeLeft());
  }, [year, month, day]);

  async function updateCountdown(token=null) {
    let countdown;
    if (token) {
      countdown = await getCountdown(token);
    } else {
      const now = new Date();
      countdown = {
        year: now.getFullYear(),
        month: 12,
        day: 25,
        title: 'World Domination',
        description: 'World Domination is a on the way',
      };
      const date = new Date(countdown.year, countdown.month, countdown.day);
      if (now > date) {
        countdown.year++;
      }
    }
    setYear(countdown.year);
    setMonth(countdown.month - 1);
    setDay(countdown.day);
    setCountdownTitle(countdown.title);
    setCountdownDescription(countdown.description);
  }

  function calculateTimeLeft() {
    const now = new Date();
    const target = new Date(year, month, day);
    const difference = target - now;
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  async function handleRegister() {
    setPath('register');
  }

  async function handleLogin() {
    setPath('login');
  }

  async function handleLogout() {
    Cookies.remove('worldDominationCountdownToken');
    setUsername(null);
    updateCountdown();
  }

  return (
    <>
      <h1>{countdownTitle} Countdown</h1>
      <p>{countdownDescription}</p>
      <div className="countdown">
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </div>
      <div className="auth-buttons">
        <button onClick={handleRegister}>Register</button>
        {username ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </div>
      {username && <p>You are logged in as {username}</p>}
    </>
  );
}
