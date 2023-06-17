import {useEffect,useState} from 'react';
import { collection, doc, getDoc, getDocs} from 'firebase/firestore';
import closeImg from '../Resources/close.png';
import {db} from '../config';
import './cart.css';
import CartBookContainer from './cartBookContainer';

function Cart({cartOpener,changeToastVisibility,changeLoadingStatus,email})
{
    const [cartList,setCartList] = useState([]);

    const fetchCart = async () => {
        changeLoadingStatus();
        const collectionRef = collection(db, 'cart');
        const docRef = doc(collectionRef, email);
        const booksCollectionRef = collection(docRef, 'books');
        try {
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                const booksQuerySnapshot = await getDocs(booksCollectionRef);
                const booksData = booksQuerySnapshot.docs.map((doc) => {
                    const element={id:doc.id,...doc.data()};
                    return(element);
                });
                console.log(booksData);
                setCartList(booksData);
              }
            changeLoadingStatus();
        }
        catch (error) {
          changeToastVisibility("Error Can Not Load Cart Data");
          changeLoadingStatus();
        }
    };

    useEffect(() => {
        fetchCart();
    },[]);

    const closeButtonHandler = () => {
        cartOpener();
    }

    return(
        <div class="cartWindow">
            <div class="cartContainer">
                <div class="cartHeader"><button class="closeButton" onClick={closeButtonHandler}><img class="closeImg" src={closeImg} /></button></div>
                <div class="cartData">
                    {cartList.map(data => {return(<CartBookContainer changeLoadingStatus={changeLoadingStatus} data={data} email={email} changeToastVisibility={changeToastVisibility} fetchCart={fetchCart} />)})}
                </div>
            </div>
        </div>
    );
}
export default Cart;