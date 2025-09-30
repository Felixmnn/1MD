import React from "react";
import { FontAwesome5, AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

type IconSet = "FontAwesome5" | "AntDesign" | "MaterialCommunityIcons";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  set?: IconSet;
}

export default function Icon({ name, size = 24, color = "#000", set = "FontAwesome5" }: IconProps) {
  switch (set) {
    case "AntDesign":
      return <AntDesign name={name as any} size={size} color={color} />;
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
    case "FontAwesome5":
    default:
      return <FontAwesome5 name={name as any} size={size} color={color} />;
    
  }
}
