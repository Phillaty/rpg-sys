import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { uploadImageResponse } from "../types";

export const getPercentage = (total: number, actual: number) => {

    let result = (actual / total) * 100;

    return result;
}

const MAX_SIZE = 5 * 1024 * 1024;

export const uploadImage = async (file: File, path: string): Promise<uploadImageResponse> => {
    if (!file) return {
        error: 'Nenhum arquivo encontrado',
    };

    if (file.size > MAX_SIZE) {
        return { error: "Imagem acima do tamanho permitido de 5 MB." };
    }
  
    const storage = getStorage();
  
    const storageRef = ref(storage, `${path}/${file.name}`); // Defina o caminho do arquivo no storage
  
    try {
      const snapshot = await uploadBytes(storageRef, file);
  
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      console.log('Upload completo! URL da imagem:', downloadURL);
      return {
        url: downloadURL
      };
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      return {
        error: `Erro ao fazer upload: ${error}`
      };
    }
  };