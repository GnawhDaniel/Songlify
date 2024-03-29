import { Playlist } from "@lib/interfaces";
import "./List.css";
import { Link } from 'react-router-dom'

interface Iprops {
    val: Playlist[];
}

function List(props: Iprops) {
    // const navigate = useNavigate();

    let items = props.val;
    if (items.length === 0) {
        return null;
    }

    return (
        <>
            <div className="playlist overflow-auto ">
                {items.map((item, index) => (
                    <div className="row " key={index}>
                        <Link to={`/playlist/${item.name.trim().replace(/\//g, '%20')}`} state={{"playlist": item, "randomNumber": Math.random()}}>
                            <img src={item.image} alt="" />
                            <div className="inner-row">
                                <div className="name">{item.name}</div>
                                <div className="owner">{item.owner}</div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
}

export default List;
