import { BuilderImageModel } from "../../../../components/BuilderImage/BuilderImage.type";
import { UpcomingClassType } from "./Components/UpcomingClass/UpcomingClassType";

export interface InstructorBioItemType {
  name: string;
  username: string;
  description: string;
  imageModel?: BuilderImageModel;
  upcomingClasses: UpcomingClassType[];
}
