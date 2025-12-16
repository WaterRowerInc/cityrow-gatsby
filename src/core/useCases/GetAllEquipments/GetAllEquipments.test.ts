import { anything, instance, mock, verify, when } from "ts-mockito";
import { GetAllEquipments } from "./GetAllEquipments";
import { EquipmentsService } from "../../domain/equipments/EquipmentsService";

describe("GetAllEquipments should", () => {
  it("get available equipments", async () => {
    when(equipmentsService.getEquipments()).thenResolve(anything());

    await getAllEquipments().execute();

    verify(equipmentsService.getEquipments()).called();
  });

  beforeEach(() => {
    equipmentsService = mock<EquipmentsService>();
  });

  function getAllEquipments(): GetAllEquipments {
    return new GetAllEquipments(instance(equipmentsService));
  }

  let equipmentsService: EquipmentsService;
});
