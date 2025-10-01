import React from 'react';
import { Container } from './styles';

import logo from '../../imgs/logo.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase';

const Header = () => {

    const navigate = useNavigate();
    const { userData } = useAuth();

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.clear();
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            localStorage.clear();
            navigate('/login');
        }
    }
    
    return (
        <Container>
            <div>
                <div className='logo'>
                    <img src={logo} alt='' />
                    <p>Bem-vindo(a) <b>{userData?.name}</b></p>
                </div>
                <div className='menu'>
                    <p onClick={() => {navigate('/home');}}>
                        <span className='pc'>Página principal</span>
                        <span className='mobile' >Home</span>
                    </p>
                    <p onClick={() => {navigate('/help')}}>Ajuda</p>
                    <p>
                        <span className='pc'>Minha conta</span>
                        <span className='mobile'>Conta</span>
                    </p>
                    <p className='exit' onClick={() => logout()}>Sair</p>
                </div>
            </div>
        </Container>
    )
}

export default Header;