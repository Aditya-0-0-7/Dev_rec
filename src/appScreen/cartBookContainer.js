import bookImg from '../Resources/book.png'
import './cartBookContainer.css';
import {db} from '../config';
import { collection, doc, updateDoc, getDoc} from 'firebase/firestore';
function CartBookContainer({data,email,changeToastVisibility,changeLoadingStatus,fetchCart})
{
    console.log(data);
    const rentBook = async (id,email,value,number,ids) => {
        changeLoadingStatus();
        const collectionRef = collection(db, 'cart');
        const docRef = doc(collectionRef, email, 'books', id);
        const collectionRef1 = collection(db, 'book');
        const docRef1 = doc(collectionRef1, `${ids}`);
      
        try {
            const bookSnapshot = await getDoc(docRef);
            const bookData = bookSnapshot.data();
            const updatedNumberOfCopies = bookData.number_of_copies - number;
            if(updatedNumberOfCopies>0)
            {
            await updateDoc(docRef, { Rent: value,number_of_copies: updatedNumberOfCopies });
            await updateDoc(docRef1, {number_of_copies: updatedNumberOfCopies });
            if(number===1)
            changeToastVisibility("Book Rented Successfully");
            else
            changeToastVisibility("Book Returned Successfully");
            }
            else
            {
                changeToastVisibility("No Book to Rent");
            }
            changeLoadingStatus();
            fetchCart();
        } catch (error) {
          changeLoadingStatus();
          if(number===-1)
          changeToastVisibility("Error: Cannot Rent Book");
          else
          changeToastVisibility("Error: Cannot Return Book");
          console.log(error);
        }
      };

    return(
        <div class="bookContainer1">
        <img class="bookImg1" src={bookImg} alt="book image" />
        <div class="bookInfo1">
            <div>Title : {data.book_name}</div>
            <div>Author : {data.author_name}</div>
            <div>Genre : {data.genre}</div>
            <div>Publish Date : {data.publish_date}</div>
            <div>Number Of Copies : {data.number_of_copies}</div>
        </div>
        {'Rent' in data && data.Rent?<div class="cartActionButton" onClick={()=>{rentBook(data.id,email,false,-1,data.ids)}}>Return</div>
        :<div class="cartActionButton" onClick={()=>{rentBook(data.id,email,true,1,data.ids)}}>Rent</div>
         }
    </div>
    );
}
export default CartBookContainer;