import React, { useEffect, useState } from 'react';
import { Container, ContainerModal } from './styles';
import { avatarDataType, campainType, habilityDataType, subclassDataType } from '../../../../types';
import { skillFiltr, skillTy } from '../..';
import logo from '../../../../imgs/profile-user-icon-2048x2048-m41rxkoe.png';
import Modal from '../../../../commom/Modal';
import { db } from '../../../../firebase/firebase';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';

type prop = {
    charcater?: avatarDataType;
    campain?: campainType;
    skills: skillFiltr;
    onClose: () => void;
    isToCloseSheet: boolean;
    skillsAll: skillTy[];
    habilities: habilityDataType[];
    subclasses: subclassDataType[];
    charSubclass?: subclassDataType;
}

const SheetDetails = ({ charcater, campain, skills, onClose, isToCloseSheet, skillsAll, habilities, subclasses, charSubclass }: prop) => {

    const [showHabilityModal, setShowHabilityModal] = useState<boolean>(false);
    const [showSubclassModal, setShowSubclassModal] = useState<boolean>(false);

    const [habilityToAdd, setHabilityToAdd] = useState<habilityDataType>();
    const [subclassToAdd, setSubclassToAdd] = useState<subclassDataType>();

    const [habilitiesChar, setHabilitiesChar] = useState<habilityDataType[]>();

    useEffect(() => {
        if(skillsAll && skills.trained?.length > 0) {
            skillsAll.forEach((i) => {
                const findSkill = skills.trained.find((j) => j.id === i.id);

                if(findSkill) {
                    i.expertise = findSkill.expertise;
                }
            })
        }
    }, [skillsAll, skills]);

    useEffect(() => {
        if (charcater && habilities) {
            const habilitiesFind = habilities.filter((i) => charcater?.data?.hability?.some((j) => j === i.id));
            const sorted = habilitiesFind.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setHabilitiesChar(sorted);
        }
    }, [charcater, habilities])

    const handleCloseHabilityModal = () => {
        setShowHabilityModal(false);
        setShowSubclassModal(false);
    }

    const addHability = async () => {
        if (habilityToAdd) {
            handleCloseHabilityModal();
            const userDocRef = doc(db, "character", charcater?.id ?? '');

            await updateDoc(userDocRef, {
                hability: arrayUnion(habilityToAdd.id),
            }).then(() => {
                toast.success("Habilidade adicionada!");
                setHabilityToAdd(undefined);
            });
        }
        
    }

    const addSubclass  = async () => {
        if (subclassToAdd) {
            handleCloseHabilityModal();
            const userDocRef = doc(db, "character", charcater?.id ?? '');

            await updateDoc(userDocRef, {
                subclass: {
                    id: subclassToAdd.id,
                    title: subclassToAdd.data.name,
                },
            }).then(() => {
                toast.success("Subclasse selecionada!");
                setSubclassToAdd(undefined);
            });
        }
        
    }

    return (
        <>
        <Container isToCloseSheet={isToCloseSheet}>
            <div className='close'>
                <button onClick={() => {
                    onClose();
                }}><i className="fa-solid fa-xmark"></i> fechar</button>
            </div>
            <div className='mainDetails'>
                <div className='charInfo'>
                    <div className='img'>
                        <img src={logo} alt='' />
                    </div>
                    <div className='infos'>
                        <div>
                            <p className='label'>Nome</p>
                            <p className='info'>{charcater?.data.name}</p>
                        </div>
                        <div>
                            <p className='label'>Idade</p>
                            <p className='info'>{charcater?.data.age}</p>
                        </div>
                        <div>
                            <p className='label'>Classe</p>
                            <p className='info'>{charcater?.data.class.title}</p>
                        </div>
                        <div>
                            <p className='label'>Lore</p>
                            <p className='info'>{charcater?.data.lore}</p>
                        </div>
                    </div>
                    <div className='button'>
                        <button>Editar informações</button>
                    </div>
                </div>
                <div className='habilitys'>
                    <div className='hability'>
                        <div className='title'>
                            <p>Habilidades</p>
                        </div>
                        <div className='itens'>
                            <div className='add' onClick={() => {setShowHabilityModal(true)}}>
                                <i className="fa-regular fa-square-plus"></i>
                                <p>Adicionar habilidade</p>
                            </div>
                            {habilitiesChar?.map((item) => (
                                <div className='item'>
                                    <p className='name'>{item.data.name}</p>
                                    <p className='detail'>{item.data.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {(charcater?.data.level ?? 0) >= 0 && <>
                        <div className='subclass'>
                            <div className='title'>
                                <p>Subclasse</p>
                            </div>
                            <div className='itens'>
                                {!charSubclass ? 
                                <>
                                <div className='add' onClick={() => {setShowSubclassModal(true)}}>
                                    <i className="fa-regular fa-square-plus"></i>
                                    <p>Adicionar subclasse</p>
                                </div>
                                </> : <>
                                {charSubclass.data.habilities?.map((item) => {
                                    // eslint-disable-next-line array-callback-return
                                    if(item.level < (charcater?.data.level ?? 0)) {
                                        return (
                                            <div className='item'>
                                                <p className='name'>{item.name}</p>
                                                <p className='detail'>{item.description}</p>
                                            </div>
                                        );
                                    }
                                    
                                    // eslint-disable-next-line array-callback-return
                                    return;
                                })}
                                </>}
                            </div>
                        </div>
                    </>}
                </div>
                <div className='skills'>
                    <div className='title'>
                        <p>Perícias <button>Editar</button></p>
                    </div>
                    <div className='itens'>
                        {skillsAll.map((item, key) => (
                            <div key={key} className='item'>
                                <p>
                                    {item.name}
                                    <div className='detailsSkills'>
                                        {item.expertise && <span className='expertise'>Nivel {item.expertise}</span> }
                                        <span className='base'>{item.base}</span>
                                    </div>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Container>
        <Modal isOpen={showHabilityModal} handleCloseModal={handleCloseHabilityModal} >
            <ContainerModal>
                <div className='title'>
                    <p>Adicionar habilidade</p>
                </div>
                <div className='itens'>
                    {habilities.map((item) => (
                        <div className={`item ${habilityToAdd === item && 'selected'}`} onClick={() => {
                            setHabilityToAdd(item);
                        }}>
                            <p className='name'>{item.data.name}</p>
                            <p className='detail'>{item.data.description}</p>
                        </div>
                    ))}
                </div>
                <div className='buttons'>
                    <button className={`${!habilityToAdd && 'disabled'}`} onClick={() => {
                        addHability();
                    }}>Adicionar</button>
                </div>
            </ContainerModal>
        </Modal>

        <Modal isOpen={showSubclassModal} handleCloseModal={handleCloseHabilityModal} >
            <ContainerModal>
                <div className='title'>
                    <p>Selecionar subclasse</p>
                </div>
                <div className='subclass'>
                    <div className='subclassItens'>
                        {subclasses.map((item, key) => (
                            <div key={key} className={`item ${subclassToAdd === item && 'selected'}`} onClick={() => {
                                setSubclassToAdd(item);
                            }}>
                                <p className='name'>{item.data.name}</p>
                            </div>
                        ))}
                        
                    </div>
                    {subclassToAdd && 
                        <div className='subclassItensDetails'>
                            <div className='subclassTitle'>{subclassToAdd?.data.name}</div>
                            <div className='subclassDescription'>{subclassToAdd?.data.description}</div>
                            <div className='subclassskills'>
                                {subclassToAdd?.data.habilities.map((i, keyI) => (
                                    <div className='subclassskillsItens' key={keyI}>
                                        <p>Nível {i.level} - {i.name}</p>
                                        {i.description}
                                    </div>
                                ))}
                            </div>
                        </div>
                    }
                </div>
                <div className='buttons'>
                    <button className={`${!subclassToAdd && 'disabled'}`} onClick={() => {
                        addSubclass();
                    }}>Adicionar</button>
                </div>
            </ContainerModal>
        </Modal>
        <ToastContainer />
        </>
    )
}

export default SheetDetails;