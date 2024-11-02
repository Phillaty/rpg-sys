import styled from "styled-components";

export const Container = styled.div`
    width: 800px;
    padding: 16px;
    display: flex;
    flex-direction: row-reverse;

    background: #1a1a1a;
    border-radius: 4px;

    gap: 8px;

    .campain {
        width: 50%;
        background-color: white;
        border-radius: 4px;
        overflow: hidden;

        .top {
            height: 150px;
            display: flex;
            align-items: flex-end;
            padding: 16px;
            font-size: 24px;
            background-size: 130%;
            position: relative;

            .players {
                position: absolute;
                top: 8px;
                right: 8px;
                font-size: 14px;
                background-color: #8080807a;
                padding: 4px 8px;
                border-radius: 9999px;
            }
        }

        .details{
            padding: 16px;
            color: black;

            .detailItem{

                p{
                    margin: 0;
                    margin-top: 8px;
                    font-size: 18px;
                    font-weight: 600;
                }

                .lore {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 3; /* number of lines to show */
                            line-clamp: 3; 
                    -webkit-box-orient: vertical;

                    margin-bottom: 8px;
                }
            }
            
        }
    }

    .character {
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: center;
        text-align: center;
        justify-content: center;

        background-color: white;
        border-radius: 4px;

        color: #484848;

        .createDescriptions{
            padding: 16px;

            p {
                font-size: 20px;
                font-weight: 600;
            }

            span {
                font-size: 12px;
                line-height: 0.2;
            }

            b {
                font-size: 16px;
            }

            i {
                font-size: 36px;
                margin-bottom: 8px;
                color: #55ff6b;
            }
        }

        .characterImg {
            background-color: #0000000f;
            border-radius: 99999px;
            margin: 0;
            padding: 8px;
            margin-bottom: 16px;

            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 100px;
            }
        }

        p {
            margin: 0;
        }

        .name {
            font-size: 18px;
            font-weight: 600;
        }

        .level {
            font-size: 16px;
        }

        .attributes {
            gap: 4px;
            display: flex;
            margin: 8px 0;

            .attribute {
                background-color: #c5c5c5;
                color: black;
                padding: 2px 6px;
                font-size: 14px;
                border-radius: 4px;

                .attributeNum {
                    
                }
            }
        }

        .buttons {
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
    }

    .topMobile {
        display: none !important;
        border-radius: 4px;
        position: relative;

        .players {
            position: absolute;
            top: 8px;
            right: 8px;
            font-size: 14px;
            background-color: #8080807a;
            padding: 4px 8px;
            border-radius: 9999px;
        }
    }


    @media screen and (max-width: 800px){
        flex-direction: column;
        width: 99vw;
        height: 100%;
        overflow: scroll;
        overflow-x: hidden;
        
        .campain {
            width: 100%;
            overflow: initial;
        }

        .character {
            width: 100%;
            padding: 32px 16px;
        }

        .top {
            display: none !important;
        }

        .topMobile {
            display: flex !important;
            min-height: 100px;
            align-items: flex-end;
            padding: 16px;
            font-size: 26px;
            background-size: 100%;
        }
    }
`

export const ContainerLore = styled.div`
    width: 800px;
    padding: 16px;
    display: flex;

    background: #fff;
    color: black;
    border-radius: 4px;

    gap: 8px;

    .title {
        font-weight: 600;
        font-size: 20px;
    }

    .lore {
        
    }
`