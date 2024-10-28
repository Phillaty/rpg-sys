import React, { useState } from 'react';
import { Container, ContainerModal } from './styles';
import { campainDataType } from '../../types';
import { useNavigate } from 'react-router-dom';
import Modal from '../../commom/Modal';

type prop = {
    campains: campainDataType[];
}

const HomeMaster = (props: prop) => {
    
    const navigate = useNavigate();

    const [campainSelected, setCampainSelected] = useState<campainDataType>();

    const handleCloseCampainModal = () => {
        setCampainSelected(undefined);
    }

    return (
        <>
        <Container>
            <div>
                <div className='campains'>
                    <h1>Minhas campanhas</h1>
                    <p>Clique na campanha para abrir os detalhes</p>
                    <div className='itens'>
                        <div className='add' onClick={() => {
                          navigate('/master/campain/create');  
                        }}>
                            <i className="fa-solid fa-plus"></i>
                            <p>Criar nova campanha</p>
                        </div>
                        {props?.campains?.map((item, key) => (
                            <div key={key} className='itemCard' onClick={() => {
                                setCampainSelected(item);
                            }}>
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
        <Modal isOpen={!!campainSelected} handleCloseModal={handleCloseCampainModal}>
            {campainSelected && 
                <ContainerModal>
                    <div className='details'>
                        <div className='image'>
                            <img alt='' src={campainSelected.data.img} />
                        </div>
                        <div className='infos'>
                            <div>
                                <p>Titulo</p>
                                <span>{campainSelected.data.title}</span>
                            </div>
                            <div>
                                <p>Descrição</p>
                                <span>{campainSelected.data.description}</span>
                            </div>
                            <div>
                                <p>Estilo</p>
                                <span>{campainSelected.data.style.join(", ")}</span>
                            </div>
                        </div>
                    </div>
                    <div className='options'>
                        <button>Jogar campanha</button>
                        <button onClick={() => {
                            navigate(`/master/campain/edit?camp=${campainSelected.id}`);
                        }}>Editar campanha</button>
                    </div>
                </ContainerModal>
            }
        </Modal>
        </>
    )
}

export default HomeMaster;