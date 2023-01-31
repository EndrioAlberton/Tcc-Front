export function checkLibraryPermission(id: string){    
     
    const storageLibraryId = localStorage.getItem("loginLibraryId")  
     
    return id === storageLibraryId;
  }  