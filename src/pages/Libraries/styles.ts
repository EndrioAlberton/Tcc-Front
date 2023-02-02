import styled from "styled-components";

export const LibraryHeader = styled.div ` 
 
    width: 100%; 
    display: flex; 
    flex-direction: row; 
    justify-content: space-between; 
    margin-top: 2%;
    padding: 0;
` 
 
export const Title = styled.div ` 
 
    width: 100%; 
    display: flex; 
    flex-direction: row; 
    justify-content: space-between; 
    margin-top: 2%;
`
export const Error = styled.small`
    width: 100%;
    font-size: 0.75rem;
    color: #842029;
    background-color: #f5c2c7;
    border-radius: 5px;  
    border-color: #842029; 
    padding: 0px 1% 0px 1%;
    margin-top: 1%; 

`
export const ContainerReader = styled.div`
  width: 100vw;
  flex-direction: column;
  background: url("../../../public/reader.png")!important;
  object-fit: fill;
`;
;