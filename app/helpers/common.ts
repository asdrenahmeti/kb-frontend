import { getResources } from './epg-data';

export const COLORS = {
  WHITE: '#fff',
  TEAL: 'rgb(93, 218, 219)',
  RED: '#E53E3E',
  GREY: '#7180961a'
};

type BoxGroupeTree = {
  isOpen: boolean;
  isNestedChild: boolean;
  isLastNestedChild?: boolean;
  groupTree?: boolean;
};

export const channelStyles = {
  box: {
    border: '1px solid transparent',
    borderTopColor: 'transparent',
    borderBottomColor: COLORS.GREY,
    borderRightColor: COLORS.GREY
  },
  boxGroupTree: ({
    isOpen,
    isNestedChild,
    isLastNestedChild,
    groupTree
  }: BoxGroupeTree) => {
    if (isLastNestedChild) {
      return {
        ...channelStyles.box,
        borderLeftColor: COLORS.TEAL,
        borderRightColor: COLORS.TEAL,
        borderBottomColor: COLORS.TEAL
      };
    } else if (groupTree || isNestedChild) {
      return {
        ...channelStyles.box,
        borderTopColor: isNestedChild ? 'transparent' : COLORS.TEAL,
        borderLeftColor: COLORS.TEAL,
        borderRightColor: COLORS.TEAL,
        borderBottomColor: isOpen || isNestedChild ? COLORS.GREY : COLORS.TEAL
      };
    }
    return channelStyles.box;
  },
  arrowRight: (isFirstNestedChild?: boolean) =>
    ({
      position: 'absolute',
      top: '52%',
      left: '10%',
      transform: `translate(50%, -50%)`,
      color: isFirstNestedChild ? COLORS.RED : COLORS.TEAL
    } as React.CSSProperties),
  arrowDown: (isOpen: boolean) =>
    ({
      position: 'absolute',
      top: '52%',
      right: 0,
      marginLeft: 2,
      color: COLORS.TEAL,
      transform: `translate(-50%, -50%) ${
        isOpen ? `rotate(180deg)` : `rotate(0deg)`
      }`
    } as React.CSSProperties)
} as const;

export const fetchResources = async () => {
  const resources = getResources();
  return new Promise(res => setTimeout(() => res(resources)));
};

export const ELEMENTS = [
  {
    id: '213df-34f-34f-34f',
    title: 'Element 1',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    id: 'ef3f-34f-34f-34f',
    title: 'Element 2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  },
  {
    id: 'rtf3f-tr3f-34f-34f',
    title: 'Element 3',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  }
];
