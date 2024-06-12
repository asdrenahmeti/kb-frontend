import { format } from 'date-fns';
import { CHANNELS } from './channels';
import { fetchData } from './data';

export const getToday = ({
  date = '2022-04-19',
  formatType = 'yyyy-MM-dd'
} = {}) => format(new Date(date), formatType);

export const getResources = async () => {
  const channels = CHANNELS;

  const dataResponse = await fetchData();

  const data = dataResponse;
  return { channels, epg: data };
};
