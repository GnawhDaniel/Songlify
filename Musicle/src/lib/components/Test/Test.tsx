function Test() {
    var a = new Audio("https://p.scdn.co/mp3-preview/6fc68c105e091645376471727960d2ba3cd0ee01?cid=abf1ad887b154dee9a8dc0b5b217ce90")
    a.play()
    setTimeout(() => { a.pause(); }, 1000);

    return (
        <>
            <div>Token </div>
        </>
    );
}

export default Test;
