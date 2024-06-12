import { useDrop } from "react-dnd";
const ItemType = "DRAGGABLE_ITEM";

interface DroppableAreaProps {
  children: React.ReactNode;
  removeElement: (id: string) => Promise<void>;
}

export const DroppableArea = ({
  removeElement,
  children,
}: DroppableAreaProps) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (item: { id: string }) => removeElement(item.id),
  });

  return (
    <div
      ref={drop}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};
