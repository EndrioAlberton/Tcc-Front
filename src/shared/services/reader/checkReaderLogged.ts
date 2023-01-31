export function checkReaderPermission(){    
     
    const storageReaderId = localStorage.getItem("loginReaderId")  
    
    return storageReaderId;
  }  