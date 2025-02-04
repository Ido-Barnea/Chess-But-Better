import { FC } from "react";

export class PieceResources {
  name: string;
  icon: string;
  resource: FC;

  constructor(name: string, icon: string, resource: FC) {
    this.name = name;
    this.icon = icon;
    this.resource = resource;
  }
}
