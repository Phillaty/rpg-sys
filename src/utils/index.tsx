import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { alertType, avatarDataType, avatarType, campainType, subclassDataType, uploadImageResponse, classeDataType, unlockType, basicsCharType } from "../types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

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

  const updateBdChar = async (basics: basicsCharType, unlock: unlockType, char: avatarDataType) => {
    const docRef = doc(db, "character", char.id);

    try {
      await updateDoc(docRef, {
        basics: basics,
        unlock: unlock,
        level: char.data.level + 1
      });
      return true;
    } catch (error) {
      return false;
    }
    
  }

  const getUnlockNew = (unlock: unlockType, att: string[], val: number): unlockType => {
    return {
      attributePoints: unlock.attributePoints + (att.includes("attributePoints") ? val : 0),
      habilityPoints: unlock.habilityPoints + (att.includes("habilityPoints") ? val : 0),
      perkPoints: unlock.perkPoints + (att.includes("perkPoints") ? val : 0),
      maxPerkLevel: unlock.maxPerkLevel + (att.includes("maxPerkLevel") ? 1 : 0),
      levelPoint: unlock.levelPoint - 1,
    }
  }

  export const levelUp = async (character: avatarDataType, classe: classeDataType, subclass?: subclassDataType) => {

    const beforeBasic = character.data.basics;

    const newLife = {
      max: character.data.basics.life.max + (classe.data.life.perLevel + (character.data.VIG * 2)),
      actual: character.data.basics.life.actual + (classe.data.life.perLevel + (character.data.VIG * 2))
    }
    const newSanity = {
      max: character.data.basics.sanity.max + classe.data.sanity.perLevel,
      actual: character.data.basics.sanity.actual + classe.data.sanity.perLevel
    }
    const newPE = {
      max: character.data.basics.pe.max + (classe.data.pe.perLevel + (character.data.PRE * 3)),
      actual: character.data.basics.pe.actual + (classe.data.pe.perLevel + (character.data.PRE * 3))
    }

    const basicsNew = {
      life: newLife,
      pe: newPE,
      sanity: newSanity,
      cyberpsicosy: character.data.basics.cyberpsicosy
    } as basicsCharType;

    let newUnlock: unlockType = {
      attributePoints: character.data.unlock.attributePoints,
      habilityPoints: character.data.unlock.habilityPoints,
      perkPoints: character.data.unlock.perkPoints,
      maxPerkLevel: character.data.unlock.maxPerkLevel,
      levelPoint: character.data.unlock.levelPoint - 1,
    };

    let messages:{title: string, description: string}[] = [];

    if (subclass) {
      subclass.data.habilities.forEach(i => {
        if(i.level === (character.data.level + 1)) {
          messages.push({
            title: i.name,
            description: i.description,
          });
        }
      })
    }

    switch (character.data.level) {
      case 1:
        //habilidade de trilha
        messages.push({
          title: "Escolha de subclasse",
          description: "Agora você pode escolher uma subclasse na página de ficha!",
        });
      break;
      case 2:
        //poder combatente
        newUnlock = getUnlockNew(character.data.unlock, ["habilityPoints"], 1);
        messages.push({
          title: "Habilidade de classe",
          description: "Você pode escolher uma habilidade de classe!",
        });
      break;
      case 3:
        //aumento de atributo
        newUnlock = getUnlockNew(character.data.unlock, ["attributePoints"], 1);
        messages.push({
          title: "Ponto de atributo",
          description: "Você pode atribuir mais um ponto entre os atrubutos!",
        });
      break;
      case 4:
        //ataque especial
      break;
      case 5:
        //poder combatente
        newUnlock = getUnlockNew(character.data.unlock, ["habilityPoints"], 1);
        messages.push({
          title: "Habilidade de classe",
          description: "Você pode escolher uma habilidade de classe!",
        });
      break;
      case 6:
        //grau treinamento
        newUnlock = getUnlockNew(character.data.unlock, ["perkPoints", "maxPerkLevel"], (classe.data.perk.middle + (character.data.INT > 0 ? character.data.INT : 0) ));
        messages.push({
          title: "Pontos de perícia",
          description: `Você ganhou ${(classe.data.perk.middle + (character.data.INT > 0 ? character.data.INT : 0) )} pontos pra destribuir entre as perícias e agora pode aumentar para o nível 2!`,
        });
      break;
      case 7:
        //habilidade de trilha
      break;
      case 8:
        //poder combatente
        newUnlock = getUnlockNew(character.data.unlock, ["habilityPoints"], 1);
        messages.push({
          title: "Habilidade de classe",
          description: "Você pode escolher uma habilidade de classe!",
        });
      break;
      case 9:
        //aumento de atributo, versalidade
        newUnlock = getUnlockNew(character.data.unlock, ["attributePoints"], 1);
        messages.push({
          title: "Ponto de atributo",
          description: "Você pode atribuir mais um ponto entre os atrubutos!",
        });
      break;
      case 10:
        //ataque especial
      break;
      case 11:
        //poder combatente
        newUnlock = getUnlockNew(character.data.unlock, ["habilityPoints"], 1);
        messages.push({
          title: "Habilidade de classe",
          description: "Você pode escolher uma habilidade de classe!",
        });
      break;
      case 12:
        //habilidade trilha
      break;
      case 13:
        //grau de treinamento
        newUnlock = getUnlockNew(character.data.unlock, ["perkPoints", "maxPerkLevel"], classe.data.perk.end + (character.data.INT > 0 ? character.data.INT : 0) );
        messages.push({
          title: "Pontos de perícia",
          description: `Você ganhou ${classe.data.perk.end + (character.data.INT > 0 ? character.data.INT : 0)} pontos pra destribuir entre as perícias e agora pode aumentar para o nível 3!`,
        });
      break;
      case 14:
        //poder combatente
        newUnlock = getUnlockNew(character.data.unlock, ["habilityPoints"], 1);
        messages.push({
          title: "Habilidade de classe",
          description: "Você pode escolher uma habilidade de classe!",
        });
      break;
      case 15:
        //aumento de atributo
        newUnlock = getUnlockNew(character.data.unlock, ["attributePoints"], 1);
        messages.push({
          title: "Ponto de atributo",
          description: "Você pode atribuir mais um ponto entre os atrubutos!",
        });
      break;
      case 16:
        //ataque especial
      break;
      case 17:
        //poder combatente
        newUnlock = getUnlockNew(character.data.unlock, ["habilityPoints"], 1);
        messages.push({
          title: "Habilidade de classe",
          description: "Você pode escolher uma habilidade de classe!",
        });
      break;
      case 18:
        //aumento atributo
        newUnlock = getUnlockNew(character.data.unlock, ["attributePoints"], 1);
        messages.push({
          title: "Ponto de atributo",
          description: "Você pode atribuir mais um ponto entre os atrubutos!",
        });
      break;
      case 19:
        //habilidade trilha
        messages.push({
          title: "Nível Máximo",
          description: "wow você ainda ta vivo? kk",
        });
      break;
    
      default:
        break;
    }

    const state = await updateBdChar(basicsNew, newUnlock, character);

    return {
      beforeBasic,
      unlock: newUnlock,
      basics: basicsNew,
      messages,
      state
    };
  }