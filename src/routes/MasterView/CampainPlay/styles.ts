import styled from "styled-components";

export const Container = styled.div`

    display: flex;
    align-items: flex-start;
    justify-content: center;

    background-color: #181a1b;
    color: white;
    min-height: calc(100vh - 105px);

    button {
        background-color: #737ad3;
        color: white;
        border: 0;
        border-radius: 4px;
        padding: 8px;
        cursor: pointer;
    }

    button:hover {
        opacity: 0.8;
        transition: 0.2s;
    }

    > div {
       max-width: 1366px;
       width: 100%;
       height: 100%;
       padding: 8px;
       display: flex;
       gap: 8px;

       h1 {
        margin-bottom: 8px;
       }

       p {
        margin: 0;
       }

       .menu {
            background-color: white;
            flex-direction: column;
            display: flex;
            height: 85vh;
            padding: 16px;
            color: black;
            width: 250px;
            border-radius: 4px;

            .buttons {
                flex-direction: column;
                display: flex;
                gap: 4px;
            }
       }

       .onThePlay {
            .item {
                border: 1px solid #ffe9b8 !important;
                background-color: #ffe9b8;
                color: black;
                font-weight: 600;
            }
       }

       .onTheWait {
            margin-top: 16px;
            gap: 8px;
            display: flex;
            flex-direction: column;
       }

       .content {
            width: 100%;
            padding: 16px;
            background-color: #212121;
            border-radius: 4px;

            .head {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
                padding: 0 0 16px;
            }

            .game {
                border: 1px solid #595959;
                padding: 16px;
                border-radius: 4px;
            }

            .top {
                display: flex;
                justify-content: space-between;
                padding: 0 0 8px;
                align-items: center;

                > div {
                    display: flex;
                    gap: 8px;
                }
            }

            .item {
                display: flex;
                border: 1px solid #373737;
                padding: 16px;
                align-items: center;
                justify-content: space-between;
                border-radius: 4px;

                .habilities {
                    display: flex;
                    flex-wrap: wrap;
                    max-width: 400px;
                    gap: 4px;

                    .actionItem {
                        border-radius: 4px;
                        border: 1px solid #373737;
                        padding: 8px;
                        font-size: 12px;
                        cursor: pointer;
                    }

                    .actionItem:hover {
                        background-color: white;
                        color: black;
                        transition: 0.2s;
                    }
                }

                .info {
                    font-size: 14px;
                    padding: 0 16px;

                    .bold {
                        font-size: 16px;
                    }
                }
            }
        }
    }

    .rollPers {
        padding: 8px 16px 16px 16px;
        margin-top: 16px;
        border-radius: 4px;
        border: 1px solid #7b7b7b87;
        margin-bottom: 8px;

        .title {
            margin-bottom: 10px;
        }

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
`;


export const ContainerAddModal = styled.div`
    background-color: white;
    padding: 16px;
    border-radius: 4px;

    button {
        background-color: #737ad3;
        color: white;
        border: 0;
        border-radius: 4px;
        padding: 8px;
        cursor: pointer;
    }

    button:hover {
        opacity: 0.8;
        transition: 0.2s;
    }

    .title {
        text-align: center;
        padding: 4px 0 16px 0;
    }
    
    .list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 600px;

        p {
            margin: 0;
        }

        > div {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 4px 4px 8px;
            border: 1px solid gray;
            border-radius: 4px;
            

            > div:first-child {
                width: 200px;
            }

            .roll {
                padding: 0 8px;

                button {
                    margin-right: 4px;
                }
            }
        }
    }

    .buttons {
        display: flex;
        gap: 4px;
        margin-top: 8px;
    }
`;