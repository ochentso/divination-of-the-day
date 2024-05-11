interface HintModalProps {
  onClose: () => void;
}

const HintModal: React.FC<HintModalProps> = ({ onClose }) => (
  <>
    <div className="fixed z-50 bottom-1/2 right-1/2 translate-x-2/4 translate-y-1/2 flex flex-col items-center pb-6 pt-8 px-6 rounded-xl bg-paperYellow w-max">
      <button onClick={onClose} className=" absolute top-1 right-1">
        X
      </button>
      <span className=" text-textMain font-bold text-4xl text-center">
        You've already drawn a card today
      </span>
    </div>
    <div
      onClick={onClose}
      className="fixed top-0 left-0 w-full h-full bg-opacity-20 bg-slate-600"
    ></div>
  </>
);

export default HintModal;
