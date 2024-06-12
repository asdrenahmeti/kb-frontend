import {
  ProgramItem,
  ProgramBox,
  ProgramContent,
  ProgramFlex,
  ProgramStack,
  ProgramTitle,
  ProgramText,
  ProgramImage,
  useProgram,
  ProgramResizeHandle
} from '@nessprim/planby-pro';

export const Program = ({ isVerticalMode, program, ...rest }: ProgramItem) => {
  const {
    isLive,
    isMinWidth,
    isMouseEvent,
    styles,
    resizeEvents,
    formatTime,
    getMouseEvents,
    set12HoursTimeFormat,
    getMouseEventTempTime
  } = useProgram({
    isVerticalMode,
    program,
    ...rest
  });

  const { data } = program;
  const { image, title, since, till } = data;

  const sinceTime = formatTime(since, set12HoursTimeFormat()).toLowerCase();
  const tillTime = formatTime(till, set12HoursTimeFormat()).toLowerCase();
  const dragTime = getMouseEventTempTime();
  return (
    <ProgramBox
      width={styles.width}
      style={styles.position}
      {...getMouseEvents()}
    >
      <ProgramContent
        isVerticalMode={isVerticalMode}
        width={styles.width}
        isLive={isLive}
      >
        <ProgramResizeHandle {...resizeEvents.eventsLeft} />
        <ProgramResizeHandle {...resizeEvents.eventsRight} />
        <ProgramFlex isVerticalMode={isVerticalMode}>
          {isLive && isMinWidth && (
            <ProgramImage
              isVerticalMode={isVerticalMode}
              src={image}
              alt='Preview'
            />
          )}
          <ProgramStack>
            <ProgramTitle>{title}</ProgramTitle>
            <ProgramText>
              {isMouseEvent ? (
                <>
                  {dragTime.since} - {dragTime.till}
                </>
              ) : (
                <>
                  {sinceTime} - {tillTime}
                </>
              )}
            </ProgramText>
          </ProgramStack>
        </ProgramFlex>
      </ProgramContent>
    </ProgramBox>
  );
};
