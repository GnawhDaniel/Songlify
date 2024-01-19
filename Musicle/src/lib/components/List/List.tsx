import {Playlist} from "@lib/interfaces";
import "./List.css"

interface Iprops {
    val: Playlist[]
}

function List(props: Iprops) {
    let items = props.val
    console.log(items)
    if (items.length === 0) {
        return (<div>Type in a Spotify playlist or link</div>)
    }

    return (
        <>
            <div className="playlist overflow-auto ">
                {items.map((item, index) => (
                    <div className="row " key={index}>
                        <a href="">
                            <img src={item.image} alt="" />
                            <div className="inner-row">
                                <div className="name fs-5">{item.name}</div>
                                <div className="owner fs-7">{item.owner}</div>  
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </>
    );
}

export default List;
