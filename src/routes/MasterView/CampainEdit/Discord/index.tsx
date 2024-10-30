import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { campainDataType, discordType } from '../../../../types';
import TextField from '@mui/material/TextField';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase'
import { ColorRing } from 'react-loader-spinner';
import { FormControlLabel, FormGroup, Switch } from '@mui/material';

type props = {
    toast: any;
    campain?: campainDataType;
}

const Discord = ({toast, campain}: props) => {

    const [loading, setLoading] = useState<boolean>(false);

    const [form, setForm] = useState<discordType>({
        webhook: "",
        sendDices: true,
    });

    const handleSave = async () => {
        setLoading(true);

        const userDocRef = doc(db, "campains", campain?.id ?? '');

        await updateDoc(userDocRef, {
            discord: form,
        }).then(() => {toast.success("Discord atualizado!")});
        

        setLoading(false);
    }

    useEffect(() => {
        if(campain && campain.data.discord) {
            setForm(campain.data.discord);
        }
    }, [campain]);

    return (
        <>
        <Container>
            <div>
                <div className={`right ${!campain ? 'noClasses' : ''}`}>
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
                    <p style={{margin: '8px 0 4px 0'}}>Confirgurações de discord</p>
                    <div className='name'>
                        <TextField id="standard-basic" label="Webhook link" variant="filled" value={form.webhook} onChange={(e) => {
                            setForm({
                                ...form,
                                webhook: e.target.value
                            });
                        }} />
                    </div>
                    <div className='description'>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={form.sendDices} onChange={(e) => setForm({...form, sendDices: Boolean(e.target.value)})} />} label="Enviar resultado de dados" />
                    </FormGroup>
                    </div>   
                    <div className='buttons'>                                              
                        <button onClick={handleSave}>Salvar</button>
                    </div>
                    </>}
                </div>
            </div>
        </Container>
        </>
    )
}

export default Discord;