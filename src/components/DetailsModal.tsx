import { CloseIcon } from "./CloseIcon";

interface DetailsModalProps {
  onClose: () => void;
}
const DetailsModal: React.FC<DetailsModalProps> = ({ onClose }) => {
  const existingDivination = JSON.parse(
    localStorage.getItem("divination") as string,
  );
  return (
    <>
      <div className="fixed z-50 bottom-1/2 right-1/2 translate-x-2/4 translate-y-1/2 flex flex-col items-center pb-6 pt-8 px-6 rounded-xl bg-lightPaper max-h-[calc(100%_-_25px)] w-[calc(100%_-_25px)] lg:w-3/5">
        <button onClick={onClose} className=" absolute top-1 right-1">
          <CloseIcon />
        </button>
        <div className="flex flex-col gap-3 overflow-y-auto overflow-x-auto">
          <h3 className=" text-center text-xl lg:text-3xl font-semibold">
            {existingDivination.cardOfTheDay}
          </h3>
          <div>
            <span className=" font-semibold text-base lg:text-xl">
              Meaning (upright):
            </span>
            <p className="text-base lg:text-xl">
              {existingDivination.meaningUp}
            </p>
          </div>
          <div>
            <span className=" font-semibold text-base lg:text-xl">
              Meaning (reversed):
            </span>
            <p className="text-base lg:text-xl">
              {existingDivination.meaningRev}
            </p>
          </div>
          <div>
            <span className=" font-semibold text-base lg:text-xl">
              Description
            </span>
            <p className="text-base lg:text-xl">
              {existingDivination.description}
            </p>
          </div>
        </div>
      </div>
      <div
        onClick={onClose}
        className="fixed top-0 left-0 w-full h-full bg-opacity-20 bg-slate-600"
      ></div>
    </>
  );
};

export default DetailsModal;
