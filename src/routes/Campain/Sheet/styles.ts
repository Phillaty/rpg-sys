import styled from "styled-components";

export const Container = styled.div`
    background-color: #181a1b;
    min-height: 100vh;
    color: #d3d3d3;
    position: relative;

    .topInfo {
        background-color: #34349363;
        color: white;
        padding: 16px 16px 32px 16px;
        border-radius: 4px;
        margin-bottom: 16px;
    }

    .buttonsChar {
        display: flex;
        justify-content: flex-end;
        gap: 4px;

        button {
            border: 0;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
        }

        button:hover {
            opacity: 0.8;
            transition: 0.2s;
        }

        .backpack {
            background-color: #49fbd2;
        }

        .sheet {
            background-color: #0076db;
            color: white;
        }
    }

    .rollPers {
        padding: 8px 16px 16px 16px;
        margin-top: 16px;
        border-radius: 4px;
        border: 1px solid #7b7b7b87;


        .buttons {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            margin-bottom: 8px;
            gap: 4px;

            > div {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
            }

            p {
                margin: 0;
                font-size: 14px;
            }

            button {
                height: 32px;
                padding: 0 16px;
                background-color: #34a1c1;
                color: white;
                border: 0;
                border-radius: 4px;
                cursor: pointer;
            }
        }

        .preVisuTitle {
            p {
                font-size: 24px;
                margin-bottom: 4px;
            }
        }

        .preVisu {
            display: flex;
            flex-wrap: wrap;

            button {
                height: 100%;
                margin-left: 4px;
                padding: 0 16px;
                background-color: #737ad3;
                color: white;
                border: 0;
                border-radius: 4px;
            }
        }

        .dicesPer {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;

            > div {
                padding: 4px 0;
                border: 1px solid gray;
                border-radius: 4px;
                cursor: pointer;
                width: 40px;
                text-align: center;

                .error {
                    display: none;
                    color: #930000;
                }
            }

            > div:hover {

                .diceitem {
                    display: none;
                }

                .error {
                    display: block;
                }
            }
        }

        .preVisuMod {
            display: flex;

            p {
                font-size: 14px;
            }

            .dicesPerMod {
                display: flex;
                align-items: center;
                gap: 4px;

                .error {
                    display: none;
                    color: #930000;
                }

                > div {
                    padding: 2px 0;
                    border: 1px solid gray;
                    border-radius: 4px;
                    cursor: pointer;
                    width: 32px;
                    text-align: center;
                }

                > div:hover {

                    .diceitem {
                        display: none;
                    }

                    .error {
                        display: block;
                    }
                }
            } 
        }        
    }

    .weapons {
        border: 0;
        background-color: #1c273b;
        padding: 8px;
        margin-top: 14px;
        border-radius: 4px;
        p {
            margin: 0;
        }

        .weaponList {
            display: flex;
            flex-wrap: wrap;

            .itemWeapon {
                display: flex;
                flex-direction: column;
                gap: 4px;
                border: 1px solid #7b7b7b87;
                padding: 8px;
                width: 50%;
                border-radius: 4px;

                @media (max-width: 1000px) {
                    width: 100%;
                }

                > div {
                    display: flex;
                    gap: 4px;
                }
                button {
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    transition: 0.2s;
                    margin-top: 8px;
                }

                .test {
                    background-color: #3c4fd3;
                    color: white;
                    border: 1px solid #3c4fd3;
                }

                .dmg {
                    background-color: #df4747;
                    color: white;
                    border: 1px solid #df4747;
                }

                .crit {
                    background-color: #bb5600;
                    color: white;
                    border: 1px solid #bb5600;
                }

                button:hover {
                    background-color: white;
                    border-color: white;
                    color: #181a1b; 
                    transition: 0.2s;
                }
            }
        }
    }

    .habilities {
        border: 0;
        background-color: #1c273b;
        padding: 16px;
        margin-top: 14px;
        border-radius: 4px;

        p {
            margin: 0;
        }

        .habilityTitle {
            font-weight: 600;

            small {
                font-weight: 500;
                font-size: 12px;
            }
        }

        .habilityList {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 16px;

            .habilityItem {
                border: 1px solid gray;
                border-radius: 4px;
                padding: 4px 8px;
                cursor: pointer;
                transition: 0.2s;
            }

            .habilityItem:hover {
                background-color: white;
                border-color: white;
                color: #181a1b; 
                transition: 0.2s;
            }
        }
    }

    @media screen and (max-width: 1000px) {
        min-height: auto;
    }
`

export const ContainerHability = styled.div`
    background-color: white;
    padding: 16px;
    border-radius: 4px;
    color: black;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    p {
        margin: 0;
    }

    .data {
        p {
            font-size: 18px;
            font-weight: 600;
        }

        span > div {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
        }

        .perkItem {
            border: 1px solid gray;
            display: flex;
            padding: 4px 8px;
            border-radius: 4px;
        }
    }
`