import React, {  useState } from 'react';
import { Container } from './styles';
import { avatarDataType, magicDataType } from '../../../../types';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { ColorRing } from 'react-loader-spinner';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { magicPlayerDestibution } from '..';

type props = {
    toast: any;
    magic: magicDataType[];
    char: avatarDataType[];
    magicPlayer: magicPlayerDestibution[];
}

const MagicPlayers = ({magic, toast, char, magicPlayer}: props) => {

    const [magicSelected, setMagicSelected] = useState<magicPlayerDestibution>();

    const [loading, setLoading] = useState<boolean>(false);

    const [magicId, setMagicId] = useState<{
        magicId: string;
        playerId: string;
    }>({
        magicId: "",
        playerId: ""
    });

    const [isToAdd, setIsToAdd] = useState<boolean>(false);

    const handleClass = async () => {
        setLoading(true);
        const userDocRef = doc(db, "character", magicId?.playerId ?? '');

        await updateDoc(userDocRef, {
            magics: arrayUnion(magicId?.magicId ?? ''),
        }).then(async () => {
            toast.success("Magia adicionada ao jogador!");
        });

        setLoading(false);
    }

    const handleDeleteClass = async () => {
        if (magicSelected) {

            const newMagics = char.find(i => i.id === magicSelected.playerId)?.data.magics?.filter(i => i !== magicSelected.magicId);

            const userDocRef = doc(db, "character", magicSelected?.playerId ?? '');
            await updateDoc(userDocRef, {
                magics: newMagics,
            }).then(async () => {
                toast.success("Magia removida do jogador!");
            });
        }
    }

    const prepareToAdd = () => {
        setIsToAdd(true);
        setMagicId({
            magicId: "",
            playerId: ""
        });
        setMagicSelected(undefined);
    }

    return (
        <>
        <Container>
            <div>
                <div className='left'>
                    <button className='add' onClick={prepareToAdd}><i className="fa-solid fa-plus"></i> {magicPlayer.length <= 0 ? 'Adicionar classe' : ''}</button>
                    {magicPlayer.map((i, key) => (
                        <button className={`${magicId?.magicId === i.magicId ? 'selected' : ''}`} key={key} onClick={() => {
                            setMagicId({playerId: i.playerId, magicId: i.magicId});
                            setMagicSelected(i);
                        }}>{i.player} - {i.magic}</button>
                    ))}
                </div>
                <div className={`right ${magicPlayer.length <= 0 && !isToAdd ? 'noClasses' : ''}`}>
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
                    {magicSelected || isToAdd  ? <>
                    
                    <div className='description'>
                        <FormControl variant="filled" sx={{ minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-filled-label">Personagem</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={magicId?.playerId ?? ""}
                                label="perícia"
                                variant="filled"
                                onChange={(e) => {
                                    setMagicId({
                                        playerId: e.target.value ?? "",
                                        magicId: magicId?.playerId ?? "",
                                    });
                                }}
                            >
                                {char.map((item, key) => (
                                    <MenuItem value={item.id} key={key}>{item.data.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='description'>
                        <FormControl variant="filled" sx={{ minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-filled-label">Magia</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={magicId?.magicId ?? ""}
                                label="perícia"
                                variant="filled"
                                onChange={(e) => {
                                    setMagicId({
                                        ...magicId,
                                        magicId: e.target.value ?? "",
                                    });
                                }}
                            >
                                {magic.map((item, key) => (
                                    <MenuItem value={item.id} key={key}>{item.data.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    
                    <div className='buttons'>
                        {magicSelected && <><button onClick={handleDeleteClass}>Excluir magia do usuário</button></>}
                        <button onClick={handleClass}>Salvar</button>
                    </div>
                    </> : <></>}
                    </>}
                </div>
            </div>
        </Container>
        </>
    )
}

export default MagicPlayers;