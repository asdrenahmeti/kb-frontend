import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Channel, GridItemProps, Program, useEpg } from '@nessprim/planby-pro';
// Helpers
import { ELEMENTS, fetchResources } from './helpers';

// Import theme
import { theme } from './helpers/theme';
import { format } from 'date-fns';

// Example of globalStyles
// const globalStyles = `
// @import url('https://fonts.googleapis.com/css2?family=Antonio:wght@400;500;600&display=swap');
// .planby {
//   font-family: "Antonio", system-ui, -apple-system,
//     /* Firefox supports this but not yet system-ui */ "Segoe UI", Roboto,
//     Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; /* 2 */
// }
// `;

export function useApp() {
  const itemHeight = 60;
  const startDate = `2024-05-23T00:00:00`;
  const endDate = `2024-05-23T23:00:00`;

  const isMobileMax = useMediaQuery({
    query: '(max-width: 800px)'
  });
  const [elements, setElements] = useState(() => ELEMENTS);
  const [channels, setChannels] = React.useState<Channel[]>([]);
  const [epg, setEpg] = React.useState<Program[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingInformation, setBookingInformation] = useState<any>();

  const channelsData = React.useMemo(() => channels, [channels]);
  const epgData = React.useMemo(() => epg, [epg]);

  const { getEpgProps, getLayoutProps, getDropItemData } = useEpg({
    channels: channelsData,
    epg: epgData,
    dayWidth: 6000,
    startDate,
    endDate,
    isVerticalMode: isMobileMax,
    isInitialScrollToNow: true,
    isTimeline: true,
    sidebarWidth: isMobileMax ? 100 : 100,
    itemHeight: isMobileMax ? 100 : 60,
    isBaseTimeFormat: false,
    isResize: true,
    timelineDividers: 4,
    overlap: {
      enabled: true,
      mode: 'stack'
    },
    grid: {
      enabled: true,
      onGridItemClick: (props: GridItemProps) => {
        setBookingModal(true);
        setBookingInformation(props);
        console.log('onGridItemClick', props);
      },
      onGridItemDrop: (props: GridItemProps) => {
        const newElement = getDropItemData(props) as never;
        console.log('onGridItemDrop', newElement);
        setEpg(prev => [...prev, newElement]);
      },
      hoverHighlight: true
    },
    snap: { x: 41.666666 },
    dnd: {
      enabled: true,
      mode: 'multi-rows',
      onDnDMouseUp: event => {
        // or false if you want to cancel the drag and drop and keep the program at the same place
        return true;
      },
      onDnDSuccess: event => console.log('onDnDSuccess', event)
    },
    timezone: {
      enabled: false,
      zone: 'Europe/London',
      mode: 'utc'
    },
    theme
  });

  const handleFetchResources = React.useCallback(async () => {
    setIsLoading(true);
    const { epg, channels } = (await fetchResources()) as {
      epg: Program[];
      channels: Channel[];
    };

    console.log('THIS ARE UPDATES', epg);

    setEpg(epg);
    setChannels(channels);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    handleFetchResources();
  }, [handleFetchResources]);

  const handleRemoveElement = React.useCallback(
    async (id: string) => {
      const newElements = [...elements].filter(element => element.id !== id);
      setElements(newElements);
    },
    [elements]
  );

  React.useEffect(() => {
    handleFetchResources();
  }, [handleFetchResources]);

  return {
    isLoading,
    elements,
    getEpgProps,
    getLayoutProps,
    bookingModal,
    setBookingModal,
    bookingInformation,
    setBookingInformation,
    handleFetchResources,
    removeElement: handleRemoveElement
  };
}
