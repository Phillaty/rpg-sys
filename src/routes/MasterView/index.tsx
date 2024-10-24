import React from 'react';
import { Container } from './styles';
import { campainDataType } from '../../types';

type prop = {
    campains: campainDataType[];
}

const HomeMaster = (props: prop) => {
    return (
        <Container>
            <div>
                <div className='campains'>
                    <h1>Minhas campanhas</h1>
                    <p>Clique na campanha para abrir os detalhes</p>
                    <div className='itens'>
                        {props?.campains?.map((item, key) => (
                            <div key={key} className='itemCard'>
                                <div className='top' style={{
                                    backgroundImage: `linear-gradient(#ff000000, #000000bf), url(${item.data.img})`,
                                    }}>
                                    {item.data.title.toUpperCase()}
                                </div>
                                <div className='details'>
                                    <div>
                                        <span>{item.data.title}</span>
                                    </div>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default HomeMaster;