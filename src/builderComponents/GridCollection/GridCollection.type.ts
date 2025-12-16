import { BuilderImageModel } from '../../components/BuilderImage/BuilderImage.type';
enum sides {
  Left = "Left",
  Right = "Right",
}
  
export type Tentry = {
  imageModel: BuilderImageModel;
  title: string;
  description: string;
};
  
export interface IGridCollection {
  imageStartSide: sides;
  imagesAndText: Tentry[];
}
  