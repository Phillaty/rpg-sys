import styled from "styled-components";

export const Container = styled.div`
    background-color: #181a1b;
    min-height: 100vh;
    color: #d3d3d3;
    position: relative;

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
        border: 1px solid #7b7b7b87;
        padding: 0px 16px 16px 16px;
        margin-top: 16px;
        border-radius: 4px;

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

    @media screen and (max-width: 1000px) {
        min-height: auto;
    }
`