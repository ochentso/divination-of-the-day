import { CloseIcon } from "./CloseIcon";

interface HintModalProps {
  onClose: () => void;
}

const HintModal: React.FC<HintModalProps> = ({ onClose }) => (
  <>
    <div className="fixed z-50 bottom-1/2 right-1/2 translate-x-2/4 translate-y-1/2 flex flex-col items-center pb-6 pt-8 px-6 rounded-xl bg-paperYellow w-72 md:w-96">
      <button onClick={onClose} className=" absolute top-1 right-1">
        <CloseIcon />
      </button>
      <div className="flex flex-col gap-2">
        <p className=" text-textMain text-lg md:text-xl lg:text-2xl font-light text-center">
          You've already gotten your Tarot reading for a day; no point in asking
          cards the same thing twice.
        </p>
        <p className=" text-textMain text-lg md:text-xl lg:text-2xl font-light text-center">
          Come back for a new card tomorrow.
        </p>
      </div>
    </div>
    <div
      onClick={onClose}
      className="fixed top-0 left-0 w-full h-full bg-opacity-20 bg-slate-600"
    ></div>
  </>
);

export default HintModal;
