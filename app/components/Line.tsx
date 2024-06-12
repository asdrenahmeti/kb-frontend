import { Line as ILine } from "@nessprim/planby-pro";

export function Line({ styles }: ILine) {
  return (
    <div
      style={{
        ...styles.position,
        background: "red",
        pointerEvents: "none",
      }}
    />
  );
}
