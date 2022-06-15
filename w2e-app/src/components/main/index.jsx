import Words from "./words.json";

const Main = () => {
    return (
        <>
            <div className="text">
                {Words.map((word) => (
                    <p>{word.name}</p>
                ))}
            </div>
            <div className="input-word">

            </div>

        </>
    );
}

export default Main;