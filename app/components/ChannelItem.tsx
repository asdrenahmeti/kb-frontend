import { ChannelItem as IChannelItem, ChannelBox } from '@nessprim/planby-pro';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { GoDotFill } from 'react-icons/go';
import { channelStyles, COLORS } from '../helpers';

export const ChannelItem = (props: IChannelItem) => {
  const { isVerticalMode, channel, onOpenGroupTree } = props;
  const { isOpen, isNestedChild, isFirstNestedChild, isLastNestedChild } =
    channel;
  const { groupTree, position } = channel;

  const boxStyle = channelStyles.boxGroupTree({
    isOpen,
    isNestedChild,
    isLastNestedChild,
    groupTree
  });
  const leftArrowStyle = channelStyles.arrowRight(isFirstNestedChild);
  const arrowDropdownStyle = channelStyles.arrowDown(isOpen);
  return (
    <ChannelBox
      isVerticalMode={isVerticalMode}
      groupTree={groupTree}
      onClick={() => onOpenGroupTree?.(channel)}
      style={boxStyle}
      {...position}
    >
      {isNestedChild && (
        <span style={leftArrowStyle}>
          <GoDotFill size={10} />
        </span>
      )}
      <p style={{ color: '##000', fontSize: '14px' }}>{channel.title}</p>{' '}
      {groupTree && (
        <span style={arrowDropdownStyle}>
          <RiArrowDropDownLine size={40} />
        </span>
      )}
    </ChannelBox>
  );
};
