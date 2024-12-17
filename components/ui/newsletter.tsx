import React from "react";
import { Input } from "./input";
import { Button } from "./button";

type Props = {};

const Newsletter = (props: Props) => {
  return (
    <div className="bg-kb-dark-violette text-white py-14">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-white">
              Sign up to the newsletter and be the first to hear about
              Smithfield news and offers!
            </h1>
          </div>
          <div className="my-auto">
            <div className="flex gap-4 justify-center md:justify-end">
            <Input className="max-w-[300px]" placeholder="Your email"/>
            <Button className="bg-kb-secondary hover:bg-kb-primary">Sign up</Button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
