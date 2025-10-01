import React, { useState } from 'react';
import { Container } from './styles';
import { campainDataType } from '../../../../types';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { StylesGroup } from '../../../../constants';
import { uploadImage } from '../../../../utils';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { ThreeDots } from 'react-loader-spinner';

type InfoProps = {
    campain: campainDataType;
    onClose: () => void;
    toast: any;
}

type formDataType = {
    title: string;
    description: string;
    lore: string;
    style: string[];
    state: string;
}

const Info: React.FC<InfoProps> = ({ campain, onClose, toast }) => {

    const [formData, setFormData] = useState<formDataType>({
        title: campain.data.title,
        description: campain.data.description,
        lore: campain.data.lore || "",
        style: campain.data.style || [],
        state: campain.data.state || "offline"
    });

    const [fileImg, setFileImg] = useState<File>();
    const [fileImgPreview, setFileImgPreview] = useState<string>(campain.data.img || "");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const stateOptions = [
        { value: "em campanha", label: "Em Campanha" },
        { value: "offline", label: "Offline" },
        { value: "em aguardo", label: "Em Aguardo" }
    ];

    const handleSave = async () => {
        setIsLoading(true);

        try {
            let urlImage = fileImgPreview;

            if (fileImg) {
                const resultImg = await uploadImage(fileImg, "campain/image");

                if (resultImg.error) {
                    toast.error(resultImg.error);
                    setIsLoading(false);
                    return;
                }

                urlImage = resultImg.url ?? "";
            }

            const campainDocRef = doc(db, "campains", campain.id);

            await updateDoc(campainDocRef, {
                title: formData.title,
                description: formData.description,
                lore: formData.lore,
                style: formData.style,
                state: formData.state,
                img: urlImage,
            });

            toast.success("Campanha atualizada com sucesso!");

        } catch (error) {
            toast.error("Erro ao atualizar campanha");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <Container>
            <div>
                {isLoading ? (
                    <div className='loading'>
                        <ThreeDots
                            visible={true}
                            height="80"
                            width="80"
                            color="#5755bd"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />
                    </div>
                ) : (
                    <>
                        <div className='box'>
                            <div className='title'>
                                <p>Editando campanha</p>
                            </div>
                            <div className='content'>
                                <div className='infos'>
                                    <div className='infosTitle'>
                                        <p>Informações da Campanha</p>
                                    </div>
                                    <div className='inputs'>
                                        <div className='inputItem'>
                                            <div className='image'>
                                                {fileImgPreview ? (
                                                    <div className='preview'>
                                                        <img src={fileImgPreview} alt='' />
                                                        <button onClick={() => {
                                                            setFileImg(undefined);
                                                            setFileImgPreview("");
                                                        }}>Remover</button>
                                                    </div>
                                                ) : (
                                                    <p><i className="fa-solid fa-plus"></i> Adicionar imagem</p>
                                                )}
                                                
                                                <input type='file' onChange={(e) => {
                                                    if(!!e?.target?.files?.length){
                                                        setFileImg(e.target.files[0]);
                                                        setFileImgPreview(URL.createObjectURL(e.target.files[0]));
                                                    } 
                                                }} />
                                            </div>
                                        </div>
                                        <div className='inputItem'>
                                            <TextField 
                                                id="filled-basic" 
                                                label="Nome da campanha" 
                                                variant="filled" 
                                                value={formData.title}
                                                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                                            />
                                        </div>
                                        <div className='inputItem'>
                                            <TextField
                                                id="filled-multiline-static"
                                                label="Descrição da campanha"
                                                multiline
                                                rows={4}
                                                variant="filled"
                                                value={formData.description}
                                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            />
                                        </div>
                                        <div className='inputItem'>
                                            <TextField
                                                id="filled-multiline-lore"
                                                label="Lore da campanha"
                                                multiline
                                                rows={6}
                                                variant="filled"
                                                value={formData.lore}
                                                onChange={(e) => setFormData({...formData, lore: e.target.value})}
                                            />
                                        </div>
                                        <div className='inputItem'>
                                            <Autocomplete
                                                multiple
                                                id="size-small-filled-multi"
                                                size="small"
                                                options={StylesGroup}
                                                getOptionLabel={(option) => option.title}
                                                value={StylesGroup.filter(option => formData.style.includes(option.title))}
                                                onChange={(event, newValue) => {
                                                    setFormData((prevData) => ({
                                                        ...prevData,
                                                        style: newValue.map((option) => option.title),
                                                    }));
                                                }}
                                                renderTags={(value, getTagProps) =>
                                                    value.map((option, index) => {
                                                        const { key, ...tagProps } = getTagProps({ index });
                                                        return (
                                                            <Chip
                                                                key={key}
                                                                variant="outlined"
                                                                label={option.title}
                                                                size="small"
                                                                {...tagProps}
                                                            />
                                                        );
                                                    })
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="filled"
                                                        label="Estilos"
                                                        placeholder="Estilos"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='options'>
                                    <div className='optionsTitle'>
                                        <p>Status da Campanha</p>
                                    </div>
                                    <div className='optionsItens'>
                                        <FormControl variant="filled" fullWidth>
                                            <InputLabel id="state-select-label">Status</InputLabel>
                                            <Select
                                                labelId="state-select-label"
                                                id="state-select"
                                                value={formData.state}
                                                label="Status"
                                                onChange={(e) => setFormData({...formData, state: e.target.value as string})}
                                            >
                                                {stateOptions.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>
                            </div>
                            <div className='buttons'>
                                <button onClick={onClose} className='cancel-btn'>Cancelar</button>
                                <button onClick={handleSave}>Salvar alterações</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Container>
        {/* <ToastContainer /> */}
        </>
    );
};

export default Info;