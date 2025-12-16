import { DropdownOptionType } from "../Form/DropdownField/DropdownOptionType";

export interface MonitorOptionsVM {
  machine: string;
  monitors?: DropdownOptionType[];
}
