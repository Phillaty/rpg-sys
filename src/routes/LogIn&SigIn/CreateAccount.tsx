import React, { useEffect, useState } from 'react';

import {db} from '../../firebase/firebase';

import { collection, addDoc, doc, getDoc, query, getDocs, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Container } from './styles';
import { toast, ToastContainer } from 'react-toastify';

import snip from '../../imgs/ssss.png';
import { encrypt } from '../../crypt';

type formData = {
    login: string,
    password: string,
    confirmpassword: string,
    name: string,
    rule: string,
};

type inviteType = {
    name: string,
    rule: string,
};

 const CreateAccount = () => {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const inviteLocal = localStorage.getItem('invite');

    const navigate = useNavigate();

    const invite = urlParams.get('invite');

    const [formData, setFormData] = useState<formData>({
        name: '',
        login: '',
        password: '',
        confirmpassword: '',
        rule: ''
    });
    const [inviteData, setInviteData] = useState<inviteType>();

    const hasLoggin = async () => {
        const docRef = collection(db, 'user');

        const q = query(docRef, where('login', '==', formData.login));

        const docSnap = await getDocs(q);

        const data = docSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return data.length !== 0
    }

    const fetchData = async () => {
        if(invite){
            const docRef = doc(db, 'invites', invite);

            const docSnap = await getDoc(docRef);

            if(docSnap.exists()){
                const data = docSnap.data();
                setInviteData(data as inviteType);
                setFormData({
                    ...formData,
                    name: data.name,
                    rule: data.rule,
                });
                localStorage.setItem('invite', JSON.stringify(data));
            }
        }
    }

    const create = async () => {
        
        const hasLogin = await hasLoggin();

        if(hasLogin) {
            toast.error("Login ja está em uso!");
            return;
        }

        const encryptedPassword = encrypt(formData.password);
        await addDoc(collection(db, "user"), {
            name: formData.name,
            login: formData.login,
            rule: formData.rule,
            password: encryptedPassword
        }).then(() => {
            localStorage.setItem('user', JSON.stringify({
                name: formData.name,
                rule: formData.rule,
            }));
            navigate('/home');
        });
    }


    useEffect(() => {
        if(!inviteData && !inviteLocal)
        fetchData();

        if(inviteLocal) {
            const data = JSON.parse(inviteLocal) as inviteType;
            setInviteData(data)
            setFormData({
                ...formData,
                name: data.name,
                rule: data.rule,
            });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invite, inviteLocal]) 
    
    return (
        <>
        <Container>
            <div>
                <h1>CADASTRO</h1>
                <p className='description'>Bem-vindo <b>{inviteData?.name ?? ''}</b>! <br/> Você foi convidado a participar da plataforma 😋</p>
                <div className='input'>
                    <p>Login de acesso</p>
                    <input placeholder='Login...' onChange={(e) => setFormData({...formData, login: e.target.value})} />
                </div>
                <div className='input'>
                    <p>Crie uma senha</p>
                    <input placeholder='Senha...' type='password' onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
                <div className='input'>
                    <p>Confirme sua senha</p>
                    <input placeholder='Confirmar senha...' type='password' onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
                <button className='button' onClick={() => {
                    if(formData.name && formData.login && formData.password)
                    create()
                }}>Criar conta</button>
                <div className='info'>Seus dados sensiveis são criptografados 😎</div>
            </div>
            <span className='bkgroundSnip1'><img src={snip} alt='' /></span>
            <span className='bkgroundSnip2'><img src={snip} alt='' /></span>
        </Container>
        <ToastContainer />
        </>
    )
}

export default CreateAccount;