// import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { cards } from "./consts";
import { useState } from "react";

function App() {
  const [isShuffled, setIsShuffled] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const getRandomCard = async () => {
    const url = "https://tarotapi.dev/api/v1/cards/random?n=1";
    return await fetch(url).then((response) => response.json());
  };

  const { data, error, isFetched, isError, isLoading, refetch } = useQuery({
    queryKey: ["getRandomCard"],
    queryFn: getRandomCard,
    enabled: false,
  });

  const cardSrc = `https://ucarecdn.com/${cards.find((card) => card.name_short === data?.cards[0].name_short)?.id}/-/preview/580x1000/`;
  const shuffleTrackerCard = document.getElementById("animated-shuffle");

  const handleClick = () => {
    refetch();
    setIsShuffled(true);
  };

  // add flip card animation
  // add reversed cards
  // change meta, fauvicon
  // подумать про загрузку картинки?
  // big text on top as a modal window - maybe only for small screens

  // в конце пройтись и всё почистить!

  const renderDivinationText = () => (
    <>
      <div className="flex flex-col gap-4 pt-10 max-w-2xl lg:max-w-5xl">
        <h2 className="text-textMain text-2xl md:text-3xl lg:text-4xl text-center">
          {data.cards[0].name}
        </h2>

        <p className="text-textMain text-lg md:text-xl lg:text-2xl font-light text-center">
          {data.cards[0].meaning_up}
        </p>
      </div>
    </>
  );

  shuffleTrackerCard?.addEventListener("animationend", () => {
    setTimeout(() => {
      setIsFlipped(true);
    }, 1000);
  });

  return (
    <div className="flex flex-col justify-center items-center gap-4 p-9 pt-12 w-full">
      <h1 className="text-center text-textMain text-3xl md:text-4xl lg:text-6xl">
        Your card of the day
      </h1>
      <p className="text-center text-textMain text-xl md:text-2xl lg:text-3xl font-light">
        Click on the deck to shuffle and get your daily Tarot reading
      </p>
      <div className="relative md:mt-6 flex flex-col items-center">
        <button type="button" onClick={handleClick}>
          <div className="relative">
            <img
              src="/back.jpeg"
              alt=""
              className={`relative rounded-3xl max-h-80 md:max-h-96 lg:max-h-[468px] shadow-sm  ${isShuffled ? " animate-shuffle ease-in-out delay-0 duration-500 z-[2]" : "z-[6]"}`}
              style={{
                animationDelay: "0s",
                transition: "z-index 0s ease-in-out 0.5s",
              }}
            />
            <img
              src="/back.jpeg"
              alt=""
              className={`absolute top-0 left-0 rounded-3xl  max-h-80 md:max-h-96 lg:max-h-[468px] shadow-sm mt-2 ${isShuffled ? "animate-shuffle ease-in-out delay-1000 duration-500 z-[1]" : "z-[5]"}`}
              style={{
                animationDelay: "1s",
                transition: "z-index 0s ease-in-out 1.5s",
              }}
            />
            <img
              src="/back.jpeg"
              alt=""
              id="animated-shuffle"
              className={`absolute top-0 left-0 rounded-3xl  max-h-80 md:max-h-96 lg:max-h-[468px] shadow-sm mt-3 ${isShuffled ? "animate-shuffle ease-in-out delay-2000 duration-500 z-0" : "z-[4]"}`}
              style={{
                animationDelay: "2s",
                transition: "z-index 0s ease-in-out 2.5s",
              }}
            />
            <div
              className="absolute inset-0 w-full h-full transition-transform ease-in-out delay-100 duration-500 [transformStyle:preserve-3d] z-[3] "
              style={{
                transform: isFlipped ? "rotateY( 180deg )" : "rotateY(0)",
              }}
            >
              <img
                src="/back.jpeg"
                alt=""
                className="absolute top-0 left-0 rounded-3xl  max-h-80 md:max-h-96 lg:max-h-[468px] shadow-xl  [backfaceVisibility:hidden]"
              />
              {isFetched && (
                <img
                  src={cardSrc}
                  alt=""
                  className="absolute top-0 left-0 rounded-3xl max-h-80 md:max-h-96 lg:max-h-[468px] shadow-xl [backfaceVisibility:hidden] [transform:rotateY(180deg)]"
                />
              )}
            </div>
            <img
              src="/back.jpeg"
              alt=""
              className="absolute top-0 left-0 rounded-3xl  max-h-80 md:max-h-96 lg:max-h-[468px] shadow-[4px_8px_12px_4px_rgba(0,0,0,0.5)] mt-4 z-[-1]"
            />
          </div>
        </button>
        {isLoading && (
          <p className="text-textMain text-center pt-8">
            Getting your daily divination...
          </p>
        )}
        {/* {isError && <p>Error: {error}</p>} */}
        {data && isFlipped && renderDivinationText()}
      </div>
    </div>
  );
}

export default App;
