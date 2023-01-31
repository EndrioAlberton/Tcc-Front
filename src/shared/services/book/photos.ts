import { Photo } from '../../types/photo';  
import { storage } from './firebase';
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';
import { v4 as imageId} from 'uuid'; 

export const getAll = async () => { 
    let list: Photo [] = [];  
     
    const imagesFolder = ref(storage, "bookImage"); 
    const photoList = await listAll(imagesFolder); 
     
    for(let i in photoList.items){  
        let photoUrl = await getDownloadURL(photoList.items[i]); 

        list.push({ 
            name: photoList.items[i].name, 
            image_url: photoUrl,
        });
    }
    return list;
} 
 
export const insert = async (file: File): Promise<Photo | null> => { 
     if(['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)){   

        let randomName = imageId();  
        let newFile = ref(storage, `book_image/${randomName}`);
        let upload = await uploadBytes(newFile, file);  
        let photoUrlImage = await getDownloadURL(upload.ref) 

        return {name: upload.ref.name, image_url: photoUrlImage} as Photo;

     } else{ 
        return null;
     }
}