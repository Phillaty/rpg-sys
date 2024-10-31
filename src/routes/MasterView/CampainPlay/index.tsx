import React from 'react';
import { Container } from './styles';

const CampainPlay = () => {

    return (
        <Container>
            <div>
                <div className='menu'>
                    <div className='title'>Menu de controle</div>
                    <div className='buttons'>
                        <button>Batalha</button>
                        <button>Lojas</button>
                        <button>Itens</button>
                        <button>Personagens</button>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default CampainPlay;