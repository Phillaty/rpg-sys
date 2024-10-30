import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { storeDataType, storeType } from '../../../../types';
import TextField from '@mui/material/TextField';
import { addDoc, arrayUnion, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase'
import { useLocation } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';

type props = {
    toast: any;
    stores: storeDataType[];
}

const Stores = ({toast, stores}: props) => {

    const location = useLocation();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';

    const [storeSelected, setStoreSelected] = useState<storeDataType>();

    const [isToAdd, setIsToAdd] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const [storeForm, setStoreForm] = useState<storeType>({
        title: "",
        location: "",
        description: "",
        moneyHolding: 0,
        tax: 0,
    });

    useEffect(() => {
        if(storeSelected){
            setStoreForm(storeSelected.data);
            setIsToAdd(false);
        }
    }, [storeSelected]);

    const handleOrigin = async () => {
        setLoading(true);
        if (isToAdd) {
            await addDoc(collection(db, "stores"), storeForm).then(async (item) => {
                toast.success("Perícia criada!");

                const userDocRef = doc(db, "campains", campainId ?? '');

                await updateDoc(userDocRef, {
                    stores: arrayUnion(item.id ?? ''),
                });
                setStoreForm({
                    title: "",
                    location: "",
                    description: "",
                    moneyHolding: 0,
                    tax: 0,
                });
            });

        } else {
            const userDocRef = doc(db, "stores", storeSelected?.id ?? '');

            await updateDoc(userDocRef, storeForm).then(() => {toast.success("Perícia atualizada!")});
        }

        setLoading(false);
    }

    const prepareToAdd = () => {
        setStoreForm({
            title: "",
            location: "",
            description: "",
            moneyHolding: 0,
            tax: 0,
        });
        setIsToAdd(true);
        setStoreSelected(undefined);
    };

    const handleDeleteStore = async () => {
        if (storeSelected) {
            const docDelete = doc(db, "stores", storeSelected.id);
            await deleteDoc(docDelete).then(() => {
                toast.success("Loja deletada!");
                setIsToAdd(true);
                setLoading(false);
            });
        }
    }

    return (
        <>
        <Container>
            <div>
                <div className='left'>
                    {stores.map((i, key) => (
                        <button className={`${storeSelected === i ? 'selected' : ''}`} key={key} onClick={() => setStoreSelected(i)}>{i.data.title}</button>
                    ))}
                    <button className='add' onClick={prepareToAdd}><i className="fa-solid fa-plus"></i> {stores.length <= 0 ? 'Adicionar classe' : ''}</button>
                </div>
                <div className={`right ${stores.length <= 0 && !isToAdd ? 'noClasses' : ''}`}>
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
                    {storeSelected || isToAdd ? <>
                    <div className='name'>
                        <TextField id="standard-basic" label="Nome da loja" variant="filled" value={storeForm.title} onChange={(e) => {
                            setStoreForm({
                                ...storeForm,
                                title: e.target.value
                            });
                        }} />
                    </div>
                    <div className='description'>
                        <TextField
                            id="standard-multiline-static"
                            label="Descrição da loja"
                            multiline
                            rows={4}
                            value={storeForm.description}
                            variant="filled"
                            onChange={(e) => {
                                setStoreForm({
                                    ...storeForm,
                                    description: e.target.value
                                });
                            }}
                        />
                    </div>
                    <div className='description'>
                        <TextField id="standard-basic" label="Dinheiro da loja" type='number' variant="filled" value={storeForm.moneyHolding} onChange={(e) => {
                            setStoreForm({
                                ...storeForm,
                                moneyHolding: Number(e.target.value)
                            });
                        }} />
                        <TextField id="standard-basic" label="Taxa de venda por item" type='number' variant="filled" value={storeForm.tax} onChange={(e) => {
                            setStoreForm({
                                ...storeForm,
                                tax: Number(e.target.value)
                            });
                        }} />
                    </div>
                    <div className='description'>
                        <TextField id="standard-basic" label="Localização da loja" variant="filled" value={storeForm.location} onChange={(e) => {
                            setStoreForm({
                                ...storeForm,
                                location: e.target.value
                            });
                        }} />
                    </div>                
                    <div className='buttons'>
                        {!isToAdd && <button onClick={handleDeleteStore}>Excluir loja</button>}
                                              
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

export default Stores;