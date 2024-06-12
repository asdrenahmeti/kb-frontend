import { useDrag } from "react-dnd";

const ItemType = "DRAGGABLE_ITEM";

const wrapperStyles = {
  border: "1px solid #171923",
  fontSize: "14px",
  fontWeight: "bold",
  background: "#1a202",
  borderRadius: "6px",
  marginRight: "10px",
};
const contentStyles = {
  backgroundColor: "#1a202c",
  color: "#fff",
  padding: "15px 25px",
  display: "flex",
  justifyContent: "center",

  cursor: "move",
} as React.CSSProperties;

interface BoxWithHandleProps {
  data: { id: string; title: string; description: string };
}

export const BoxWithHandle = ({ data }: BoxWithHandleProps) => {
  const { id, title, description } = data;

  const [{ opacity }, drag, preview] = useDrag(() => ({
    type: ItemType,
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.8 : 1,
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
    item: { id },
  }));

  return (
    <div ref={preview} style={{ ...wrapperStyles, opacity }}>
      <div
        ref={drag}
        id={id}
        style={contentStyles}
        onDragStart={(e) => e.dataTransfer.setData("text/plain", id)}
        data-title={title}
        data-description={description}
        // More data-attributes can be added here
      >
        {title} (drag me)
      </div>
    </div>
  );
};
