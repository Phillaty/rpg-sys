import React, { useState } from 'react';
import { Container } from './styles';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import snip from '../../imgs/ssss.png';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { decrypt } from '../../crypt';
import { useNavigate } from 'react-router-dom';

type formDataLogin = {
    login: string,
    password: string,
};

type userType = {
    login: string,
    password: string,
    name: string,
    rule: string,
    id: string,
};

const Login = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState<formDataLogin>({
        login: '',
        password: '',
    });

    const login = async () => {
        if(formData.login){
            const docRef = collection(db, 'user');

            const q = query(docRef, where('login', '==', formData.login));

            const docSnap = await getDocs(q);

            const data = docSnap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            if(data.length === 0) {
                toast.error("Nenhum login encontrado!");
                return;
            }

            const dataLogin = data[0] as userType;

            if(formData.password !== decrypt(dataLogin.password)){
                toast.error("Senha incorreta!");
                return;
            }

            localStorage.setItem('user', JSON.stringify({
                name: dataLogin.name,
                rule: dataLogin.rule,
            }));
            
            toast.success("Logado!");

            setTimeout(() => {
                navigate('/rpg-sys/home');
            }, 1000);
        }
    }

    return (
        <>
        <Container>
            <div>
                <h1>LOGIN</h1>
                <p className='description'>Bem-vindo ao RPG sys!<br/> Plataforma de gerenciamente de RPG de mesa 🥰</p>
                <div className='input'>
                    <p>Login de acesso</p>
                    <input placeholder='Login...' onChange={(e) => setFormData({...formData, login: e.target.value})} />
                </div>
                <div className='input'>
                    <p>Senha</p>
                    <input placeholder='Senha...' type='password' onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
                <button className='button' onClick={() => login()}>Entrar</button>
                <div className='info'>Seus dados sensiveis são criptografados 😎</div>
            </div>

            <span className='bkgroundSnip1'><img src={snip} alt='' /></span>
            <span className='bkgroundSnip2'><img src={snip} alt='' /></span>
        </Container>
        <ToastContainer />
        </>
    )
}

export default Login;