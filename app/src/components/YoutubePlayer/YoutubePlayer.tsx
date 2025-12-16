import React, { useImperativeHandle, useRef } from "react";
import "./YoutubePlayer.scss";

declare global {
  interface Window {
    YT: any;
  }
}

const YoutubePlayer = React.forwardRef(({ videoId }: { videoId: string }, ref) => {
  const player = useRef<any>();

  useImperativeHandle(ref, () => ({
    play() {
      player.current?.playVideo();
    },
    duration: player.current?.getDuration ? player.current?.getDuration() - player.current?.getCurrentTime() : 0,
  }));

  React.useEffect(() => {
    if (typeof window.YT !== "undefined") {
      const youtubeAPI = window.YT;
      youtubeAPI.ready(() => createYoutubePlayer(youtubeAPI));
    }
  }, [window.YT]);

  const startVideo = (event: any) => {
    event.target?.playVideo();
    event.target?.mute();
  };

  const createYoutubePlayer = (youtubeAPI: any) => {
    player.current = new youtubeAPI.Player(videoId, {
      height: window.innerHeight * 2,
      width: window.innerWidth * 2,
      videoId: videoId,
      origin: window.location.origin,
      playerVars: {
        controls: 0,
        disablekb: 1,
      },
      events: {
        onReady: startVideo,
        onStateChange: (event) => event.data !== youtubeAPI.PlayerState.PLAYING && startVideo(event),
      },
    });
  };

  return <div className='youtube-player__' id={videoId} />;
});

YoutubePlayer.displayName = "YoutubePlayer";

export default YoutubePlayer;

export const Head = () => (
  <script
    id='youtube-api'
    src={`https://www.youtube.com/iframe_api?origin=${window.location.origin}&enablejsapi=1`}
    async={false}
  />
);
