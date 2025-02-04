import { FC } from "react";
import { PieceType } from "../../../controller/pieces/types/Pieces";

export class PieceResources {
  name: PieceType;
  icon: string;
  resource: FC;

  constructor(name: PieceType, icon: string, resource: FC) {
    this.name = name;
    this.icon = icon;
    this.resource = resource;
  }
}
