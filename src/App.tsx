// import "./App.css";
import { useQuery } from "@tanstack/react-query";

function App() {
  const getRandomCard = async () => {
    const url = "https://tarotapi.dev/api/v1/cards/random?n=1";
    return await fetch(url).then((response) => response.json());
    // console.log(randomCard);
    // return randomCard;
  };
  const { data, error, isPending, isError, isLoading, refetch } = useQuery({
    queryKey: ["getRandomCard"],
    queryFn: getRandomCard,
    enabled: false,
  });

  console.log(data);

  const handleClick = () => {
    // console.log("your card");
    refetch();
  };

  return (
    <div className="flex flex-col justify-center items-center gap-12 fixed right-1/2 translate-x-1/2 top-1/2 translate-y-[-50%]">
      <h1 className=" text-cafeCreme text-5xl">Your card of the day</h1>
      <button type="button" onClick={handleClick} className=" w-80">
        <img src="/back.jpeg" alt="" className=" rounded-3xl" />
      </button>
      {isLoading && <p className="text-cafeCreme">Loading...</p>}
      {/* {isError && <p>Error: {error}</p>} */}
      {data && (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-cafeCreme text-2xl">{data.cards[0].name}</h2>

          <p className="text-cafeCreme text-lg">{data.cards[0].meaning_up}</p>
        </div>
      )}
    </div>
  );
}

export default App;
