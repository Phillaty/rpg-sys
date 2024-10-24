import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { addDoc, arrayUnion, collection, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { campainType, classeDataType, originDataType, perkDataType, userDataType } from '../../../../types';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../../../firebase/firebase';
import { ColorRing, Hearts } from 'react-loader-spinner';
import { decrypt } from '../../../../crypt';
import { toast, ToastContainer } from 'react-toastify';

type simpleData = {
    name: string;
    age?: number;
    gender?: string;
    lore?: string;
}

type attributesType = {
    AGI: number;
    INT: number;
    VIG: number;
    PRE: number;
    FOR: number;
}

type perkSelectType = {
    expertise: number;
    perk: string;
}

const SheetCreation = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') ?? ' ') as userDataType : {} as userDataType;
    const userId = decrypt(user.id);

    const [stage, setStage] = useState<number>(0);

    const [campain, setCampain] = useState<campainType>();
    const [origins, setOrigins] = useState<originDataType[]>();
    const [classes, setClasses] = useState<classeDataType[]>();
    const [skills, setSkills] = useState<perkDataType[]>();

    const [simpleData, setSimpleData] = useState<simpleData>({
        name: ''
    });
    const [originSelected, setOriginSelected] = useState<originDataType>();
    const [classeSelected, setClasseSelected] = useState<classeDataType>();

    const [attributePoints, setAttributePoints] = useState<number>(5);
    const [perkPoints, setPerkPoints] = useState<number>(0);
    const [attributes, setAttributes] = useState<attributesType>({
        AGI: 1,
        INT: 1,
        VIG: 1,
        PRE: 1,
        FOR: 1,
    });

    const [persk, setPerks] = useState<perkSelectType[]>([]);

    useEffect(() => {

        const docRef = doc(db, 'campains', campainId);

        onSnapshot(docRef, (querySnapshot) => {
            const docData = querySnapshot.data() as campainType;
            setCampain(docData);
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getOrigins = async () => {
        if(campain) {
           const p = query(
                collection(db, 'origin'),
                where('__name__', 'in', campain.origins)
            );

            const querySnapshot = await getDocs(p);

            const originArray = [] as originDataType[];
            querySnapshot.forEach((doc) => {
                originArray.push({
                    data: doc.data(),
                    id: doc.id,
                } as originDataType);
            });

            const sorted = originArray.sort((a, b) => a.data.title.localeCompare(b.data.title));

            setOrigins(sorted); 
        }
        
    }

    const getClasses = async () => {
        if(campain) {
           const p = query(
                collection(db, 'classes'),
                where('__name__', 'in', campain.classes)
            );

            const querySnapshot = await getDocs(p);

            const classeArray = [] as classeDataType[];
            querySnapshot.forEach((doc) => {
                classeArray.push({
                    id: doc.id,
                    data: doc.data(),
                } as classeDataType);
            });

            const sorted = classeArray.sort((a, b) => a.data.name.localeCompare(b.data.name));

            setClasses(sorted); 
        }
        
    }

    const getSkills = async () => {
        if(campain) {
           const p = query(
                collection(db, 'skills'),
                where('__name__', 'in', campain.skills)
            );

            const querySnapshot = await getDocs(p);

            const classeArray = [] as perkDataType[];
            querySnapshot.forEach((doc) => {
                const data = {
                    id: doc.id,
                    data: doc.data(),
                } as perkDataType;
                classeArray.push(data);
            });

            const sorted = classeArray.sort((a, b) => a.data.name.localeCompare(b.data.name));

            setSkills(sorted); 
        }
        
    }

    useEffect(() => {
        if(campain) {
            getOrigins();
            getClasses();
            getSkills();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campain]);

    useEffect(() => {
        if(classeSelected) {
            setAttributes({
                AGI: 1,
                INT: 1,
                VIG: 1,
                PRE: 1,
                FOR: 1,
            });

            setPerks([]);
            setPerkPoints(classeSelected.data.perk.beggining + attributes.INT);
            setAttributePoints(5);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classeSelected]);

    const createChar = async () => {
        setStage(4);

        const item = await addDoc(collection(db, "character"), {
            name: simpleData.name,
            age: simpleData.age ?? 0,
            gender: simpleData.gender ?? 'None',
            lore: simpleData.lore ?? '',
            money: 0,
            originId: originSelected?.id,
            playerId: userId,
            level: 1,
            skill: persk?.map((item) => {
                return {
                    expertise: 1,
                    perk: item.perk
                }
            }),
            class: {
                id: classeSelected?.id,
                title: classeSelected?.data.name
            },
            basics: {
                cyberpsicosy: {
                    actual: 100,
                    max: 100
                },
                life: {
                    actual: (classeSelected?.data.life.default ?? 0) + attributes.VIG,
                    max: (classeSelected?.data.life.default ?? 0) + attributes.VIG
                },
                pe: {
                    actual: (classeSelected?.data.pe.default ?? 0) + attributes.PRE,
                    max: (classeSelected?.data.pe.default ?? 0) + attributes.PRE
                },
                sanity: {
                    actual: classeSelected?.data.sanity.default,
                    max: classeSelected?.data.sanity.default
                },
            },
            AGI: attributes.AGI,
            INT: attributes.INT,
            VIG: attributes.VIG,
            PRE: attributes.PRE,
            FOR: attributes.FOR,
        });

        toast.success("Ficha criada!");

        const userDocRef = doc(db, "campains", campainId ?? '');

        await updateDoc(userDocRef, {
            characters: arrayUnion(item.id),
        });

        setTimeout(() => {
            navigate(`/campain?camp=${campainId}&wentFromCreate=true`);
        }, 1000);
    }

    return (
        <>
        <Container>
            {campain && origins && classes && skills ? 
            <>
                <div className='main'>
                    {stage === 0 && 
                        <>
                            <div className='stage-create-name mainContainer'>
                                <div>
                                    <div className='top'>
                                        <p className='title'>BEM-VINDO(A) A CRIAÇÃO DE PERSONAGEM!</p>
                                        <p className='description'>Vamos começar pelos dados mais simples, relxa que vai conseguir editar depois :)</p>
                                    </div>
                                    <div className='inputs'>
                                        <div>
                                            <label>Nome do personagem*</label>
                                            <input placeholder='Nome...' onChange={(e) => setSimpleData({...simpleData, name: e.target.value})} />
                                        </div>
                                        <div>
                                            <label>Idade</label>
                                            <input placeholder='Idade...' type='number' onChange={(e) => setSimpleData({...simpleData, age: Number(e.target.value)})} />
                                        </div>
                                        <div>
                                            <label>Gênero</label>
                                            <select onChange={(e) => setSimpleData({...simpleData, gender: e.target.value})}>
                                                <option value="M">Masculino</option>
                                                <option value="F">Feminino</option>
                                                <option value="NB">Não binário</option>
                                                <option value="None">Prefiro não dizer</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label>História</label>
                                            <textarea placeholder='História...' onChange={(e) => setSimpleData({...simpleData, lore: e.target.value})}></textarea>
                                        </div>
                                    </div>
                                    <div className='buttons'>
                                        <button onClick={() => setStage(stage + 1)} className='go'>Continuar</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {stage === 1 && 
                        <>
                            <div className='stage-select-origin mainContainer'>
                                <div>
                                    <div className='top'>
                                        <p className='title'>Escolha a origem do personagem</p>
                                        <p className='description'>A origem do personagem é a profissão antes da campanha!<br/> isso impacta nas suas habilidades!</p>
                                    </div>
                                    <div className='origins'>
                                        {origins?.map((item, key) => (
                                            <div className={`originItem ${item === originSelected && 'selected'}`} key={key} onClick={() => setOriginSelected(item)}>
                                                {item.data.title} 
                                                <span>{item.data.bonus.skill.map((i, index) => (<div key={index}>+{i}</div>))}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='buttons'>
                                        <button onClick={() => setStage(stage - 1)} className='back'>Voltar</button>
                                        <button onClick={() => originSelected && setStage(stage + 1)} className={`go ${!originSelected && 'disable'}`}>Continuar</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {stage === 2 && 
                        <>
                            <div className='stage-select-class mainContainer'>
                                <div>
                                    <div className='top'>
                                        <p className='title'>Escolha a classe agora</p>
                                        <p className='description'>A classe é o tipo de trabalho que opera no RPG! <br/> Escolha com cuidado depois que o rpg começar não vai poder mudar!</p>
                                    </div>
                                    <div className='classes'>
                                        {classes?.map((item, key) => (
                                            <div className={`classItem ${item === classeSelected && 'selected'}`} key={key} onClick={() => setClasseSelected(item)}>
                                                {item.data.name} 
                                                <span>{item.data.infos.map((i, index) => (<div key={index}>- {i}</div>))}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className='buttons'>
                                        <button onClick={() => setStage(stage - 1)} className='back'>Voltar</button>
                                        <button onClick={() => classeSelected && setStage(stage + 1)} className={`go ${!classeSelected && 'disable'}`}>Continuar</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {stage === 3 && 
                        <>
                            <div className='stage-select-attributes-skills mainContainer'>
                                <div>
                                    <div className='top'>
                                        <p className='title'>Atributos e perícias!</p>
                                        <p className='description'>Os atributos e as perícias são a base do seu personagem <br /> Atenção que cada perícia utiliza um atributo como base!</p>
                                    </div>
                                    <div className='attributesDetail'>
                                        <p>Pontos de atributos restantes: {attributePoints}</p>
                                        <p className='per'>Perícias ganhas pela origem: {originSelected?.data.bonus.skill.map((item) => (<div>{item}</div>))}</p>
                                    </div>
                                    <div className='attributes'>
                                        <div className='item'>
                                            <p>AGI</p>
                                            <div className='att'>
                                                <div className='plus' onClick={() => {
                                                    if(attributes.AGI > 0){
                                                        setAttributes({...attributes, AGI: attributes.AGI - 1}); 
                                                        setAttributePoints(attributePoints + 1);
                                                    }
                                                }}><i className="fa-regular fa-square-minus"></i></div>
                                                <div className='num'>{attributes.AGI}</div>
                                                <div className='minus' onClick={() => {
                                                    if(attributePoints > 0){
                                                        setAttributes({...attributes, AGI: attributes.AGI + 1}); 
                                                        setAttributePoints(attributePoints - 1);
                                                    }
                                                }}><i className="fa-regular fa-square-plus"></i></div>
                                            </div>
                                        </div>
                                        <div className='item'>
                                            <p>INT</p>
                                            <div className='att'>
                                                <div className='plus' onClick={() => {
                                                    if(attributes.INT > 0){
                                                        const newINT = attributes.INT - 1;
                                                        setAttributes({...attributes, INT: newINT}); 
                                                        setAttributePoints(attributePoints + 1);
                                                        
                                                        if(perkPoints <= 0) {
                                                            setPerks([]);
                                                            setPerkPoints((classeSelected?.data.perk.beggining ?? 0 ) + newINT);
                                                        } else {
                                                            setPerkPoints(perkPoints - 1);
                                                        }
                                                    }
                                                }}><i className="fa-regular fa-square-minus"></i></div>
                                                <div className='num'>{attributes.INT}</div>
                                                <div className='minus' onClick={() => {
                                                    if(attributePoints > 0){
                                                        setAttributes({...attributes, INT: attributes.INT + 1}); 
                                                        setAttributePoints(attributePoints - 1);

                                                        setPerkPoints(perkPoints + 1);
                                                    }
                                                }}><i className="fa-regular fa-square-plus"></i></div>
                                            </div>
                                        </div>
                                        <div className='item'>
                                            <p>VIG</p>
                                            <div className='att'>
                                                <div className='plus' onClick={() => {
                                                    if(attributes.VIG > 0){
                                                        setAttributes({...attributes, VIG: attributes.VIG - 1}); 
                                                        setAttributePoints(attributePoints + 1);
                                                    }
                                                }}><i className="fa-regular fa-square-minus"></i></div>
                                                <div className='num'>{attributes.VIG}</div>
                                                <div className='minus' onClick={() => {
                                                    if(attributePoints > 0){
                                                        setAttributes({...attributes, VIG: attributes.VIG + 1}); 
                                                        setAttributePoints(attributePoints - 1);
                                                    }
                                                }}><i className="fa-regular fa-square-plus"></i></div>
                                            </div>
                                        </div>
                                        <div className='item'>
                                            <p>PRE</p>
                                            <div className='att'>
                                                <div className='plus' onClick={() => {
                                                    if(attributes.PRE > 0){
                                                        setAttributes({...attributes, PRE: attributes.PRE - 1}); 
                                                        setAttributePoints(attributePoints + 1);
                                                    }
                                                }}><i className="fa-regular fa-square-minus"></i></div>
                                                <div className='num'>{attributes.PRE}</div>
                                                <div className='minus' onClick={() => {
                                                    if(attributePoints > 0){
                                                        setAttributes({...attributes, PRE: attributes.PRE + 1}); 
                                                        setAttributePoints(attributePoints - 1);
                                                    }
                                                }}><i className="fa-regular fa-square-plus"></i></div>
                                            </div>
                                        </div>
                                        <div className='item'>
                                            <p>FOR</p>
                                            <div className='att'>
                                                <div className='plus' onClick={() => {
                                                    if(attributes.FOR > 0){
                                                        setAttributes({...attributes, FOR: attributes.FOR - 1}); 
                                                        setAttributePoints(attributePoints + 1);
                                                    }
                                                }}><i className="fa-regular fa-square-minus"></i></div>
                                                <div className='num'>{attributes.FOR}</div>
                                                <div className='minus' onClick={() => {
                                                    if(attributePoints > 0){
                                                        setAttributes({...attributes, FOR: attributes.FOR + 1}); 
                                                        setAttributePoints(attributePoints - 1);
                                                    }
                                                }}><i className="fa-regular fa-square-plus"></i></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='skillsDetail'>
                                        <p>Pontos de perícia restantes: {perkPoints}</p>
                                    </div>
                                    <div className='skills'>
                                        {skills.map((item, key) => (
                                            <div key={key} className={`${persk.find(i => i.perk === item.id) && 'selected'}`} onClick={() => {
                                                if(persk.find(i => i.perk === item.id)){
                                                    const perkItens = persk.filter((j) => j.perk !== item.id);
                                                    setPerks(perkItens);
                                                    setPerkPoints(perkPoints + 1);
                                                } else {
                                                    if(perkPoints > 0) {
                                                        const perkItem = {expertise: 1, perk: item.id}
                                                        setPerks([...persk, perkItem]);
                                                        setPerkPoints(perkPoints - 1);
                                                    }
                                                    
                                                }
                                                
                                            }}>{item.data.name} <span>{item.data.base}</span></div>
                                        ))}
                                    </div>
                                    <div className='buttons'>
                                        <button onClick={() => setStage(stage - 1)} className='back'>Voltar</button>
                                        <button onClick={() => createChar()} className={`go ${!classeSelected && 'disable'}`}>CONCLUIR</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {stage === 4 &&
                        <>
                            <div className='load mainContainer'>
                                <div>
                                    Espere um segundo...
                                    <Hearts
                                    height="80"
                                    width="80"
                                    color="#f19aea"
                                    ariaLabel="hearts-loading"
                                    wrapperStyle={{}}
                                    wrapperClass=""
                                    visible={true}
                                    />
                                </div>
                            </div>
                        </>
                    }
                </div>
            </> 
            : 
            <>
                <div className='loading'>
                    <ColorRing
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#d82c38', '#f4a860', '#fde350', '#53ac2a', '#3164c4']}
                    />
                </div>
            </>}
        </Container>
        <ToastContainer />
        </>
    )
}

export default SheetCreation;