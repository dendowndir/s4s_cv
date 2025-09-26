import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Profile } from "./profile/profile";

interface Props {
  className?: string;
}

const Main: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn("", className)}>
      <Profile />
    </div>
  );
};

export default Main;
