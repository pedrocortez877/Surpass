import React, { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import '../css/styles/pages/login.css';
import api from "../services/api";

export default function Login() {
  const history = useHistory();
  const[warningForm, setWarningForm] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');


  async function login(event: FormEvent) {
    event.preventDefault();

    const data = {
      email: email,
      password: password
    }

    await api.post('login', data).then(() => {
      history.push('/app');
    }).catch(() => {
      setWarningForm("Usuário e/ou senha não encontrados");
    });

    
  }
  return (
    <div id="page-login">

      <main>
        <form className="login-form" onSubmit={login}>
          <fieldset>
            <legend>Entrar</legend>

            <div className="input-block">
              <label htmlFor="email">Email</label>
              <input id="email" value={email} onChange={event => setEmail(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="password">Senha</label>
              <input id="password" type="password" value={password} onChange={event => setPassword(event.target.value)}/>
            </div>

            <div className="warning">
              {warningForm}
            </div>

          </fieldset>

          <button className="confirm-button" type="submit">
            Entrar
          </button>

          <p>Ainda não tem uma conta? <Link id="link" to="/register"><strong>Cadastre-se</strong></Link></p>
        </form>
      </main>
    </div>
  );
}

