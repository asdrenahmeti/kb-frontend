import axios from 'axios';
import { DateTime } from 'luxon';

export const fetchData = async () => {
  try {
    const response = await axios.get(
      'http://localhost:3000/bookings?gt=2024-05-23T00:00:00Z&siteId=f0a5ba0a-8b74-4b4b-b831-3aa99c6addaf'
    );

    const channels = response.data.rooms[0].bookings.map((item, index) => ({
      id: 'c950cdd2-3a04-4485-aab6-b68bb1be6cff' + index + '41298f',
      description:
        'An antisocial maverick doctor who specializes in diagnostic medicine does whatever it takes to solve puzzling cases that come his way using his crack team of doctors and his wits.',
      title: 'House',
      isYesterday: false,
      since: DateTime.fromISO(item.startTime, { zone: 'utc' }).toISO({
        includeOffset: false
      }),
      till: DateTime.fromISO(item.endTime, { zone: 'utc' }).toISO({
        includeOffset: false
      }),
      channelUuid: '2e42245f-f9bb-4e7e-bef6-04b3395318c7',
      image:
        'https://www.themoviedb.org/t/p/w1066_and_h600_bestv2/hiK4qc0tZijQ9KNUnBIS1k4tdMJ.jpg',
      country: 'Ghana',
      Year: '2004–2012',
      Rated: 'TV-14',
      Released: '16 Nov 2004',
      Runtime: '44 min',
      genre: 'Drama, Mystery',
      Director: 'N/A',
      Writer: 'David Shore',
      Actors: 'Hugh Laurie, Omar Epps, Robert Sean Leonard',
      Language: 'English',
      Country: 'United States',
      Awards: 'Won 5 Primetime Emmys. 57 wins & 140 nominations total',
      Metascore: 'N/A',
      imdbRating: '8.7',
      imdbVotes: '439,759',
      imdbID: 'tt0412142',
      Type: 'series',
      totalSeasons: '8',
      Response: 'True',
      Ratings: [{ Source: 'Internet Movie Database', Value: '8.7/10' }],
      rating: '8',
      channelIndex: 0,
      channelPosition: { top: 0, height: 80 },
      index: 0
    }));

    return channels;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data');
  }
};

// Export fetchData function to be used elsewhere
export default fetchData;
