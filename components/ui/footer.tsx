// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className='bg-[#260042] text-white pt-8 relative'>
      <div className='container max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-5 gap-4'>
        <div className='md:col-span-2'>
          <h2 className='text-lg font-semibold mb-4'>About KaraokeBox</h2>
          <p className='text-sm max-w-[70%] font-light leading-2'>
            Karaoke Box is the premier destination for music lovers, party
            enthusiasts, and those looking to create unforgettable memories with
            friends and family. Step into our world of singing, laughter, and
            pure entertainment.
          </p>
          <div className='flex space-x-4 mt-4'>
            <a href='#' className='text-white'>
              <svg
                className='w-6 h-6'
                viewBox='0 0 320 512'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z'
                  fill='currentColor'
                ></path>
              </svg>
            </a>
            <a href='#' className='text-white'>
              <svg
                className='w-6 h-6'
                viewBox='0 0 512 512'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z'
                  fill='currentColor'
                ></path>
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h2 className='text-lg font-semibold mb-4'>Quick Links</h2>
          <ul className='space-y-2 text-sm'>
            <li>
              <a
                href='https://arditspahija.com/karaokebox-v2/terms-conditions-privacy-policy/'
                className='hover:underline'
              >
                Privacy policy
              </a>
            </li>
            <li>
              <a
                href='https://arditspahija.com/karaokebox-v2/terms-conditions-privacy-policy/'
                className='hover:underline'
              >
                Terms & conditions
              </a>
            </li>
            <li>
              <a
                href='https://arditspahija.com/karaokebox-v2/rooms-page/'
                className='hover:underline'
              >
                Booking
              </a>
            </li>
            <li>
              <a
                href='https://arditspahija.com/karaokebox-v2/about/'
                className='hover:underline'
              >
                About Us
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className='text-lg font-semibold mb-4'>Our Locations</h2>
          <ul className='space-y-2 text-sm'>
            <li>
              <a
                href='https://arditspahija.com/karaokebox-v2/our-locations/'
                className='hover:underline'
              >
                Birmingham
              </a>
            </li>
            <li>
              <a
                href='https://arditspahija.com/karaokebox-v2/our-locations/'
                className='hover:underline'
              >
                Mayfair
              </a>
            </li>
            <li>
              <a
                href='https://arditspahija.com/karaokebox-v2/our-locations/'
                className='hover:underline'
              >
                Soho
              </a>
            </li>
            <li>
              <a
                href='https://arditspahija.com/karaokebox-v2/our-locations/'
                className='hover:underline'
              >
                Smithfield
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className='text-lg font-semibold mb-4'>Quick Links</h2>
          <ul className='space-y-2 text-sm'>
            <li className='flex items-center space-x-2'>
              <svg
                className='w-5 h-5'
                aria-hidden='true'
                viewBox='0 0 512 512'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z'
                  fill='currentColor'
                ></path>
              </svg>
              <span>020 7329 9991</span>
            </li>
            <li className='flex items-center space-x-2'>
              <svg
                className='w-5 h-5'
                aria-hidden='true'
                viewBox='0 0 512 512'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z'
                  fill='currentColor'
                ></path>
              </svg>
              <span>info@karaokebox.co.uk</span>
            </li>
            <li className='flex items-center space-x-2'>
              <svg
                className='w-5 h-5'
                aria-hidden='true'
                viewBox='0 0 384 512'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z'
                  fill='currentColor'
                ></path>
              </svg>
              <span>Smithfield 12 Smithfield Street, London EC1a 9lal</span>
            </li>
          </ul>
        </div>
      </div>
      <div className='text-left mt-16 py-4  bg-[#970094] w-full'>
        <p className='text-sm max-w-[1400px] mx-auto'>
          &copy; 2024 Karaoke Box. All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
