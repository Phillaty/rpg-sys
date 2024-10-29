// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

export type userDataType = {
    login: string;
    password: string;
    name: string;
    rule: string;
    id: string;
};

export type campainType = {
    description: string;
    img: string;
    lore: string;
    style: string[];
    title: string;
    state: string;
    players: string[];
    stores: string[];
    characters: string[];
    basics: basicsCampainType;
    classes: string[];
    origins: string[];
    elements: string[];
    skills: string[];
}

export type campainDataType = {
    id: string;
    data: campainType;
    playerChar?: avatarDataType;
};

export type skillType = {
    expertise: number;
    perk: string;
}

export type classCharType = {
    id: string;
    title: string;
}

export type unlockType = {
    habilityPoints: number;
    perkPoints: number;
    maxPerkLevel: number;
}

export type avatarType = {
    class: classCharType;
    subclass: classCharType;
    money: number;
    name: string;
    originId: string;
    playerId: string;
    level: number;
    AGI: number;
    FOR: number;
    INT: number;
    PRE: number;
    VIG: number;
    skill: skillType[];
    basics: basicsCharType;
    lore: string;
    age: number;
    hability: string[];
    unlock: unlockType;
    img: string;
};

export type avatarDataType = {
    id: string;
    data: avatarType;
};

export type perkType = {
    name: string;
    base: string;
    verified?: boolean;
};

export type perkDataType = {
    id: string;
    data: perkType;
};

export type basicsCampainType = {
    life: boolean;
    sanity: boolean;
    cyberpsicosy: boolean;
    pe: boolean;
};

export type basicsCharInType = {
    max: number;
    actual: number;
}

export type basicsCharType = {
    life: basicsCharInType;
    sanity: basicsCharInType;
    cyberpsicosy: basicsCharInType;
    pe: basicsCharInType;
};

export type originType = {
    bonus: {
        skill: string[];
    };
    title: string;
    verified?: boolean;
    description: string;
}

export type originDataType = {
    id: string;
    data: originType;
}

export type classBasics = {
    default: number;
    perLevel: number;
}

export type classeType = {
    name: string;
    description: string;
    infos: string[];
    life: classBasics;
    sanity: classBasics;
    pe: classBasics;
    perk: {
        beggining: number;
        middle: number;
        end: number;
    };
    verified?: boolean;
}

export type classeDataType = {
    id: string;
    data: classeType;
}

export type buffLifeType = {
    value: number;
}

export type buffPerkType = {
    perkId: string;
    perkName: string;
    value: number;
}

export type buffPerkVantageType = {
    perkId: string;
    perkName: string;
}

export type habilityBuffType = {
    lifePerLevel?: buffLifeType;
    lifeTotal?: buffLifeType;
    modifyRoll?: buffPerkType[];
    rollVantage?: buffPerkVantageType[];
}

export type habilityType = {
    classId: string;
    description: string;
    name: string;
    require?: string[];
    buff?: habilityBuffType;
    type: string;
    verified?: boolean;
}

export type habilityDataType = {
    id: string;
    data: habilityType;
}

export type subclassHabilitiesType = {
    name: string;
    description: string;
    level: number;
}

export type subclassType = {
    name: string;
    classId: string;
    description: string;
    habilities: subclassHabilitiesType[];
}

export type subclassDataType = {
    id: string;
    data: subclassType;
}

export type uploadImageResponse = {
    url?: string;
    error?: string;
}

export type alertType = {
    message: string;
    type: 'warning' | 'error';
}

export type itemTypeRoll = {
    base?: number[];
    mod?: number[];
}

export type itemTypePosition = {
    type: 'inventory' | 'store' | 'ground' | 'entity';
    idGetter?: string;
}

export type itemTypeCrit = {
    multiply?: number;
    roll?: number;
}

export type itemBuffType = {
    modifyRoll?: buffPerkType[];
}

export type itemTypeModifications = {
    name?: string;
    description?: string;
}

export type itemType = {
    name: string;
    description: string;
    type: 'weapon' | 'armadure' | 'addon' | 'ammo' | 'general' | '';
    position: itemTypePosition;
    weaponConfigs?: {
        crit?: itemTypeCrit;
        damage?: itemTypeRoll;
        type?: 'range' | 'melee';
    };
    armadureConfigs?: {
        protection?: number;
        type?: 'heavy' | 'light';
    };
    roll?: itemTypeRoll;
    reach?: string;
    damagetype?: string;
    weight: number;
    category: number;
    buff?: itemBuffType;
    campainId?: string;
    verified?: boolean;
    cost: number;
    modifications?: itemTypeModifications[];
}

export type itemDataType = {
    id: string;
    data: itemType;
}

export type storeType = {
    title: string;
    location: string;
    description: string;
    moneyHolding: number;
    tax: number;
}

export type storeDataType = {
    id: string;
    data: storeType;
}

export type elementType = {
    name: string;
    description: string;
    verified?: boolean,
}

export type elementDataType = {
    id: string;
    data: elementType;
}