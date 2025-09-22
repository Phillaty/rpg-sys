import React, { useEffect, useState } from 'react';
import { Container } from './styles';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import snip from '../../imgs/ssss.png';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase';
import { decrypt, encrypt } from '../../crypt';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLoginManager } from '../../hooks/useLoginManager';

import { signInAnonymously } from "firebase/auth";

import logo from '../../imgs/logo.png';
import { CircularProgress } from '@mui/material';

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
    const { isAuthenticated, isLoading, userData } = useAuth();
    const { handleSuccessfulLogin } = useLoginManager();

    const [isLoadingLogin, setIsLoadingLogin] = useState(false);

    // Debug log for Login component
    console.log('🔑 Login Component State:', { 
        isAuthenticated, 
        isLoading, 
        hasUserData: !!userData 
    });

    const [formData, setFormData] = useState<formDataLogin>({
        login: '',
        password: '',
    });

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/home');
        }
    }, [isAuthenticated, isLoading, navigate]);

    const login = async () => {
        setIsLoadingLogin(true);
        if (formData.login) {
            try {
                // Primeiro, autenticar anonimamente no Firebase
                await signInAnonymously(auth);
                
                // Após autenticação, consultar o Firestore
                const docRef = collection(db, 'user');
                const q = query(docRef, where('login', '==', formData.login));
                const docSnap = await getDocs(q);

                const data = docSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                if (data.length === 0) {
                    toast.error("Nenhum login encontrado!");
                    return;
                }

                const dataLogin = data[0] as userType;

                if (formData.password !== decrypt(dataLogin.password)) {
                    toast.error("Senha incorreta!");
                    setIsLoadingLogin(false);
                    return;
                }

                localStorage.setItem('user', encrypt(JSON.stringify({
                    name: dataLogin.name,
                    rule: dataLogin.rule,
                    id: dataLogin.id,
                })));
                
                toast.success("Logado!");

                setTimeout(async () => {
                    // Força refresh do contexto após pequeno delay
                    await handleSuccessfulLogin();
                }, 1000);
                
                
            } catch (error) {
                console.error('Erro no login:', error);
                toast.error("Erro ao fazer login. Tente novamente.");
                setIsLoadingLogin(false);
            }
        }

        
    }

    return (
        <>
        <Container>
            <div>
                <img alt='' src={logo} className='logo' />
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
                <button className='button' onClick={() => login()}>{isLoadingLogin ? <CircularProgress size={16} color="inherit" /> : 'Entrar'}</button>
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

