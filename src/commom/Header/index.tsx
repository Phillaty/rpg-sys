import React from 'react';
import { Container } from './styles';

import logo from '../../imgs/logo.png';
import { useNavigate } from 'react-router-dom';
import { userDataType } from '../../types';

const Header = () => {

    const navigate = useNavigate();

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') ?? ' ') as userDataType : {} as userDataType;

    const logout = () => {

        localStorage.clear();

        navigate('/login');
    }
    
    return (
        <Container>
            <div>
                <div className='logo'>
                    <img src={logo} alt='' />
                    <p>Bem-vindo(a) <b>{user.name}</b></p>
                </div>
                <div className='menu'>
                    <p onClick={() => {navigate('/home');}}>
                        <span className='pc'>Página principal</span>
                        <span className='mobile'>Home</span>
                    </p>
                    <p>Ajuda</p>
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