import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { alertType, avatarType, campainType, uploadImageResponse } from "../types";

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

  export const getAttrubuteMod = (perkTosearch: string, character: avatarType) => {
    switch (perkTosearch) {
        case 'AGI':
            return character.AGI;
        case 'INT':
            return character.INT;
        case 'VIG':
            return character.VIG;
        case 'PRE':
            return character.PRE;
        case 'FOR':
            return character.FOR;
        
        default:
            break;
    }
  }

  export const getAlertsCampain = (campain: campainType): alertType[] => {
    let errorList = [] as alertType[];

    if (campain.classes.length <= 0) errorList.push({
      message: "Nenhuma classe foi cadastrada nessa campanha!",
      type: 'error'
    });

    if (campain.skills.length <= 0) errorList.push({
      message: "Nenhuma perícia foi cadastrada nessa campanha!",
      type: 'error'
    });
    if (campain.origins.length <= 0) errorList.push({
      message: "Nenhuma origem foi cadastrada nessa campanha!",
      type: 'error'
    });

    if (campain.lore.length <= 0) errorList.push({
      message: "Campanha está sem uma lore! Uma breve história é bom pro contexto!",
      type: 'warning'
    });

    if (campain.players.length <= 0) errorList.push({
      message: "Nenhum player! Convide alguém!",
      type: 'warning'
    });

    if (campain.stores.length <= 0) errorList.push({
      message: "Nenhuma loja registrada!",
      type: 'warning'
    });

    return errorList;
  }

  export const getTypePosition = (type: string) => {
    switch (type) {
      case 'inventory': return "Inventário jodador";
      case 'store': return "Loja";
      case 'ground': return "No chão";
      case 'entity': return "Inventário entidade";
      case 'masterHold': return "Apenas mestre";
      case 'weapon': return "Armamento";
      case 'armadure': return "Armadura";
      case 'addon': return "Addon";
      case 'ammo': return "Munição";
      case 'general': return "Item geral";
      default:
        return "-";
    }
  }