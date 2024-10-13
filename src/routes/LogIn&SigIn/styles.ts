import styled from "styled-components";


export const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    overflow: hidden;

    background-color: #343493;
    color: white;
    > div {
        max-width: 380px;
        padding: 16px;
        z-index: 9999;
        backdrop-filter: blur(15px);

        .description {
            color: #dfdfdf;
            width: 100%;
        }

        .info {
            width: 100%;
            max-width: 380px;
            text-align: center;
            margin-top: 16px;
            color: #7ae3fb;
            font-size: 14px;
        }

        .input {
            width: 100%;
            input {
                width: 100%;
                border: 0;
                border-radius: 4px;
                height: 28px;
                margin-bottom: 4px;
                outline: none;

                padding: 5px;
                -webkit-box-sizing: border-box;
                -moz-box-sizing: border-box;
                box-sizing: border-box;
            }
            
            p {
                margin: 8px 0 8px 0;
            }
        }

        .button{
            width: 100%;
            height: 40px;
            border: 0;
            border-radius: 4px;
            margin-top: 16px;
            background: #2d2d2d;
            color: white;
            cursor: pointer;

            :hover {
                
            }
        }

        .button:hover {
            transition: 0.2s;
            background: #3f3f3f;
        }
    }

    .bkgroundSnip1{
        position: fixed;
        bottom: -56%;
        right: 0%;
        pointer-events: none;
    }

    .bkgroundSnip2{
        position: fixed;
        top: -50%;
        left: -1%;
        pointer-events: none;
    }
`