import { FC } from "react";
import { PieceType } from "../../../controller/pieces/types/Pieces";

export type PieceResources = {
  name: PieceType;
  icon: string;
  resource: FC;
}
