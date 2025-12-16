import { RowingItem } from "./RowingItem";

export interface EquipmentsService {
  getEquipments(): Promise<RowingItem[]>;
}
