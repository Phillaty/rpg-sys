import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { avatarDataType, avatarType } from '../../../../../types';
import { Avatar, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../../firebase/firebase';
import { uploadImage } from '../../../../../utils';
import { ColorRing } from 'react-loader-spinner';

type prop = {
    charcater: avatarDataType;
    toast: any;
}

const EditInfo = ({charcater, toast}: prop) => {

    const [form, setForm] = useState<avatarType>(charcater.data);
    const [loading, setloading] = useState<boolean>(false);

    const [fileImg, setFileImg] = useState<File>();
    const [fileImgPreview, setFileImgfileImgPreview] = useState<string>();
    const [imgAvatarLing, setimgAvatarLing] = useState<string>();

    useEffect(() => {
        if(charcater.data.img) setimgAvatarLing(charcater.data.img);
    }, [charcater]);

    const handleSave = async () => {
        setloading(true);
        const userDocRef = doc(db, "character", charcater?.id ?? '');

        let urlImage = form.img;

        if (fileImg) {
            const resultImg = await uploadImage(fileImg, `character/${charcater.id}/image`);

            if(resultImg.error) {
                toast.error(resultImg.error);
            }

            urlImage = resultImg.url ?? "";
        }

        const dataToUp = {
            img: urlImage,
            name: form.name,
            age: form.age ?? 0,
            lore: form.lore,
            gender: form.gender,
        }

        await updateDoc(userDocRef, dataToUp).then(() => {
            toast.success("Personagem atualizado!");
        });

        setloading(false);
    }

    return (
        <>
            <Container>
                <div className='title'>Editar informações básicas</div>
                <div className='data'>
                    <div className='inputItem'>
                        <div className={`image ${imgAvatarLing || fileImgPreview ? 'haveImg' : 'noImg'}`}>
                            {fileImgPreview ? <>
                                <div className='preview'>
                                    <div className='imgView'>
                                        <Avatar sizes='big' alt="" src={fileImgPreview} sx={{ width: 80, height: 80 }} />
                                    </div>
                                    <button onClick={() => {
                                        setFileImg(undefined);
                                        setFileImgfileImgPreview(undefined);
                                        setForm({
                                            ...form,
                                            img: "",
                                        });
                                    }}>Remover</button>
                                </div>
                            </> : 
                            <>
                                {imgAvatarLing ? <>
                                    <div className='preview'>
                                        <div className='imgView'>
                                            <Avatar sizes='big' alt="" src={imgAvatarLing} sx={{ width: 80, height: 80 }} />
                                        </div>
                                        <button onClick={() => {
                                            setFileImg(undefined);
                                            setFileImgfileImgPreview(undefined);
                                            setimgAvatarLing(undefined);
                                            setForm({
                                                ...form,
                                                img: "",
                                            });
                                        }}>Remover</button>
                                    </div>
                                </> : <>
                                    <p><i className="fa-solid fa-plus"></i> Adicionar imagem</p>
                                </>}
                            </>}
                                   
                            <input type='file' 
                            onChange={(e) => {
                                if(!!e?.target?.files?.length){
                                    setFileImg(e.target.files[0]);
                                    setFileImgfileImgPreview(URL.createObjectURL(e.target.files[0]));
                                    e.target.value = "";
                                } 
                            }} />
                        </div>
                    </div>
                    <div className='input'>
                        <TextField id="standard-basic" size='small' label="Nome" variant="filled" inputMode='numeric' value={form.name} onChange={(e) => {
                            setForm({
                                ...form,
                                name: e.target.value,
                            });
                        }} />
                    </div>
                    <div className='input'>
                        <TextField id="standard-basic" size='small' type='number' label="Nome" variant="filled" inputMode='numeric' value={form.age} onChange={(e) => {
                            setForm({
                                ...form,
                                age: Number(e.target.value ?? ""),
                            });
                        }} />
                    </div>
                    <div className='input'>
                        <FormControl variant="filled" sx={{ minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-filled-label">Duração</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={form.gender ?? ""}
                                label="perícia"
                                variant="filled"
                                onChange={(e) => {
                                    setForm({
                                        ...form,
                                        gender: e.target.value,
                                    });
                                }}
                            >
                                <MenuItem value={"M"}>Masculino</MenuItem>
                                <MenuItem value={"F"}>Feminino</MenuItem>
                                <MenuItem value={"NB"}>Não binário</MenuItem>
                                <MenuItem value={"None"}>Prefiro não dizer</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className='input'>
                        <TextField
                            id="filled-multiline-static"
                            label="Descrição da campanha"
                            multiline
                            rows={4}
                            variant="filled"
                            value={form.lore}
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    lore: e.target.value,
                                });
                            }}
                        />
                    </div>
                    <div className='buttons'>
                        {loading ? <>
                            <ColorRing
                                visible={true}
                                height="50"
                                width="50"
                                ariaLabel="color-ring-loading"
                                wrapperStyle={{}}
                                wrapperClass="color-ring-wrapper"
                                colors={['#d82c38', '#f4a860', '#fde350', '#53ac2a', '#3164c4']}
                            />
                        </> : <>
                            <button onClick={handleSave}>Salvar</button>
                        </>}
                        
                    </div>
                </div>
            </Container>
        </>
    )
}

export default EditInfo;