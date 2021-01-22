import React, { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import '../css/styles/pages/register.css';
import api from "../services/api";

export default function Register() {
  const history = useHistory();

  const[name, setName] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[confirmPassword, setConfirmPassword] = useState('');

  async function  handleSubmit(event: FormEvent){
    event.preventDefault();

    const data = {
      name: name,
      email: email,
      password: password
    }

    await api.post('users', data).then(() => {
      alert('cadastro realizado!!!');

      history.push('/app');
    }).catch(() => {
      alert("Email ja cadastrado");
      history.push('/register');
    });
  }

  return (
    <div id="page-register">

      <main>
        <form onSubmit={handleSubmit} className="register-form">
          <fieldset>

            <legend>Cadastro de usuário</legend>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input type="text" id="name" value={name} onChange={event => setName(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" value={email} onChange={event => setEmail(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" value={password} onChange={event => setPassword(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="confirmPassword">Confirme sua senha</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)}/>
            </div>

          </fieldset>

          <button className="confirm-button" type="submit">
            Enviar
          </button>

          <p>Ja tem uma conta? <Link id="link" to="/login"><strong>Entrar</strong></Link></p>
        </form>
      </main>
    </div>
  );
}