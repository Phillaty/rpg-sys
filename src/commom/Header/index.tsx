import React from 'react';
import { Container } from './styles';

import logo from '../../imgs/logo.png';
import { userDataType } from '../../routes/Home';

const Header = () => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') ?? ' ') as userDataType : {} as userDataType;
    
    return (
        <Container>
            <div>
                <div className='logo'>
                    <img src={logo} alt='' />
                    <p>Bem-vindo(a) <b>{user.name}</b></p>
                </div>
                <div className='menu'>
                    <p>Página principal</p>
                    <p>Ajuda</p>
                    <p>Minha conta</p>
                    <p className='exit'>Sair</p>
                </div>
            </div>
        </Container>
    )
}

export default Header;