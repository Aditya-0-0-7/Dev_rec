import bookImg from '../Resources/book.png';
import './bookContainer.css';
import cartImg from '../Resources/cart.png';
function BookContainer({data,addToCart})
{
    return(<div class="bookContainer">
        <img class="bookImg" src={bookImg} alt="book image" />
        <div class="bookInfo">
            <div>Title : {data.book_name}</div>
            <div>Author : {data.author_name}</div>
            <div>Genre : {data.genre}</div>
            <div>Publish Date : {data.publish_date}</div>
            <div>Number Of Copies : {data.number_of_copies}</div>
        </div>
        <div class="cartButton" onClick={()=>{addToCart(data)}}><img src={cartImg} class="cartImgBook"/><div class="bookCart">Add to cart</div></div>
    </div>);
}
export default BookContainer;