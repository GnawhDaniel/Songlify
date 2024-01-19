import { Playlist } from "@lib/interfaces";
import "./List.css";
import { useNavigate, Link } from 'react-router-dom'

interface Iprops {
    val: Playlist[];
}

function List(props: Iprops) {
    const navigate = useNavigate();

    let items = props.val;
    console.log(items);
    if (items.length === 0) {
        return <div>Type in a Spotify playlist or link</div>;
    }

    return (
        <>
            <div className="playlist overflow-auto ">
                {items.map((item, index) => (
                    <div className="row " key={index}>
                        <Link to={`/playlist/${item.name}`} state={{"playlist": item}}>
                            <img src={item.image} alt="" />
                            <div className="inner-row">
                                <div className="name fs-5">{item.name}</div>
                                <div className="owner fs-7">{item.owner}</div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </>
    );
}

export default List;
