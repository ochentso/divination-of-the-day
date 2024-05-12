import { useQuery } from "@tanstack/react-query";
import { cards } from "./consts";
import { useEffect, useState } from "react";
import { isEqual, isToday, set } from "date-fns";
import { createPortal } from "react-dom";
import HintModal from "./components/HintModal";

const getRandomCard = async () => {
  const url = "https://tarotapi.dev/api/v1/cards/random?n=1";
  return await fetch(url).then((response) => response.json());
};

function App() {
  const { data, error, isFetched, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ["getRandomCard"],
    queryFn: getRandomCard,
    enabled: false,
  });

  let divinationExists = false;
  const divination = localStorage.getItem("divination");
  const parsedDivination = divination ? JSON.parse(divination) : null;
  let cardSrc = `https://ucarecdn.com/${cards.find((card) => card.name_short === data?.cards[0].name_short)?.id}/-/preview/580x1000/`;

  if (divination) {
    if (isToday(parsedDivination.date)) {
      // if (isEqual(parsedDivination.date, Date.now())) {
      divinationExists = true;
      cardSrc = `https://ucarecdn.com/${cards.find((card) => card.name_short === parsedDivination.cardNameShort)?.id}/-/preview/580x1000/`;
    }
  }
  const [isShuffled, setIsShuffled] = useState(false);
  const [isFlipped, setIsFlipped] = useState(divinationExists ? true : false);
  const [isReversed, setIsReversed] = useState(
    divinationExists ? parsedDivination.isReversed : false,
  );
  const [isHintOpen, setIsHintOpen] = useState(false);

  const [canMakePrediction, setCanMakePrediction] = useState(
    divinationExists ? false : true,
  );

  const shuffleTrackerCard = document.getElementById("animated-shuffle");

  const handleClick = () => {
    if (divinationExists) {
      setIsHintOpen(true);
    } else {
      refetch().then(() => {
        setIsShuffled(true);
      });
    }
  };

  // to test:
  // 1) ls empty - open app, click -> shuffle, fetch, flip, card+text -> all correctly written in ls
  // 2) ls not empty, date is today - divination on page load, modal hint on click with no refethcing
  // 3) ls not empty, date is not today - no divination on page load, shuffle+flip and new divination work as expected
  // 4) what happens if I open the app at 23:59 and wait for a new day to come?
  // если в 23:59 уже есть открытая карта, в 12 автоматически не обновится (пока не будет ререндера); но если кликнуть на карту - появится новое предсказание (НО без анимаций - исправить? low prio!)

  // change meta, fauvicon
  // footer with contacts
  // text animation
  // flip animation on page load
  // big text on top as a modal window - maybe only for small screens?
  // error handling, loading message
  // background pattern?

  // в конце пройтись и всё почистить!

  const renderDivinationText = () => {
    return (
      <>
        <div className="flex flex-col gap-4 pt-10 max-w-2xl lg:max-w-5xl">
          <h2 className="text-textMain text-2xl md:text-3xl lg:text-4xl text-center">
            {isReversed
              ? `${data.cards[0].name} (reversed)`
              : `${data.cards[0].name}`}
          </h2>

          <p className="text-textMain text-lg md:text-xl lg:text-2xl font-light text-center">
            {isReversed ? data.cards[0].meaning_rev : data.cards[0].meaning_up}
          </p>
        </div>
      </>
    );
  };

  const renderExistingDivination = () => {
    const existingDivination = JSON.parse(
      localStorage.getItem("divination") as string,
    );
    console.log("render existing, reversed", isReversed);
    return (
      <>
        <div className="flex flex-col gap-4 pt-10 max-w-2xl lg:max-w-5xl">
          <h2 className="text-textMain text-2xl md:text-3xl lg:text-4xl text-center">
            {existingDivination.isReversed
              ? `${existingDivination.cardOfTheDay} (reversed)`
              : `${existingDivination.cardOfTheDay}`}
          </h2>

          <p className="text-textMain text-lg md:text-xl lg:text-2xl font-light text-center">
            {existingDivination.meaning}
          </p>
        </div>
      </>
    );
  };

  shuffleTrackerCard?.addEventListener("animationend", () => {
    setTimeout(() => {
      setIsFlipped(true);
    }, 1000);
    setTimeout(() => {
      setCanMakePrediction(false);
    }, 1200);
  });

  useEffect(() => {
    if (data) {
      const randomReversed =
        (Math.round(Math.random() + 1) + data?.cards[0].value_int) % 2 === 0;
      setIsReversed(randomReversed);
      console.log("reversed", isReversed);

      const meaning = randomReversed
        ? data.cards[0].meaning_rev
        : data.cards[0].meaning_up;
      const divination = {
        cardOfTheDay: data?.cards[0].name,
        cardNameShort: data?.cards[0].name_short,
        meaning: meaning,
        isReversed: randomReversed,
        date: Date.now(),
      };

      localStorage.setItem("divination", JSON.stringify(divination));
    }
  }, [data]);

  return (
    <div className="flex flex-col justify-center items-center gap-3 p-9 pt-12 w-full">
      <h1 className="text-center text-textMain text-3xl md:text-4xl lg:text-6xl ">
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
                zIndex: !canMakePrediction ? 7 : 3,
              }}
            >
              <img
                src="/back.jpeg"
                alt=""
                className="absolute top-0 left-0 rounded-3xl  max-h-80 md:max-h-96 lg:max-h-[468px] shadow-xl  [backfaceVisibility:hidden]"
              />
              {(isFetched || divinationExists) && (
                <img
                  src={cardSrc}
                  alt=""
                  id="cardSrc"
                  className="absolute top-0 left-0 rounded-3xl max-h-80 md:max-h-96 lg:max-h-[468px] shadow-xl [backfaceVisibility:hidden] [transform:rotateY(180deg)]"
                  style={{
                    transform: isReversed ? "rotateX( 180deg )" : "",
                  }}
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
        {isHintOpen &&
          createPortal(
            <HintModal onClose={() => setIsHintOpen(false)} />,
            document.body,
          )}
        {isLoading && (
          <p className="text-textMain text-center pt-8">
            Getting your daily divination...
          </p>
        )}
        {/* {isError && <p>Error: {error}</p>} */}
        {data && isFlipped && renderDivinationText()}
        {!data && divinationExists && renderExistingDivination()}
      </div>
    </div>
  );
}

export default App;
