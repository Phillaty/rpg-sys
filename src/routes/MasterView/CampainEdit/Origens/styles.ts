import styled from "styled-components";

export const Container = styled.div`
    background-color: white;
    padding: 16px;
    border-radius: 4px;

    > div {
        display: flex;

        .left {
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-height: 80vh;
            overflow: auto;
            padding-right: 4px;

            button {
                width: 100%;
                background-color: transparent;
                border: 1px solid gray;
                border-radius: 4px;
                padding: 8px 16px;
                cursor: pointer;
            }

            button:hover {
                opacity: 0.8;
                transition: 0.2s;
            }

            .selected {
                background-color: #73abd3;
                color: white;
                border-color: transparent;
            }

            .add {
                background-color: #737ad3;
                color: white;
                border-color: transparent;
            }
        }

        .right {
            width: 30vw;
            padding: 0 16px;
            display: flex;
            flex-direction: column;
            gap: 8px;

            max-height: 90vh;
            min-height: 50vh;
            overflow: auto;

            .isLoading {
                width: 100%;
                height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            > div {
                width: 100%;
            }

            .name, .description, .infos, .buttons {

                > div {
                    width: 100%;
                }
                
            }

            .infos {
                border: 1px solid #d5d5d5;
                border-radius: 4px;
                padding: 16px;

                .infoInput {
                    display: flex;

                    > div {
                        width: 100%;
                    }

                    button {
                        background-color: #737ad3;
                        color: white;
                        border: 0;
                        border-radius: 4px;
                        padding: 8px 16px;
                        cursor: pointer;
                    }

                    button:hover {
                        opacity: 0.8;
                        transition: 0.2s;
                    }
                }

                .infosList {
                    margin-top: 4px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                }
            }

            .perks {

                .titlePerk {
                    margin-top: 8px;
                    margin-bottom: 4px;
                    p {
                        margin: 0;
                    }
                }

                .perksInputs {
                    display: flex;
                    gap: 4px;
                }
            }

            .duo {
                .titleDuo {
                    margin-top: 8px;
                    margin-bottom: 4px;
                    p {
                        margin: 0;
                    }
                }

                .duoInputs {
                    display: flex;
                    gap: 4px;

                    > div {
                        width: 50%;
                    }
                }
            }

            .buttons {
                display: flex;
                justify-content: flex-end;
                gap: 4px;

                .warning {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    margin-right: 8px;
                    width: 100%;
                }

                button {
                    background-color: #737ad3;
                    color: white;
                    border: 0;
                    border-radius: 4px;
                    padding: 8px 32px;
                    cursor: pointer;
                }

                button:hover {
                    opacity: 0.8;
                    transition: 0.2s;
                }
            }

            .isToAdd {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                height: 100%;
                min-height: 200px;

                gap: 4px;

                button {
                    background-color: #737ad3;
                    color: white;
                    border: 0;
                    border-radius: 4px;
                    padding: 8px 32px;
                    cursor: pointer;
                }

                button:hover {
                    opacity: 0.8;
                    transition: 0.2s;
                }
            }

            .import {
                min-height: 200px;

                p {
                    margin: 0;
                }

                .titleImport {
                    padding-bottom: 8px;
                    font-weight: 600;

                    span {
                        font-weight: 500;
                        font-size: 14px;
                    }
                }

                .importList {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    margin-bottom: 8px;

                    max-height: 400px;
                    overflow: auto;

                    .itemImport {
                        width: 49.5%;
                        border: 1px solid #c7c7c7;
                        border-radius: 4px;
                        padding: 8px;

                        min-height: 80px;

                        display: flex;
                        flex-direction: column;
                        justify-content: center;

                        cursor: pointer;

                        p {
                            font-weight: 600;
                        }

                        span {
                            font-size: 14px;
                        }
                    }

                    .selected {
                        background-color: #73a2d3;
                        color: white;
                    }

                    .itemImport:hover {
                        background-color: #737ad3;
                        color: white;
                        transition: 0.2s;
                    }
                }
            }
        }

        .noClasses {
            width: 0;
            padding: 0;
        }
    }
`