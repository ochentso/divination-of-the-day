// import "./App.css";

function App() {
  const handleClick = () => {
    console.log("your card");
  };
  return (
    <div className="flex flex-col justify-center items-center gap-12 fixed right-1/2 translate-x-1/2 top-1/2 translate-y-[-50%]">
      <h1 className=" text-cafeCreme text-5xl">Your card of the day</h1>
      <button type="button" onClick={handleClick} className=" w-80">
        <img src="/back.jpeg" alt="" className=" rounded-3xl" />
      </button>
    </div>
  );
}

export default App;
