import axios from 'axios';

const fetchData = async () => {
  try {
    const response = await axios.get(
      'http://localhost:3000/sites/f0a5ba0a-8b74-4b4b-b831-3aa99c6addaf/rooms'
    );
    let channels = response.data.rooms.map(item => ({
      uuid: item.id,
      type: 'channel',
      title: item.name,
      country: 'USA',
      provider: 7427,
      logo: 'https://raw.githubusercontent.com/karolkozer/planby-demo-resources/master/resources/channel-logos/png/r-channel.png',
      year: 2002
    }));

    return channels;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const exportChannels = async () => {
  const channels = await fetchData();

  console.log(channels);
  module.exports.CHANNELS = channels;
};

exportChannels();
