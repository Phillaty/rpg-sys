import styled, { keyframes } from "styled-components";

const fadeInScale = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

export const ModalContainer = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    background-color: #00000087;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    animation: 0.2s ${fadeIn} forwards;

    > div {
      padding: 0;
      margin: 0;
      display: flex;
      position: relative;
      cursor: auto;

      animation: 0.2s ${fadeInScale} forwards;
    }

    .close {
      position: absolute;
      top: -30px;
      right: 0;
      cursor: pointer;
    }

    @media screen and (max-width: 800px){
      
      .close {
        font-size: 28px;
        position: initial;
        width: 100%;
        text-align: right;
      }
      
      > div {
        height: 90vh;
        display: flex;
        flex-direction: column;
        
      }
    }
`