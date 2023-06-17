import {db,auth} from '../config';
import {signOut} from "firebase/auth";
import { collection, query, limit, orderBy, getDocs, startAfter, doc, getDoc, addDoc, setDoc, where, orWhere } from 'firebase/firestore';
import {useEffect,useState,useCallback} from 'react';
import BookContainer from './bookContainer';
import Loading from './loading';
import {Trie} from '../trie/trie';
import {dataSet} from '../filterDataset/dataset';
import './mainScreen.css';
import searchImg from '../Resources/searchIcon.png';
import logo from '../Resources/logo.png';
import cartImg from '../Resources/cart.png';
import Toast from './Toast';
import Cart from './cart';
const suggestionTrie = new Trie();
function MainScreen({updateLogIn, email})
{
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [lastDoc, setLastDoc] = useState(false);
    const [pageSize] = useState(5);
    const [selectedSortField, setSelectedSortField] = useState("");
    const [selectedSortOrder, setSelectedSortOrder] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [toastVisible,setToastVisible] = useState(false);
    const [toastMessage,setToastMessage] = useState("");
    const [cartVisibility,setCartVisibility] = useState(false);

    const fetchData = async (sortBy, sortOrder, isSearched) => {
        setLoading(true);
        const collectionRef = collection(db, 'book');
        let q;
        if (isSearched) {
            try {
                const authorQuery = query(collectionRef, where("author_name", "==", searchValue));
                const bookQuery = query(collectionRef, where("book_name", "==", searchValue));
                const genreQuery = query(collectionRef, where("genre", "==", searchValue));
            
                const [authorSnapshot, bookSnapshot, genreSnapshot] = await Promise.all([
                  getDocs(authorQuery),
                  getDocs(bookQuery),
                  getDocs(genreQuery)
                ]);
            
                const authorData = authorSnapshot.docs.map((doc) => doc.data());
                const bookData = bookSnapshot.docs.map((doc) => doc.data());
                const genreData = genreSnapshot.docs.map((doc) => doc.data());
            
                const mergedData = [...authorData, ...bookData, ...genreData];
                setData(mergedData);
                setLoading(false);
            
              } catch (error) {
                changeToastVisibility("Error: Cannot Load Data");
                setLoading(false);
              }
        }
        else
        {
        q = query(collectionRef, limit(pageSize));
        if (sortBy!=="" && sortOrder!==""&&!lastDoc) {
            q = query(collectionRef, orderBy(sortBy, sortOrder), limit(pageSize));
        }
        if (lastDoc) {
            if(!isSearched)
            {
                if(sortBy!=="" && sortOrder!=="")
                    q = query(collectionRef, orderBy(sortBy, sortOrder), startAfter(lastDoc), limit(pageSize));
                else
                    q = query(collectionRef, startAfter(lastDoc), limit(pageSize));
            }
        }
        try {
          const querySnapshot = await getDocs(q);
          const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
          setLastDoc(lastVisible);
          const newData = querySnapshot.docs.map((doc) => doc.data());
          setData((prevData) => [...prevData, ...newData]);
          setHasMore(querySnapshot.size >= pageSize);
          setLoading(false);
        }
        catch (error) {
          changeToastVisibility("Error Can Not Load Data");
          setLoading(false);
        }
    }
    };

    const addToCart = async (book) => {
        setLoading(true);
        const collectionRef = collection(db, 'cart');
        const docRef = doc(collectionRef, email);
        const booksCollectionRef = collection(docRef, 'books');
      
        try {
          const docSnapshot = await getDoc(docRef);
      
          if (docSnapshot.exists()) {
            await addDoc(booksCollectionRef, book);
          } else {
            await setDoc(docRef, {});
            await addDoc(booksCollectionRef, book);
          }
          changeToastVisibility("Book Added To Cart Successfully");
        } catch (error) {
          changeToastVisibility("Error: Can Not Add Book To Cart");
        }
        setLoading(false);
      };
      
    useEffect(() => {
        if(data.length===0)
        fetchData(selectedSortField,selectedSortOrder,false);
      }, [selectedSortField,selectedSortOrder,searchValue]);

    useEffect(() => {
        dataSet.map((data) => {
            suggestionTrie.insert(data.author_name);
            suggestionTrie.insert(data.book_name);
            suggestionTrie.insert(data.genre);
        })
    },[]);

    useEffect(() => {
        const handleScroll = () => {
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;
        const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
        if (scrolledToBottom && !loading && hasMore) {
                fetchData(selectedSortField,selectedSortOrder,false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, [ loading, hasMore]);

      const handleSortFieldChange=(event)=>{
        setSelectedSortField(event.target.value);
        if(selectedSortOrder==="")
        {
            setSelectedSortOrder('asc');
        }
        setLastDoc(false);
        setData([]);
      }

      const handleSortOrderChange = (event) => {
        setSelectedSortOrder(event.target.value);
        setLastDoc(false);
        setData([]);
      };

      const searchTextHandler = (event) => {
        setSearchValue(event.target.value);
        const tempSuggestion = suggestionTrie.find(event.target.value);
        setSuggestions(tempSuggestion);
      }

      const searchBlur = () => {
        setSuggestions([]);
      }

      const handleLogout = () => {
        signOut(auth)
          .then(() => {
            updateLogIn(false);
          })
          .catch((error) => {
            console.error('Logout error:', error);
          });
      };
      
      const searchHandler = () => {
        setData([]);
        setSelectedSortField("");
        setSelectedSortOrder("");
        fetchData(selectedSortField,selectedSortOrder,true);
      }

      const cartOpener = () => {
        setSelectedSortField("");
        setSelectedSortOrder("");
        setData([]);
        fetchData(selectedSortField,selectedSortOrder,false);
        setCartVisibility(val => !val);
      };

      const changeToastVisibility= (msg) => {
        if(!toastVisible)
        {
            setToastMessage(msg);
            setToastVisible(true);
            setTimeout(()=>{
                setToastVisible(false);
            },2000);
        }
      }

      const changeLoadingStatus= () => {
        setLoading(value => !value);
      }
      
    return(
        <div class="mainScreen">
            {toastVisible&&<Toast msg={toastMessage}/>}
            {cartVisibility&&<Cart cartOpener={cartOpener} changeToastVisibility={changeToastVisibility} changeLoadingStatus={changeLoadingStatus}  email={email} />}
            <div class="header">
                <img src={logo} class="logo" />
                <button class="cartButtonHeader" onClick={cartOpener}><img src={cartImg} class="cartImgHeader"/></button>
                <button class="logout" onClick={handleLogout}>Logout</button>
            </div>
            <div class="searchHolder">
                <div class="searchContainer">
                    <div class="searchBoxContainer">
                        <input class="searchBox" type="text" placeHolder="Search" onChange={searchTextHandler} onBlur={searchBlur} value={searchValue} ></input>
                        <img src={searchImg} class="searchImg" onClick={searchHandler} />
                    </div>
                    <div class="suggestionBox">
                        {suggestions.map((suggestionValue) => {
                            return(<div class="suggestion">{suggestionValue}</div>);
                        })}
                    </div>
                </div>
            </div>
            <div class='filterHolder'>
                <select id="sortField" value={selectedSortField} onChange={handleSortFieldChange}>
                    <option value="">Filter</option>
                    <option value="book_name">Title</option>
                    <option value="author_name">Author</option>
                    <option value="genre">Genre</option>
                    <option value="publish_date">Year</option>
                </select>
                <select id="sortType" value={selectedSortOrder} onChange={handleSortOrderChange}>
                    <option value="">Order</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
            <div class="bookHolder">
                {data.map((data)=>{
                    return(<BookContainer data={data} addToCart={addToCart} />)
                })}
            </div>
            {loading&&<Loading />}
        </div>
    );
}
export default MainScreen;