import { HttpClient } from "./HttpClient";
import { EquipmentsService } from "../../domain/equipments/EquipmentsService";
import { RowingItem } from "../../domain/equipments/RowingItem";

export class HttpEquipmentsService implements EquipmentsService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getEquipments = async (): Promise<RowingItem[]> => {
    const response = await this.httpClient.get("/equipment/");
    return response.data.results.map((result: any) => this.jsonToRowingItem(result, true));
  };

  private jsonToRowingItem = (json: any, includeMonitors: boolean): RowingItem => {
    const item = {
      id: json.id,
      title: json.title,
    };
    if (includeMonitors) {
      item["monitors"] = json.available_monitors.map((item: any) => this.jsonToRowingItem(item, false));
    }
    return item;
  };
}
