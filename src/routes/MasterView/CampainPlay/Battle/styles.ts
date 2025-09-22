import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
    padding: 16px;
    background-color: #212121;
    border-radius: 4px;

    .head {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        flex-wrap: wrap;

        button {
            background-color: #737ad3;
            color: white;
            border: 0;
            border-radius: 4px;
            padding: 8px 16px;
            cursor: pointer;
            font-size: 14px;
            
            &:hover {
                opacity: 0.8;
                transition: 0.2s;
            }
        }
    }

    .body {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;

        .rollPers {
            background-color: #333;
            padding: 16px;
            border-radius: 4px;
            min-width: 300px;
            flex: 1;

            .title {
                margin-bottom: 16px;
                
                p {
                    font-weight: 600;
                    font-size: 16px;
                    margin: 0;
                    color: white;
                }
            }

            .buttons {
                display: flex;
                flex-direction: column;
                gap: 8px;
                margin-bottom: 16px;

                p {
                    color: white;
                    margin: 0;
                    font-size: 14px;
                }

                > div {
                    display: flex;
                    gap: 4px;
                    flex-wrap: wrap;

                    button {
                        background-color: #555;
                        color: white;
                        border: 0;
                        border-radius: 4px;
                        padding: 4px 8px;
                        cursor: pointer;
                        font-size: 12px;

                        &:hover {
                            background-color: #666;
                        }
                    }
                }
            }

            .preVisuTitle {
                p {
                    color: white;
                    font-weight: 600;
                    margin: 16px 0 8px 0;
                }
            }

            .preVisuMod {
                .dicesPerMod {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                    flex-wrap: wrap;

                    p {
                        color: white;
                        margin: 0;
                        font-size: 14px;
                    }

                    > div {
                        display: flex;
                        align-items: center;
                        background-color: #ff9800;
                        border-radius: 4px;
                        padding: 4px 8px;
                        cursor: pointer;

                        .diceitem {
                            color: white;
                            font-weight: 600;
                            font-size: 12px;
                        }

                        .error {
                            margin-left: 4px;
                            color: #f44336;
                        }

                        &:hover {
                            background-color: #f57c00;
                        }
                    }
                }
            }

            .preVisu {
                display: flex;
                align-items: center;
                gap: 8px;

                .dicesPer {
                    display: flex;
                    gap: 4px;
                    flex-wrap: wrap;

                    > div {
                        display: flex;
                        align-items: center;
                        background-color: #4caf50;
                        border-radius: 4px;
                        padding: 4px 8px;
                        cursor: pointer;

                        .diceitem {
                            color: white;
                            font-weight: 600;
                            font-size: 12px;
                        }

                        .error {
                            margin-left: 4px;
                            color: #f44336;
                        }

                        &:hover {
                            background-color: #45a049;
                        }
                    }
                }

                button {
                    background-color: #2196f3;
                    color: white;
                    border: 0;
                    border-radius: 4px;
                    padding: 8px 16px;
                    cursor: pointer;

                    &:hover {
                        background-color: #1976d2;
                    }
                }
            }
        }

        .game {
            flex: 2;
            min-width: 400px;

            .onThePlay {
                margin-bottom: 16px;

                .top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    padding: 8px;
                    background-color: #333;
                    border-radius: 4px;

                    p {
                        color: white;
                        font-weight: 600;
                        margin: 0;
                    }

                    div {
                        display: flex;
                        gap: 8px;

                        button {
                            background-color: #737ad3;
                            color: white;
                            border: 0;
                            border-radius: 4px;
                            padding: 4px 8px;
                            cursor: pointer;
                            font-size: 12px;

                            &:hover {
                                opacity: 0.8;
                            }
                        }
                    }
                }

                .item {
                    border: 1px solid #ffe9b8 !important;
                    background-color: #ffe9b8;
                    color: black;
                    font-weight: 600;
                    padding: 16px;
                    border-radius: 4px;
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;

                    .img {
                        flex-shrink: 0;
                    }

                    .info {
                        flex: 1;

                        p {
                            margin: 4px 0;
                            font-size: 14px;

                            &.bold {
                                font-weight: 600;
                                font-size: 16px;
                            }
                        }

                        .habilities {
                            display: flex;
                            gap: 4px;
                            flex-wrap: wrap;
                            margin-top: 8px;

                            .actionItem {
                                background-color: #5755bd;
                                color: white;
                                padding: 4px 8px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;

                                &:hover {
                                    opacity: 0.8;
                                }
                            }
                        }

                        button {
                            background-color: #f44336;
                            color: white;
                            border: 0;
                            border-radius: 4px;
                            padding: 4px 8px;
                            cursor: pointer;
                            font-size: 12px;
                            margin-top: 8px;

                            &:hover {
                                background-color: #d32f2f;
                            }
                        }
                    }
                }
            }

            .onTheWait {
                .top {
                    padding: 8px;
                    background-color: #333;
                    border-radius: 4px;
                    margin-bottom: 8px;

                    p {
                        color: white;
                        font-weight: 600;
                        margin: 0;
                    }
                }

                .item {
                    background-color: #444;
                    color: white;
                    padding: 16px;
                    border-radius: 4px;
                    margin-bottom: 8px;
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;

                    .img {
                        flex-shrink: 0;
                    }

                    .info {
                        flex: 1;

                        p {
                            margin: 4px 0;
                            font-size: 14px;

                            &.bold {
                                font-weight: 600;
                                font-size: 16px;
                            }
                        }

                        .habilities {
                            display: flex;
                            gap: 4px;
                            flex-wrap: wrap;
                            margin-top: 8px;

                            .actionItem {
                                background-color: #5755bd;
                                color: white;
                                padding: 4px 8px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;

                                &:hover {
                                    opacity: 0.8;
                                }
                            }
                        }

                        button {
                            background-color: #f44336;
                            color: white;
                            border: 0;
                            border-radius: 4px;
                            padding: 4px 8px;
                            cursor: pointer;
                            font-size: 12px;
                            margin-top: 8px;

                            &:hover {
                                background-color: #d32f2f;
                            }
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        .body {
            flex-direction: column;
        }

        .rollPers {
            min-width: auto !important;
        }

        .game {
            min-width: auto !important;
        }
    }
`;