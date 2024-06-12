import {
  GridCell as IGridCell,
  GridItem,
  GridDivider,
} from "@nessprim/planby-pro";

export function GridCell(props: IGridCell) {
  const {
    isDayMode,
    isHoverHighlight,
    item,
    timelineDividerArray,
    gridDividerProps,
    gridItemClickProps,
  } = props;

  const { onItemClick, ...dividerProps } = gridDividerProps.props;
  const { left, ...styles } = gridDividerProps.styles;
  return (
    <GridItem
      isDayMode={isDayMode}
      isHoverHighlight={isHoverHighlight as boolean}
      {...item.position}
      {...gridItemClickProps}
    >
      {isDayMode &&
        timelineDividerArray.map((_, index) => (
          <GridDivider
            key={index}
            {...styles}
            {...dividerProps}
            left={left(index)}
            onClick={onItemClick(item, index)}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#a0aec0",
                opacity: 0.2,
                fontSize: 10,
              }}
            >
              {index + 1}
            </div>
          </GridDivider>
        ))}
    </GridItem>
  );
}
