import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import Modal from '../../../commom/Modal';
import userProfile from '../../../imgs/profile-user-icon-2048x2048-m41rxkoe.png';
import { useNavigate } from 'react-router-dom';
import { campainDataType } from '../../../types';

type prop = {
    selectedCampain: campainDataType | undefined;
    setSelectedCampain: React.Dispatch<React.SetStateAction<campainDataType | undefined>>
}

const ModalCampain = ({selectedCampain, setSelectedCampain}: prop) => {

    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState<boolean>(false);

    useEffect(() => {
        if(selectedCampain) {
            setOpenModal(true);
        }
    }, [selectedCampain]);

    const handleClose = () => {
        setOpenModal(false);
        setSelectedCampain(undefined);
    };

    return (
        <>
        {selectedCampain && 
            <Modal isOpen={openModal} handleCloseModal={handleClose}>
                <Container>
                    <div className='topMobile' style={{
                            backgroundImage: `linear-gradient(#ff000000, #000000bf), url(${selectedCampain.data.img})`,
                    }}>
                        <span className='players'><i className="fa-solid fa-user-group"></i> {selectedCampain.data.players.length}</span>
                        {selectedCampain.data.title.toUpperCase()}
                    </div>

                    <div className='character'>
                        {selectedCampain.playerChar && <>
                            <div className='characterImg'>
                                <img alt='' src={userProfile} />
                            </div>
                            <div className='characterDetails'>
                                <p className='name'>{selectedCampain.playerChar?.data.name}</p>
                                <p className='level'>Nvl. {selectedCampain.playerChar?.data.level}</p>
                                <div className='attributes'>
                                    <span className='attribute'>AGI: <span className='attributeNum'>{selectedCampain.playerChar?.data.AGI}</span></span>
                                    <span className='attribute'>INT: <span className='attributeNum'>{selectedCampain.playerChar?.data.INT}</span></span>
                                    <span className='attribute'>VIT: <span className='attributeNum'>{selectedCampain.playerChar?.data.VIT}</span></span>
                                    <span className='attribute'>PRE: <span className='attributeNum'>{selectedCampain.playerChar?.data.PRE}</span></span>
                                    <span className='attribute'>FOR: <span className='attributeNum'>{selectedCampain.playerChar?.data.FOR}</span></span>
                                </div>
                            </div>
                            <div className='buttons'>
                                <button className='button-mid button-white' onClick={() => navigate(`/campain?camp=${selectedCampain.id}`)}>Iniciar ficha</button>
                            </div>
                        </>}

                        {!selectedCampain.playerChar && <>
                            <div className='createDescriptions'>
                                <i className="fa-regular fa-square-plus"></i>
                                <p>Crie uma ficha agora!</p>
                                <span>Você foi convidado a participar da campanha rpg "{selectedCampain.data.title}", vamos começar criando sua ficha <b>😎</b></span>
                            </div>
                            <div className='buttons'>
                                <button className='button-mid button-green-blue' onClick={() => navigate(`/campain/sheet/create?camp=${selectedCampain.id}`)}>Criar ficha</button>
                            </div>
                        </>}
                    </div>

                    <div className='campain'>
                        <div className='top' style={{
                            backgroundImage: `linear-gradient(#ff000000, #000000bf), url(${selectedCampain.data.img})`,
                        }}>
                            <span className='players'><i className="fa-solid fa-user-group"></i> {selectedCampain.data.players.length}</span>
                            {selectedCampain.data.title.toUpperCase()}
                            
                        </div>

                        <div className='details'>
                            <div className='detailItem'>
                                <p>Estilo</p>
                                <span>{selectedCampain.data.style}</span>
                            </div>
                            <div className='detailItem'>
                                <p>Descrição</p>
                                <span>{selectedCampain.data.description}</span>
                            </div>
                            <div className='detailItem'>
                                <p>Lore</p>
                                <span className='lore'>{selectedCampain.data.lore}</span>
                                <button className='button-small button-blue'>Ver lore inteira</button>
                            </div>
                        </div>
                    </div>
                    
                </Container>
            </Modal>
        }
        </>
    )
}

export default ModalCampain;