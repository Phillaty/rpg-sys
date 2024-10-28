import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { userDataType } from '../../../types';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import { StylesGroup } from '../../../constants';
import { ToastContainer, toast } from 'react-toastify';
import { uploadImage } from '../../../utils';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { decrypt } from '../../../crypt';
import { ThreeDots } from 'react-loader-spinner';

type formDataType = {
    title: string;
    description: string;
    style: string[];
    basics: {
        life: boolean;
        sanity: boolean;
        pe: boolean;
        cyberpsicosy: boolean;
    }
}

const CreateCampain = () => {

    const navigate = useNavigate();

    const user = localStorage.getItem('user') ? JSON.parse(decrypt(localStorage.getItem('user') ?? '')) as userDataType : {} as userDataType;

    const [formData, setFormData] = useState<formDataType>({
        title: "",
        description: "",
        style: [],
        basics: {
            life: true,
            sanity: false,
            pe: false,
            cyberpsicosy: false,
        }
    })

    const [fileImg, setFileImg] = useState<File>();
    const [fileImgPreview, setFileImgfileImgPreview] = useState<string>();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSwitchChange = (event: { target: { checked: any; }; }, state: string) => {
        const { checked } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            basics: {
                ...prevData.basics,
                [state]: checked,
            },
        }));
    };

    useEffect(() => {
        if (user.rule !== process.env.REACT_APP_MASTER_RULE) {
            localStorage.clear();
            navigate('/login');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const createCampain = async () => {
        setIsLoading(true);

        let urlImage = "";

        if (fileImg) {
            const resultImg = await uploadImage(fileImg, "campain/image");

            if(resultImg.error) {
                toast.error(resultImg.error);
            }

            urlImage = resultImg.url ?? "";
        }

        await addDoc(collection(db, "campains"), {
            title: formData.title,
            description: formData.description,
            style: formData.style,
            basics: formData.basics,
            img: urlImage,
            masterId: decrypt(user.id),
            characters: [],
            classes: [],
            lore: "",
            skills: [],
            players: [],
            state: "offline",
            stores: [],
            origins: [],
        }).then(async (item) => {
            
            toast.success("Campanha criada! Aguarde...");
        });
        
    }
    
    return (
        <>
        <Container>
            <div>
                {isLoading ? <>
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
                </> : 
                <>
                <div className='box'>
                    <div className='title'>
                        <p>Criando uma campanha</p>
                    </div>
                    <div className='content'>
                        <div className='infos'>
                            <div className='infosTitle'>
                                <p>Informações Básicas</p>
                            </div>
                            <div className='inputs'>
                                <div className='inputItem'>
                                    <div className='image'>
                                        {fileImgPreview ? <>
                                            <div className='preview'>
                                                <img src={fileImgPreview} alt='' />
                                                <button onClick={() => {
                                                    setFileImg(undefined);
                                                    setFileImgfileImgPreview(undefined);
                                                }}>Remover</button>
                                            </div>
                                        </> : 
                                        <>
                                            <p><i className="fa-solid fa-plus"></i> Adicionar imagem</p>
                                        </>}
                                        
                                        <input type='file' onChange={(e) => {
                                            if(!!e?.target?.files?.length){
                                                setFileImg(e.target.files[0]);
                                                setFileImgfileImgPreview(URL.createObjectURL(e.target.files[0]));
                                            } 
                                        }} />
                                    </div>
                                </div>
                                <div className='inputItem'>
                                    <TextField id="filled-basic" label="Nome da campanha" variant="filled" onChange={(e) => {setFormData({...formData, title: e.target.value})}} />
                                </div>
                                <div className='inputItem'>
                                    <TextField
                                        id="filled-multiline-static"
                                        label="Descrição da campanha"
                                        multiline
                                        rows={4}
                                        variant="filled"
                                        onChange={(e) => {setFormData({...formData, description: e.target.value})}}
                                    />
                                </div>
                                <div className='inputItem'>
                                <Autocomplete
                                    multiple
                                    id="size-small-filled-multi"
                                    size="small"
                                    options={StylesGroup}
                                    getOptionLabel={(option) => option.title}
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
                                        placeholder="Favorites"
                                    />
                                    )}
                                />
                                </div>
                            </div>
                        </div>
                        <div className='options'>
                            <div className='optionsTitle'>
                                <p>Configurações</p>
                            </div>
                            <div className='optionsItens'>
                                <FormGroup>
                                    <FormControlLabel control={<Switch checked={formData.basics.life} onChange={(e) => handleSwitchChange(e, "life")} />} label="Pontos de vida" />
                                    <FormControlLabel control={<Switch checked={formData.basics.sanity} onChange={(e) => handleSwitchChange(e, "sanity")} />} label="Pontos de sanidade" />
                                    <FormControlLabel control={<Switch checked={formData.basics.pe} onChange={(e) => handleSwitchChange(e, "pe")} />} label="Pontos de esforço" />
                                    <FormControlLabel control={<Switch checked={formData.basics.cyberpsicosy} onChange={(e) => handleSwitchChange(e, "cyberpsicosy")} />} label="Cyberpsicose" />
                                </FormGroup>
                            </div>
                        </div>
                    </div>
                    <div className='buttons'>
                        <button onClick={createCampain}>Criar campanha</button>
                    </div>
                </div>
                </>}
            </div>
        </Container>
        <ToastContainer />
        </>
    )
}

export default CreateCampain;