import React, { FormEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import '../css/styles/pages/register.css';
import api from "../services/api";

interface Inputs{
  name: String;
  email: String;
  password: String;
  confirmPassword: String;
}

export default function Register() {
  const history = useHistory();

  const[warningForm, setWarningForm] = useState('');
  const[name, setName] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[confirmPassword, setConfirmPassword] = useState('');

  async function  handleSubmitForm(event: FormEvent){
    event.preventDefault();

    const data = {
      name: name,
      email: email,
      password: password
    }

    if(validate()){
      console.log("to aqui");
      await api.post('users', data).then(() => {
        alert('cadastro realizado!!!');

        history.push('/login');
      }).catch(() => {
        setWarningForm("Já possuímos um cadastro com este endereço de e-mail");
      });
    }
  }

  function validate(){
    let isValid = true;
    let usuario = email.substring(0, email.indexOf("@"));
    let dominio = email.substring(email.indexOf("@")+ 1, email.length);

    if ((usuario.length >=1) &&
        (dominio.length >=3) &&
        (usuario.search("@")===-1) &&
        (dominio.search("@")===-1) &&
        (usuario.search(" ")===-1) &&
        (dominio.search(" ")===-1) &&
        (dominio.search(".")!==-1) &&
        (dominio.indexOf(".") >=1)&&
        (dominio.lastIndexOf(".") < dominio.length - 1)) {
    }
    else{
      isValid = false;
      setWarningForm("Informe um email válido");
    }

    if(password !== confirmPassword){
      isValid = false;
      setWarningForm("Senhas diferentes");
    }

    return isValid;
  }

  return (
    <div id="page-register">

      <main>
        <form onSubmit={handleSubmitForm} className="register-form">
          <fieldset>

            <legend>Cadastro de usuário</legend>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input type="text" id="name" value={name} onChange={event => setName(event.target.value)} required/>
            </div>

            <div className="input-block">
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" value={email}  onChange={event => setEmail(event.target.value)} required/>
            </div>

            <div className="input-block">
              <label htmlFor="password">Senha</label>
              <input type="password" id="password" value={password} onChange={event => setPassword(event.target.value)} required/>
            </div>

            <div className="input-block">
              <label htmlFor="confirmPassword">Confirme sua senha</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required/>
            </div>

            <div className="warning">
              {warningForm}
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