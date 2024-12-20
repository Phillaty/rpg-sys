import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import ModalCampain from './ModalCampain';
import { campainDataType } from '../../types';
import { Chip } from '@mui/material';

type prop = {
    campains: campainDataType[];
}

const HomePlayer = (props: prop) => {

    const [selectedCampain, setSelectedCampain] = useState<campainDataType>();

    useEffect(() => {
        if(selectedCampain){
            setSelectedCampain(props.campains.find(i => i.id === selectedCampain.id));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.campains]);

    return (
        <>
        <Container>
            <div>
                <div className='campains'>
                    <h1>Campanhas</h1>
                    <p>Clique na campanha para abrir os detalhes</p>
                    <div className='itens'>
                        {props?.campains?.map((item, key) => (
                            <div key={key} className='itemCard' onClick={() => setSelectedCampain(item)}>
                                <div className='body'>
                                    <div className='top' style={{
                                        backgroundImage: `linear-gradient(#ff000000, #000000bf), url(${item.data.img})`,
                                        }}>
                                        {item.data.title.toUpperCase()}
                                    </div>
                                    <div className='details'>
                                        <div>
                                            <span>
                                                <Chip color="primary" label={`Jogadores: ${item.data.players.length + 1}`} />
                                                <Chip color="secondary" label={`Personagens: ${item.data.characters.length}`} />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Container>
        

        <ModalCampain selectedCampain={selectedCampain} setSelectedCampain={setSelectedCampain} />
        </>
    )
}

export default HomePlayer;