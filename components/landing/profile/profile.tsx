import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";

interface Props {
  className?: string;
}

export const Profile: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("bg-transparent h-full py-10 px-4 w-full", className)}>
      <Container className="flex flex-col items-center">
        <h1 className="text-2xl font-bold text-primary-foreground font-figtree">
          Kyrylo K Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
          ex voluptates doloremque, magnam vero commodi, libero eum quas nostrum
          ea, neque ab. Autem accusamus voluptates aperiam nesciunt veniam est
          voluptate.
        </h1>
      </Container>
    </div>
  );
};
