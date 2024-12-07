import { useState, useEffect } from 'preact/hooks'
import Cookies from 'js-cookie'
import '../app.css'
import './login.css'

const PAGE_SIZE = 5;

async function fetchUsers() {
  try {
    const res = await fetch(`/api/users`)
    return await res.json()
  } catch (error) {
    console.error(error);
    alert(`Error: ${error}`);
    return []
  }
}

export function Login({ setPath, setInfo }) {
  const [users, setUsers] = useState([])
  const [displayedUsers, setDisplayedUsers] = useState([])
  const [page, setPage] = useState(1)

  useEffect(async () => {
    setUsers(await fetchUsers());
  }, []);

  useEffect(async () => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    setDisplayedUsers(users.slice(start, end));
  }, [users, page]);

  function canGoBack() {
    return page > 1;
  }

  function canGoForward() {
    return users.length > page * PAGE_SIZE;
  }

  async function login(username) {
    const password = prompt('What is your password?');
    if (!password) {
      return;
    }
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok) {
      const token = data.token;
      Cookies.set('christmasCountdownToken', token);
      setPath('home');
    } else {
      alert(`Login failed: ${data}`);
    }
  }

  function handleResetPassword(username) {
    setInfo({ passwordResetUsername: username });
    setPath('resetPassword');
  }

  return (
    <>
      <h1>Login</h1>
      <ul>
        {displayedUsers.map(user => (
          <li key={user}>
            <button onClick={() => login(user)} className="userButton">{user}</button>
            <button onClick={() => handleResetPassword(user)}>Reset password</button>
          </li>
        ))}
      </ul>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={!canGoBack()}>Previous</button>
        <button onClick={() => setPage(page + 1)} disabled={!canGoForward()}>Next</button>
      </div>
    </>
  )
}
