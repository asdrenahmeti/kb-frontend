import React from "react";

import {
  CurrentTimeIndicator,
  CurrentTime,
  CurrentTimeBox,
  CurrentTimeContent,
} from "@nessprim/planby-pro";

export function LiveTime({
  isVerticalMode,
  isBaseTimeFormat,
  isRTL,
  time,
  styles,
}: CurrentTimeIndicator) {
  return (
    <CurrentTimeBox {...styles.position}>
      <CurrentTimeContent
        isVerticalMode={isVerticalMode}
        isBaseTimeFormat={isBaseTimeFormat}
        isRTL={isRTL}
        style={{ color: "red" }}
      >
        {time}
      </CurrentTimeContent>
    </CurrentTimeBox>
  );
}
