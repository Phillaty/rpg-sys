import React, { useEffect, useState } from 'react';
import { Container, ContainerModal } from './styles';
import { avatarDataType, campainType, habilityDataType, skillType, subclassDataType } from '../../../../types';
import { skillFiltr, skillTy } from '../..';
import logo from '../../../../imgs/profile-user-icon-2048x2048-m41rxkoe.png';
import Modal from '../../../../commom/Modal';
import { db } from '../../../../firebase/firebase';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import { Vortex } from 'react-loader-spinner';

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
    const [showPerksModal, setShowPerksModal] = useState<boolean>(false);
    const [loadingAtt, setLoadingAtt] = useState<boolean>(false);

    const [habilityToAdd, setHabilityToAdd] = useState<habilityDataType>();
    const [subclassToAdd, setSubclassToAdd] = useState<subclassDataType>();

    const [habilitiesChar, setHabilitiesChar] = useState<habilityDataType[]>();

    const [perksToUpgrade, setPerksToUpgrade] = useState<skillTy[]>([]);

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
    }, [charcater, habilities]);

    const handleCloseHabilityModal = () => {
        setShowHabilityModal(false);
        setShowSubclassModal(false);
        setShowPerksModal(false);
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

    const updatePerks  = async () => {
        if (!!perksToUpgrade.length) {
            handleCloseHabilityModal();

            const skillsChar = charcater?.data.skill;
            const newSkillsChar = [] as skillType[];

            skillsAll.forEach((i) => {
                const isToUpgrade = perksToUpgrade.find(j => j.id === i.id);

                const alreadyIn = skillsChar?.find(j => j.perk === i.id);
                
                if (!!isToUpgrade){
                    newSkillsChar.push({
                        perk: i.id,
                        expertise: isToUpgrade.expertise
                    } as skillType);

                    return;
                } 

                if (!!alreadyIn) {
                    newSkillsChar.push({
                        perk: i.id,
                        expertise: alreadyIn.expertise
                    } as skillType);

                    return;
                }
            })

            const userDocRef = doc(db, "character", charcater?.id ?? '');

            await updateDoc(userDocRef, {
                skill: newSkillsChar,
                unlock: {
                    attributePoints: charcater?.data.unlock.attributePoints,
                    habilityPoints: charcater?.data.unlock.habilityPoints,
                    maxPerkLevel: charcater?.data.unlock.maxPerkLevel,
                    perkPoints: (charcater?.data.unlock.perkPoints ?? 0) - perksToUpgrade.length,
                }
            }).then(() => {
                toast.success("Perícias atualizadas!");
                setSubclassToAdd(undefined);
            });

            setPerksToUpgrade([]);
        }
    }

    const verifyPerkToImprove = (perk: skillTy) => {
        if(charcater && perk) {
            if(charcater.data.unlock.perkPoints <= 0) return false;

            if ((perk.expertise ?? 0) >= charcater?.data.unlock.maxPerkLevel) {
                return false;
            }

            if (perksToUpgrade.length >= charcater.data.unlock.perkPoints) {
                return false;
            }
        }
        
        return true;
    }

    const upAttribute = async (att: 'INT' | 'AGI' | 'FOR' | 'PRE' | 'VIG') => {
        setLoadingAtt(true);
        const userDocRef = doc(db, "character", charcater?.id ?? '');

        const dataToUp = {
            [att]: (charcater?.data[att] ?? 0) + 1,
            unlock: {
                attributePoints: (charcater?.data.unlock.attributePoints ?? 0) - 1,
                habilityPoints: charcater?.data.unlock.habilityPoints ?? 0,
                maxPerkLevel: charcater?.data.unlock.maxPerkLevel ?? 0,
                perkPoints: charcater?.data.unlock.perkPoints ?? 0,
            }
        }
        console.log(dataToUp);

        await updateDoc(userDocRef, dataToUp).then(() => {
            toast.success("Perícias atualizadas!");
        });

        setLoadingAtt(false);
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
                    <div className='infoBasics'>
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
                                <p className='info'>{!!charcater?.data.age ? charcater?.data.age : '-'}</p>
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

                    <div className='infoBasics infoMore'>
                        <div className='attributesTitle'>Atributos</div>
                        <div className='attributes'>
                            <div className='attrubuteItem'>
                                <p>AGI</p>
                                <span>{charcater?.data.AGI}</span>
                                {(charcater?.data.unlock.attributePoints ?? 0) > 0 && (charcater?.data.AGI ?? 0) < 5 ?
                                    <>
                                        {loadingAtt ? 
                                            <Vortex
                                            visible={true}
                                            height="30"
                                            width="30"
                                            ariaLabel="vortex-loading"
                                            wrapperStyle={{}}
                                            wrapperClass="vortex-wrapper"
                                            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                                            />
                                            : 
                                            <button onClick={() => {
                                                upAttribute('AGI');
                                            }}>
                                                <i className="fa-solid fa-angles-up"></i>
                                            </button>
                                            
                                        }
                                    </>
                                    :
                                    <button className='disable'><i className="fa-solid fa-angles-up"></i></button>
                                }
                            </div>
                            <div className='attrubuteItem'>
                                <p>INT</p>
                                <span>{charcater?.data.INT}</span>
                                {(charcater?.data.unlock.attributePoints ?? 0) > 0 && (charcater?.data.INT ?? 0) < 5 ?
                                    <>
                                        {loadingAtt ? 
                                            <Vortex
                                            visible={true}
                                            height="30"
                                            width="30"
                                            ariaLabel="vortex-loading"
                                            wrapperStyle={{}}
                                            wrapperClass="vortex-wrapper"
                                            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                                            />
                                            : 
                                            <button onClick={() => {
                                                upAttribute('INT');
                                            }}>
                                                <i className="fa-solid fa-angles-up"></i>
                                            </button>
                                            
                                        }
                                    </>
                                    :
                                    <button className='disable'><i className="fa-solid fa-angles-up"></i></button>
                                }
                            </div>
                            <div className='attrubuteItem'>
                                <p>VIG</p>
                                <span>{charcater?.data.VIG}</span>
                                {(charcater?.data.unlock.attributePoints ?? 0) > 0 && (charcater?.data.VIG ?? 0) < 5 ?
                                    <>
                                        {loadingAtt ? 
                                            <Vortex
                                            visible={true}
                                            height="30"
                                            width="30"
                                            ariaLabel="vortex-loading"
                                            wrapperStyle={{}}
                                            wrapperClass="vortex-wrapper"
                                            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                                            />
                                            : 
                                            <button onClick={() => {
                                                upAttribute('VIG');
                                            }}>
                                                <i className="fa-solid fa-angles-up"></i>
                                            </button>
                                            
                                        }
                                    </>
                                    :
                                    <button className='disable'><i className="fa-solid fa-angles-up"></i></button>
                                }
                            </div>
                            <div className='attrubuteItem'>
                                <p>PRE</p>
                                <span>{charcater?.data.PRE}</span>
                                {(charcater?.data.unlock.attributePoints ?? 0) > 0 && (charcater?.data.PRE ?? 0) < 5 ?
                                    <>
                                        {loadingAtt ? 
                                            <Vortex
                                            visible={true}
                                            height="30"
                                            width="30"
                                            ariaLabel="vortex-loading"
                                            wrapperStyle={{}}
                                            wrapperClass="vortex-wrapper"
                                            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                                            />
                                            : 
                                            <button onClick={() => {
                                                upAttribute('PRE');
                                            }}>
                                                <i className="fa-solid fa-angles-up"></i>
                                            </button>
                                            
                                        }
                                    </>
                                    :
                                    <button className='disable'><i className="fa-solid fa-angles-up"></i></button>
                                }
                            </div>
                            <div className='attrubuteItem'>
                                <p>FOR</p>
                                <span>{charcater?.data.FOR}</span>
                                {(charcater?.data.unlock.attributePoints ?? 0) > 0 && (charcater?.data.FOR ?? 0) < 5 ?
                                    <>
                                        {loadingAtt ? 
                                            <Vortex
                                            visible={true}
                                            height="30"
                                            width="30"
                                            ariaLabel="vortex-loading"
                                            wrapperStyle={{}}
                                            wrapperClass="vortex-wrapper"
                                            colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
                                            />
                                            : 
                                            <button onClick={() => {
                                                upAttribute('FOR');
                                            }}>
                                                <i className="fa-solid fa-angles-up"></i>
                                            </button>
                                            
                                        }
                                    </>
                                    :
                                    <button className='disable'><i className="fa-solid fa-angles-up"></i></button>
                                }
                            </div>
                        </div>
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
                    {(charcater?.data.level ?? 0) >= 2 && <>
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
                        <p>Perícias <button onClick={() => {setShowPerksModal(true)}}>Editar</button></p>
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


        <Modal isOpen={showPerksModal} handleCloseModal={handleCloseHabilityModal} >
            <ContainerModal>
                <div className='title'>
                    <p>Selecione suas perícias</p>
                    {(charcater?.data.unlock?.perkPoints ?? 0) > 0 && <>
                        <span>Você tem {charcater?.data.unlock?.perkPoints} pontos restantes de perícia.</span>
                    </>}
                </div>
                <div className='perks'>
                    <div className='perksItens'>
                        {skillsAll.map((item, key) => (
                            <div key={key} className={`item`} onClick={() => {
                                // setSubclassToAdd(item);
                            }}>
                                <div className='name'>
                                    {item.name}
                                    {perksToUpgrade?.some(i => i.id === item.id) ? <>
                                        {(item.expertise ?? 0) > 0 ? 
                                            <span>Nível {item.expertise} <i className="fa-solid fa-arrow-right"></i> Nível {(item.expertise ?? 0) + 1}</span>
                                            :
                                            <span>Nível 0 <i className="fa-solid fa-arrow-right"></i> Nível 1</span>
                                        }
                                    </> : <>
                                        {item.expertise && <span>Nível {item.expertise}</span>}
                                    </>}
                                </div>
                                {verifyPerkToImprove(item) || perksToUpgrade?.some(i => i.id === item.id) ? 
                                    <div className='button'>
                                        {perksToUpgrade?.some(i => i.id === item.id) ? <>
                                        <button
                                            className='cancel'
                                            onClick={() => {
                                                const newperksToAdd = perksToUpgrade.filter((i) => i.id !== item.id);
                                                setPerksToUpgrade(newperksToAdd);
                                            }}
                                        >
                                            Remover <i className="fa-solid fa-xmark"></i>
                                        </button>
                                        </> : <>
                                        <button
                                            onClick={() => {
                                                const newPerkItem = {
                                                    base: item.base,
                                                    expertise: (item.expertise ?? 0) + 1,
                                                    id: item.id,
                                                    name: item.name,
                                                } as skillTy;
                                                setPerksToUpgrade([...perksToUpgrade, newPerkItem]);
                                            }}
                                        >
                                            Melhorar <i className="fa-solid fa-arrow-up"></i>
                                        </button>
                                        </>}
                                    </div>
                                    :
                                    <div className='button'>
                                        <p>Limite máximo</p>
                                    </div>
                                }
                            </div>
                        ))}
                    </div>
                </div>
                <div className='buttons buttonsperk'>
                    <button className='cancel'>Cancelar</button>
                    <button onClick={() => {
                        updatePerks();
                    }}>Salvar</button>
                </div>
            </ContainerModal>
        </Modal>
        <ToastContainer />
        </>
    )
}

export default SheetDetails;