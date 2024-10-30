import React, { useState } from 'react';
import { Container } from './styles';
import { campainDataType } from '../../../../types';
import TextField from '@mui/material/TextField';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase'
import { ColorRing } from 'react-loader-spinner';

type props = {
    toast: any;
    campain?: campainDataType;
}

type inviteType = {
    name: string,
};

const Invite = ({toast, campain}: props) => {

    const [loading, setLoading] = useState<boolean>(false);

    const [form, setForm] = useState<inviteType>({
        name: "",
    });

    const [link, setLink] = useState<string>();
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const handleSave = async () => {
        setLoading(true);

        await addDoc(collection(db, "invites"), {
            name: form.name,
            rule: 'player',
            redeemed: false,
            campainId: campain?.id ?? ""
        }).then((item) => {
            toast.success("Convite criado!");
            setLink(`${window.location.origin}/#/cadastro?invite=${item.id}`);
        });
        

        setLoading(false);
    }

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
                    <p style={{margin: '8px 0 4px 0'}}>Confirgurações de convites</p>
                    <div className='name'>
                        <TextField id="standard-basic" label="Nome do convidade" variant="filled" value={form.name} onChange={(e) => {
                            setForm({
                                ...form,
                                name: e.target.value
                            });
                        }} />
                    </div>
                    <div className='buttons'>                                              
                        <button onClick={handleSave}>Salvar</button>
                    </div>
                    {link && 
                    <div className='link'>
                        <div onClick={() => {
                            navigator.clipboard.writeText(link)
                            setIsCopied(true);

                            setTimeout(() => {
                                setIsCopied(false);
                            }, 2000);
                        }}>{link}</div>
                        {isCopied && <span>Copiado</span>}
                    </div>
                    }
                    </>}
                </div>
            </div>
        </Container>
        </>
    )
}

export default Invite;