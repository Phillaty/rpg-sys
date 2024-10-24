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
    style: string;
    title: string;
    state: string;
    players: string[];
    stores: string[];
    characters: string[];
    basics: basicsCampainType;
    classes: string[];
    origins: string[];
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

export type avatarType = {
    class: classCharType;
    money: number;
    name: string;
    originId: string;
    playerId: string;
    level: number;
    AGI: string;
    FOR: string;
    INT: string;
    PRE: string;
    VIT: string;
    skill: skillType[];
    basics: basicsCharType;
    lore: string;
};

export type avatarDataType = {
    id: string;
    data: avatarType;
};

export type perkType = {
    name: string;
    base: string;
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
    }
}

export type classeDataType = {
    id: string;
    data: classeType;
}