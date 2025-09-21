import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;

    background-color: #181a1b;
    color: white;
    min-height: 400px;

    > div {
       max-width: 1366px;
       width: 100%;
       padding: 8px;

       p {
        margin: 0;
       }

       .loading {
           display: flex;
           justify-content: center;
           align-items: center;
           height: 400px;
           width: 100%;
           background-color: white;
           border-radius: 4px;
       }

       .content {
            display: flex;
            justify-content: center;
            gap: 4px;
       }

       .infos {
            background-color: white;
            color: black;
            padding: 16px;
            border-radius: 4px;

            min-width: 600px;

            .infosTitle {
                font-size: 18px;
                margin-bottom: 16px;
            }

            .inputs {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .inputItem {
                .image {
                    position: relative;
                    height: 100px;
                    border: 1px dashed gray;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    input {
                        opacity: 0;
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        left: 0;
                        top: 0;

                        cursor: pointer;
                    }

                    p {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        gap: 8px;
                    }

                    .preview {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        left: 0;
                        top: 0;
                        z-index: 2;

                        img{
                            height: 90%;
                            max-width: 90%;
                            object-fit: contain;
                        }

                        button {
                            background-color: #d37373;
                            color: white;
                            border: 0;
                            border-radius: 4px;
                            padding: 8px 16px;
                            cursor: pointer;
                            margin-left: 8px;
                            font-size: 12px;
                        }

                        button:hover {
                            opacity: 0.8;
                            transition: 0.2s;
                        }
                    }
                }

                .image:hover {
                    background-color: #e7e7e7;
                }
            }

            .inputItem > div {
                width: 100%;
            }
       }

       .options {
            background-color: white;
            color: black;
            padding: 16px;
            border-radius: 4px;

            min-width: 300px;

            .optionsTitle {
                font-size: 18px;
                margin-bottom: 16px;
            }

            .optionsItens {
                display: flex;
                flex-direction: column;
                gap: 16px;
            }
       }

       .box {
        margin-top: 16px;

         .title {
            text-align: center;
            font-size: 24px;
            padding-bottom: 24px;
            font-weight: 600;
         }
       }

       .buttons {
            text-align: center;
            margin-top: 16px;
            display: flex;
            gap: 16px;
            justify-content: center;

            button {
                background-color: #737ad3;
                color: white;
                border: 0;
                border-radius: 4px;
                padding: 8px 32px;
                cursor: pointer;
                min-width: 120px;
            }

            button:hover {
                opacity: 0.8;
                transition: 0.2s;
            }

            .cancel-btn {
                background-color: #6c757d;
            }

            .cancel-btn:hover {
                background-color: #5a6268;
            }
       }
    }
`
