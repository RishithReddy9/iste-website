'use client'
import { emailLogin, oauth, signup } from './action'

export default function LoginPage() {
  
  return (
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={emailLogin}>Log in</button>
      <button formAction={signup}>Sign up</button>
      <button onClick={async ()=>await oauth('github')}>Github</button>
      <button onClick={async ()=>await oauth('google')}>Google</button>
    </form>
  )
}