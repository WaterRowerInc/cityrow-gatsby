import { EquipmentsService } from "../../domain/equipments/EquipmentsService";
import { RowingItem } from "../../domain/equipments/RowingItem";

export class GetAllEquipments {
  private readonly equipmentsService: EquipmentsService;

  constructor(equipmentsService: EquipmentsService) {
    this.equipmentsService = equipmentsService;
  }

  execute = async (): Promise<RowingItem[]> => await this.equipmentsService.getEquipments();
}
