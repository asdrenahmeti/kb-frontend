import {
  CurrentTime,
  Timeline,
  TimelineWrapper,
  TimelineBox,
  TimelineTime,
  TimelineDivider,
  TimelineDividers,
  useTimeline,
} from "@nessprim/planby-pro";

export function CustomTimeline(props: Timeline) {
  const {
    time,
    dividers,
    timelineHeight,
    timelineDividers,
    getTime,
    getTimelineProps,
    getCurrentTimeProps,
  } = useTimeline(props);

  const {
    isToday,
    isBaseTimeFormat,
    isCurrentTime,
    isTimelineVisible,
    isVerticalMode,
  } = props;

  const { hourWidth } = props;

  const renderTime = (item: string | number, index: number) => {
    const { isNewDay, time } = getTime(item);
    const position = { left: hourWidth * index, width: hourWidth };
    const isVisible = isTimelineVisible(position);
    if (!isVisible) return null;
    return (
      <TimelineBox
        key={index}
        isToday={isToday}
        isCurrentTime={isCurrentTime}
        isVerticalMode={isVerticalMode}
        timelineHeight={timelineHeight}
        {...position}
      >
        <TimelineTime
          isVerticalMode={isVerticalMode}
          isNewDay={isNewDay}
          isBaseTimeFormat={isBaseTimeFormat}
        >
          {time}
        </TimelineTime>
        <TimelineDividers isVerticalMode={isVerticalMode}>
          {renderDividers(isNewDay)}
        </TimelineDividers>
      </TimelineBox>
    );
  };

  const renderDividers = (isNewDay: boolean) =>
    dividers.map((_, index) => (
      <TimelineDivider
        key={index}
        isVerticalMode={isVerticalMode}
        isNewDay={isNewDay}
        width={hourWidth / timelineDividers}
        left={index * (hourWidth / timelineDividers)}
      />
    ));

  return (
    <TimelineWrapper {...getTimelineProps()}>
      {isCurrentTime && isToday && <CurrentTime {...getCurrentTimeProps()} />}
      {time.map((item, index) => renderTime(item, index))}
    </TimelineWrapper>
  );
}
