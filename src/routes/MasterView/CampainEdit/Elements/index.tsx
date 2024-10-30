import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { elementDataType, elementType } from '../../../../types';
import TextField from '@mui/material/TextField';
import { addDoc, arrayUnion, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { useLocation } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';

type props = {
    toast: any;
    elements: elementDataType[]
}

const Elements = ({toast, elements}: props) => {

    const location = useLocation();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';

    const [elementSelected, setElementSelected] = useState<elementDataType>();

    const [isToAdd, setIsToAdd] = useState<boolean>(false);
    const [isToAddType, setIsToAddType] = useState<'import' | 'add'>();

    const [loading, setLoading] = useState<boolean>(false);

    const [elementForm, setElementForm] = useState<elementType>({
        description: "",
        name: "",
        verified: true,
    });

    useEffect(() => {
        if(elementSelected){
            setElementForm(elementSelected.data);
            setIsToAdd(false);
            setIsToAddType(undefined);
        }
    }, [elementSelected]);

    const handleOrigin = async () => {
        setLoading(true);
        if (isToAdd) {
            await addDoc(collection(db, "elements"), elementForm).then(async (item) => {
                toast.success("Elemento criado!");

                const userDocRef = doc(db, "campains", campainId ?? '');

                await updateDoc(userDocRef, {
                    elements: arrayUnion(item.id ?? ''),
                });
                setElementForm({
                    description: "",
                    name: "",
                    verified: true,
                });
            });

        } else {
            const userDocRef = doc(db, "elements", elementSelected?.id ?? '');

            await updateDoc(userDocRef, elementForm).then(() => {toast.success("Elemento atualizado!")});
        }

        setLoading(false);
    }

    const prepareToAdd = () => {
        setElementForm({
            description: "",
            name: "",
            verified: true,
        });
        setIsToAdd(true);
        setIsToAddType(undefined);
        setElementSelected(undefined);
    }

    const handleDeleteElement = async () => {
        if (elementSelected) {
            const docDelete = doc(db, "elements", elementSelected.id);
            await deleteDoc(docDelete).then(() => {
                toast.success("Elemento deletada!");
                setIsToAdd(true);
                setIsToAddType(undefined);
                setElementSelected(undefined);
                setLoading(false);
            });
        }
    }

    return (
        <>
        <Container>
            <div>
                <div className='left'>
                    {elements.map((i, key) => (
                        <button className={`${elementSelected === i ? 'selected' : ''}`} key={key} onClick={() => setElementSelected(i)}>{i.data.name}</button>
                    ))}
                    <button className='add' onClick={prepareToAdd}><i className="fa-solid fa-plus"></i> {elements.length <= 0 ? 'Adicionar elemento' : ''}</button>
                </div>
                <div className={`right ${elements.length <= 0 && !isToAdd ? 'noClasses' : ''}`}>
                    {loading ? <>
                        <div className='isLoading'>
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
                    </> : <>
                    {isToAdd && !isToAddType && <>
                        <div className='isToAdd'>
                            <button onClick={() => {
                                setIsToAddType('add');
                            }}>Adicionar novo</button>
                        </div>
                    </>}

                    {elementSelected || (isToAdd && isToAddType === 'add') ? <>
                    <div className='name'>
                        <TextField id="standard-basic" label="Nome do elemento" variant="filled" value={elementForm.name} onChange={(e) => {
                            setElementForm({
                                ...elementForm,
                                name: e.target.value
                            });
                        }} />
                    </div>
                    <div className='description'>
                        <TextField
                            id="standard-multiline-static"
                            label="Descrição do Elemento"
                            multiline
                            rows={8}
                            value={elementForm.description}
                            variant="filled"
                            onChange={(e) => {
                                setElementForm({
                                    ...elementForm,
                                    description: e.target.value
                                });
                            }}
                        />
                    </div>
                    <div className='duo'>
                        <TextField id="standard-basic" type='color' label="Cor fundo" variant="filled" value={elementForm.colors?.background} onChange={(e) => {                            
                            setElementForm({
                                ...elementForm,
                                colors: {
                                    ...elementForm.colors,
                                    background: e.target.value,
                                }
                            });
                        }} />
                        <TextField id="standard-basic" type='color' label="Cor fonte" variant="filled" value={elementForm.colors?.color} onChange={(e) => {
                            setElementForm({
                                ...elementForm,
                                colors: {
                                    ...elementForm.colors,
                                    color: e.target.value,
                                }
                            });
                        }} />
                    </div>                 
                    <div className='buttons'>                        
                        <button className='remove' onClick={handleDeleteElement}>Remover Elemento</button>
                        <button onClick={handleOrigin}>Salvar</button>
                    </div>
                    </> : <></>}
                    </>}
                </div>
            </div>
        </Container>
        </>
    )
}

export default Elements;