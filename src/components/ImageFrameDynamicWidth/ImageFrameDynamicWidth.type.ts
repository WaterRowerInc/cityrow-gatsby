export interface IImageFrameDynamic {
    side: 'Left' | 'Right' | "";
    imageModel: {
        areaFocus?: 'Left' | 'Right';
        image: string;
        title: string;
    },
    children?: React.ReactChild
}