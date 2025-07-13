import { RiDeleteBin5Line } from "react-icons/ri";

interface Props {
  deleteRectangle: () => void;
}

export const UndoRedoControl = ({ deleteRectangle }: Props) => {
  return (
    <div className="drawing-history">
      <button onClick={deleteRectangle}>
        <RiDeleteBin5Line size={16} />
      </button>
    </div>
  );
};
