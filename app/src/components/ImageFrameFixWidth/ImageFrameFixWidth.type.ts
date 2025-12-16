export interface IImageFrame {
    side: "Left" | "Right";
    imageModel: {
        image: string;
        title: string
    };
    children: React.ReactChild; 
}