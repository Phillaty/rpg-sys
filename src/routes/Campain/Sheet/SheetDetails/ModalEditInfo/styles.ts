import styled from "styled-components";

export const Container = styled.div`
    background-color: white;
    min-width: 500px;
    padding: 16px;
    color: #838383;

    @media (max-width: 600px) {
        min-width: 95vw;
        width: 95vw;
    }

    .title {
        font-size: 20px;
        padding: 4px 0 16px 0;
    }

    .data {
        display: flex;
        flex-direction: column;
        gap: 8px;
        border: 1px dashed transparent;

        .input {
            display: flex;
            flex-direction: column;
        }

        .image {
            position: relative;
            height: 100px;

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

                button {
                    background-color: #d37373;
                    color: white;
                    border: 0;
                    border-radius: 4px;
                    padding: 8px 32px;
                    cursor: pointer;
                    margin-left: 8px;
                }

                button:hover {
                    opacity: 0.8;
                    transition: 0.2s;
                }
            }
        }

        .noImg {
            border: 1px dashed gray;
        }

        .noImg:hover {
            background-color: #e7e7e7;
        }
    }

    .buttons {  
        height: 55px;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        button {
            float: right;
            padding: 8px 32px;
            background-color: #737ad3;
            color: white;
            border: 0;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 8px;
        }

        button:hover {
            opacity: 0.8;
            transition: 0.2s;
        }
    }
`