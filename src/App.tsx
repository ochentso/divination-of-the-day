import { useQuery } from "@tanstack/react-query";
import { cards } from "./consts";
import { useEffect, useState } from "react";
import { isToday } from "date-fns";
import { createPortal } from "react-dom";
import HintModal from "./components/HintModal";
import DetailsModal from "./components/DetailsModal";
import { MailIcon } from "./components/MailIcon";
import { LinkIcon } from "./components/LinkIcon";
import back from "./assets/back.jpeg";

const getRandomCard = async () => {
  const url = "https://tarotapi.dev/api/v1/cards/random?n=1";
  return await fetch(url).then((response) => response.json());
};

function App() {
  const { data, isFetched, refetch } = useQuery({
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
      // const oneMinutesFromNow = parsedDivination.date + 6000;
      // if (isBefore(Date.now(), oneMinutesFromNow)) {

      divinationExists = true;
      cardSrc = `https://ucarecdn.com/${cards.find((card) => card.name_short === parsedDivination.cardNameShort)?.id}/-/preview/580x1000/`;
    } else {
      localStorage.removeItem("divination");
      window.location.reload();
    }
  }
  const [isShuffled, setIsShuffled] = useState(false);
  const [isFlipped, setIsFlipped] = useState(divinationExists ? true : false);
  const [isReversed, setIsReversed] = useState(
    divinationExists ? parsedDivination.isReversed : false,
  );
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  const renderDivination = () => {
    return (
      <>
        <div className="flex flex-col items-center gap-1 lg:gap-3 pt-9 md:pt-11 xl:pt-14 max-w-2xl xl:max-w-5xl">
          <h2 className="text-textMain text-2xl md:text-3xl xl:text-4xl text-center font-semibold">
            {isReversed
              ? `${data.cards[0].name} (reversed)`
              : `${data.cards[0].name}`}
          </h2>

          <p className="text-textMain text-lg md:text-xl xl:text-2xl font-light text-center">
            {isReversed ? data.cards[0].meaning_rev : data.cards[0].meaning_up}
          </p>
          <button
            type="button"
            onClick={() => setIsDetailsOpen(true)}
            className=" py-2 px-5 lg:py-3 lg:px-6 mt-2 text-center text-base md:text-lg xl:text-xl text-textSecondary bg-oldPaper hover:bg-oldPaperHover active:bg-oldPaperActive w-fit rounded-lg shadow-md"
          >
            Show more
          </button>
        </div>
      </>
    );
  };

  const renderExistingDivination = () => {
    const existingDivination = JSON.parse(
      localStorage.getItem("divination") as string,
    );
    return (
      <>
        <div className="flex flex-col items-center gap-1 lg:gap-3 pt-9 md:pt-11 xl:pt-14 max-w-2xl xl:max-w-5xl">
          <h2 className="text-textMain text-2xl md:text-3xl xl:text-4xl text-center font-semibold">
            {existingDivination.isReversed
              ? `${existingDivination.cardOfTheDay} (reversed)`
              : `${existingDivination.cardOfTheDay}`}
          </h2>

          <p className="text-textMain text-lg md:text-xl xl:text-2xl font-light text-center">
            {existingDivination.meaning}
          </p>
          <button
            type="button"
            onClick={() => setIsDetailsOpen(true)}
            className=" py-2 px-5 lg:py-3 lg:px-6 mt-2 text-center text-base md:text-lg xl:text-xl text-textSecondary bg-oldPaper hover:bg-oldPaperHover active:bg-oldPaperActive w-fit rounded-lg shadow-md"
          >
            Show more
          </button>
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

      const meaning = randomReversed
        ? data.cards[0].meaning_rev
        : data.cards[0].meaning_up;
      const divination = {
        cardOfTheDay: data?.cards[0].name,
        cardNameShort: data?.cards[0].name_short,
        meaning: meaning,
        meaningUp: data.cards[0].meaning_up,
        meaningRev: data.cards[0].meaning_rev,
        description: data.cards[0].desc,
        isReversed: randomReversed,
        date: Date.now(),
      };

      localStorage.setItem("divination", JSON.stringify(divination));
    }
  }, [data]);

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-1 md:gap-3 lg:gap-7 p-9 md:pt-14 xl:pt-16 w-full">
        <div className="flex flex-col gap-2 lg:gap-4">
          <h1 className="text-center text-textMain text-3xl md:text-4xl xl:text-5xl font-semibold">
            Your card of the day
          </h1>
          <p className="text-center text-textMain text-xl md:text-2xl xl:text-3xl md:max-w-96 lg:max-w-[394px] xl:max-w-[494px]">
            Click on the deck to shuffle and get your daily Tarot reading
          </p>
        </div>
        <div className="relative mt-4 md:mt-5 xl:mt-6 flex flex-col items-center">
          <button type="button" onClick={handleClick}>
            <div className="relative">
              <img
                src={back}
                alt=""
                className={`relative rounded-3xl max-h-80 md:max-h-96 lg:max-h-72 xl:max-h-[362px] shadow-sm  ${isShuffled ? " animate-shuffle ease-in-out delay-0 duration-500 z-[2]" : "z-[6]"}`}
                style={{
                  animationDelay: "0s",
                  transition: "z-index 0s ease-in-out 0.5s",
                }}
              />
              <img
                src={back}
                alt=""
                className={`absolute top-0 left-0 rounded-3xl  max-h-80 md:max-h-96 lg:max-h-72 xl:max-h-[362px] shadow-sm mt-2 ${isShuffled ? "animate-shuffle ease-in-out delay-1000 duration-500 z-[1]" : "z-[5]"}`}
                style={{
                  animationDelay: "1s",
                  transition: "z-index 0s ease-in-out 1.5s",
                }}
              />
              <img
                src={back}
                alt=""
                id="animated-shuffle"
                className={`absolute top-0 left-0 rounded-3xl  max-h-80 md:max-h-96 lg:max-h-72 xl:max-h-[362px] shadow-sm mt-3 ${isShuffled ? "animate-shuffle ease-in-out delay-2000 duration-500 z-0" : "z-[4]"}`}
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
                  src={back}
                  alt=""
                  className="absolute top-0 left-0 rounded-3xl  max-h-80 md:max-h-96 lg:max-h-72 xl:max-h-[362px] shadow-xl  [backfaceVisibility:hidden]"
                />
                {(isFetched || divinationExists) && (
                  <img
                    src={cardSrc}
                    alt=""
                    id="cardSrc"
                    className="absolute top-0 left-0 rounded-3xl max-h-80 md:max-h-96 lg:max-h-72 xl:max-h-[362px] shadow-xl [backfaceVisibility:hidden] [transform:rotateY(180deg)]"
                    style={{
                      transform: isReversed ? "rotateX( 180deg )" : "",
                    }}
                  />
                )}
              </div>

              <img
                src={back}
                alt=""
                className="absolute top-0 left-0 rounded-3xl  max-h-80 md:max-h-96 lg:max-h-72 xl:max-h-[362px] shadow-[4px_8px_12px_4px_rgba(0,0,0,0.5)] mt-4 z-[-1]"
              />
            </div>
          </button>
          {isHintOpen &&
            createPortal(
              <HintModal onClose={() => setIsHintOpen(false)} />,
              document.body,
            )}
          {isDetailsOpen &&
            createPortal(
              <DetailsModal onClose={() => setIsDetailsOpen(false)} />,
              document.body,
            )}

          {data && isFlipped && renderDivination()}
          {!data && divinationExists && renderExistingDivination()}
        </div>
      </div>
      <footer className="flex grow justify-center items-end gap-4 pb-2 px-7 md:px-9 ">
        <div className="flex gap-1 items-center text-textSecondary text-xs md:text-sm lg:text-base">
          <MailIcon />
          <a href="mailto:ochentso@gmail.com">ochentso@gmail.com</a>
        </div>
        <div>
          <a
            href="https://github.com/ochentso"
            target="_blank"
            className="flex gap-1 items-center text-textSecondary text-xs md:text-sm lg:text-base"
          >
            <LinkIcon />
            GitHub
          </a>
        </div>
      </footer>
    </>
  );
}

export default App;
