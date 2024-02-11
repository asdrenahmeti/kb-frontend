"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 h-screen justify-center items-center">
      <h1 className="text-5xl font-bold">Karaokebox UK</h1>
      <Button
        variant="default"
        onClick={() =>
          toast("shadcn is working", {
            description: "A perfect start",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Test shadcn
      </Button>
    </div>
  );
}
