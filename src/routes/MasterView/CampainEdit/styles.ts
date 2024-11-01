import styled from "styled-components";

export const Container = styled.div`

    display: flex;
    align-items: flex-start;
    justify-content: center;

    background-color: #181a1b;
    min-height: calc(100vh - 105px);
    max-height: calc(100vh - 105px);
    color: #d3d3d3;

    > div {
       max-width: 1366px;
       width: 100%;
       padding: 8px;
       margin-top: 24px;

       display: flex;
       gap: 8px;

       h1 {
        margin-bottom: 8px;
       }

       p {
        margin: 0;
       }

       .title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 16px;
       }


       .left {
            background-color: white;
            color: black;
            padding: 16px;
            width: 20%;
            border-radius: 4px;

            .options {
                display: flex;
                flex-direction: column;
                gap: 8px;

                button {
                    background-color: #737ad3;
                    color: white;
                    border: 0;
                    border-radius: 4px;
                    padding: 8px 0;
                    cursor: pointer;
                }

                button:hover {
                    opacity: 0.8;
                    transition: 0.2s;
                }
            }
       }

       .center {
            background-color: white;
            color: black;
            padding: 16px;
            width: 55%;
            border-radius: 4px;

            .alerts {
                margin-bottom: 8px;
            }

            .configurations {
                .options {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 16px;

                    .titleConfig {
                        font-weight: 600;
                        padding: 0px 0 8px 0;
                    }

                    .listConfig {
                        display: flex;
                        gap: 8px;
                        
                        .box {
                            width: 32.6%;
                            border: 1px solid #cbcbcb;
                            border-radius: 4px;
                            padding: 8px;

                            display: flex;
                            flex-direction: column;

                            > div:first-child {
                                display: flex;
                                justify-content: space-between;
                                align-items: center;

                                .name {
                                    font-size: 18px;
                                }

                                .quantity {
                                    font-size: 14px;
                                }
                            }

                            > div:last-child {
                                padding-top: 8px;
                                button {
                                    width: 100%;
                                    background-color: #737ad3;
                                    color: white;
                                    border: 0;
                                    border-radius: 4px;
                                    padding: 8px 0;
                                    cursor: pointer;
                                }

                                button:hover {
                                    opacity: 0.8;
                                    transition: 0.2s;
                                }
                            }
                        }
                    }
                }
            }
       }

       .right {
            background-color: white;
            color: black;
            padding: 16px;
            width: 25%;
            border-radius: 4px;

            .charList {
                display: flex;
                flex-direction: column;
                gap: 8px;
                max-height: 70vh;
                overflow: auto;

                .item {
                    display: flex;
                    padding: 16px;
                    border: 1px solid #cbcbcb;
                    border-radius: 4px;

                    .img {
                        display: flex;
                        align-items: center;
                    }

                    .option {
                        padding: 0 0 0 8px;
                        display: flex;
                        align-items: flex-start;
                        justify-content: center;
                        flex-direction: column;
                        gap: 4px;

                        p {
                            font-size: 14px;
                        }

                        .name {
                            font-weight: 600;
                            font-size: 16px;
                        }

                        .buttons {
                            display: flex;
                            gap: 4px;
                        }

                        button {
                            background-color: #737ad3;
                            color: white;
                            border: 0;
                            border-radius: 4px;
                            padding: 4px 8px;
                            cursor: pointer;
                        }

                        button:hover {
                            opacity: 0.8;
                            transition: 0.2s;
                        }
                    }
                }
            }
       }
    }
`