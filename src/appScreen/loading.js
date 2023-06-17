import gifImage from '../Resources/load.gif';
import './loading.css';
function Loading()
{
    return(<div class="loading"><img class='loadingImage' src={gifImage} alt="loading..." /></div>);
}
export default Loading;