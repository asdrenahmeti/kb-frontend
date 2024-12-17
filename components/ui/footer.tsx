// components/Footer.tsx
import { Facebook, Mail, MapPin, Phone, Twitter } from "lucide-react";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-kb-violette pb-6 md:pb-0">
      <div className="container mx-auto py-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4">About KraokeBox</h2>
            <p className="mb-4 text-sm font-light">
              Karaoke Box is the premier destination for music lovers, party
              enthusiasts, and those looking to create unforgettable memories
              with friends and family. Step into our world of singing, laughter,
              and pure entertainment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-gray-300">
                <Facebook size={24} />
              </a>
              <a href="#" className="hover:text-gray-300">
                <Twitter size={24} />
              </a>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <ul className="space-y-2 text-sm font-light">
              <li>
                <a
                  href="#"
                  className="hover:text-kb-pink transition-colors duration-300"
                >
                  Privacy policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-kb-pink transition-colors duration-300"
                >
                  {" "}
                  Terms & conditions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-kb-pink transition-colors duration-300"
                >
                  {" "}
                  Booking
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-kb-pink transition-colors duration-300"
                >
                  {" "}
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <ul className="space-y-2 text-sm font-light">
              <li>
                <a
                  href="#"
                  className="hover:text-kb-pink transition-colors duration-300"
                >
                  {" "}
                  Birmingham
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-kb-pink transition-colors duration-300"
                >
                  {" "}
                  Mayfair
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-kb-pink transition-colors duration-300"
                >
                  {" "}
                  Soho
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-kb-pink transition-colors duration-300"
                >
                  {" "}
                  Smithfield
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-4">Quick Links</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Phone size={18} className="mr-2" />
                <a href="tel:02073299991"                   className="hover:text-kb-pink transition-colors duration-300"
>
                  020 7329 9991
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2" />
                <a
                  href="mailto:info@karaokebox.co.uk"
                  className="hover:text-kb-pink transition-colors duration-300"
                >
                  info@karaokebox.co.uk
                </a>
              </li>
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1" />
                <a
                  href="mailto:info@karaokebox.co.uk"
                  className="hover:text-kb-pink transition-colors duration-300"
                >
                  Smithfield 12 Smithfield Street, London EC1a 9lal
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-kb-pink w-full text-white p-4 max-w-[90%] text-center mx-auto md:text-left md:max-w-full ">
        <div className="container">
          <p className="font-light text-sm">
            Copyright © 2024 Karaoke Box. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
