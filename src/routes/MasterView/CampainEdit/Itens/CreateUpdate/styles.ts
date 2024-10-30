import styled from "styled-components";

export const Container = styled.div`
    background-color: white;
    padding: 16px;
    border-radius: 4px;
    min-width: 500px;

    .button {
        background-color: #737ad3;
        color: white;
        border: 0;
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
    }

    .button:hover {
        opacity: 0.8;
        transition: 0.2s;
    }

    .remove {
        background-color: #d37373;
    }

    .all {
        width: 100%;
    }

    .isLoading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 350px;
    }

    > div {
        display: flex;

        .noClasses {
            width: 0;
            padding: 0;
        }

        .tabPainel {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-height: 300px;
            margin-top: 8px;

            .one {
                display: flex;
                gap: 4px;
                > div {
                    width: 100%;
                }
            }

            .duo {
                display: flex;
                gap: 4px;
                > div {
                    width: 50%;
                }
            }

            .buttons {

            }
        }

        .buttons {
            float: right;
            padding-top: 8px;

            button {
                padding: 8px 32px;
            }
        }

        .addDices {
            padding: 8px 0;

            .title {
                margin-bottom: 4px;
                font-size: 14px;
            }

            .dices {
                display: flex;
                gap: 4px;
                button {
                    background-color: #737ad3;
                    color: white;
                    border: 0;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 16px;
                    min-width: 45px;
                }

                button:hover {
                    opacity: 0.8;
                    transition: 0.2s;
                }
            }

            .dicesAdded {
                padding: 8px;
                display:flex;
                flex-direction: column;
                gap: 4px;
            }
        }

        .listMod {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .itemMod {
            display: flex;
            width: 100%;
            padding: 8px;
            border-radius: 4px;
            border: 1px solid lightgrey;

            .itemModName {
                width: 20%;
            }
            .itemModDescription {
                width: 60%;
                max-width: 500px;
            }
            .itemModButton {
                display: flex;
                width: 20%;
                justify-content: flex-end;
                align-items: center;
            }
        }
    }
`