import * as React from "react";
import { useEffect, useState } from "react";
import HeroSkeletonLoading from "./HeroSkeletonLoading";
import "./HeroStyle.scss";
import Slider from "react-slick";
import CarouselArrow from "./components/CarouselArrow/CarouselArrow";
import Foreground from "./components/Foreground/Foreground";
import BuilderBackgroundImage from "../../components/BuilderImage/BuilderBackgroundImage";
import YoutubePlayer from "../../components/YoutubePlayer/YoutubePlayer";
import { checkIfIsMobile } from "../../hooks/useCheckMobile";

const DEFAULT_SLIDE_TIME = 4000; // milliseconds

const Hero = ({
  slides,
}: {
  slides: {
    alignment: string;
    body: string;
    cta: { destination: string; label: string; isExternal: boolean }[];
    subtitle: string;
    title: string;
    media: {
      image: string;
      videoUrl: string;
      position: string;
      youtubeDesktopVideoId: string;
      youtubeMobileVideoId: string;
    };
  }[];
}) => {
  const slider = React.useRef<Slider | null>(null);
  const videoComponent = React.useRef<HTMLVideoElement[]>([]);
  const youTubeVideoComponent = React.useRef<any[]>([]);
  const [slideTimeout, setSlideTimeout]: any = useState(null);

  useEffect(() => {
    if (!slides || !slides.length) return;
    videoComponent.current = videoComponent.current.slice(0, slides.length);
    setShowedSlide(0);
  }, [slides]);

  const clearSlideTimeout = () => clearTimeout(slideTimeout);

  const moveToNextSlide = () => slider.current?.slickNext();

  const moveToPrevSlide = () => slider.current?.slickPrev();

  const setShowedSlide = async (currentSlideIndex: number) => {
    clearSlideTimeout();
    if (isVideoUrlOnSlide(slides[currentSlideIndex]) || isYoutubeIdOnSlide(slides[currentSlideIndex]))
      await startSlideVideo(currentSlideIndex);

    let slideDuration = DEFAULT_SLIDE_TIME;

    if (isVideoUrlOnSlide(slides[currentSlideIndex]))
      slideDuration = videoComponent.current[currentSlideIndex].duration * 1000;

    if (isYoutubeIdOnSlide(slides[currentSlideIndex]))
      slideDuration = youTubeVideoComponent.current[currentSlideIndex].duration * 1000;

    setSlideTimeout(setTimeout(() => slider.current?.slickNext(), slideDuration));
  };

  const isVideoUrlOnSlide = (slide: any) => !!slide.media?.videoUrl;

  const isYoutubeIdOnSlide = (slide: any) =>
    !!slide.media?.youtubeDesktopVideoId && !!slide.media?.youtubeMobileVideoId;

  const startSlideVideo = async (slide: number) => {
    if (isVideoUrlOnSlide(slide)) return videoComponent.current[slide].play();
    youTubeVideoComponent.current[slide].play();
  };

  if (!slides || !slides.length) return <HeroSkeletonLoading />;

  return (
    <Slider
      className='hero__slider'
      speed={500}
      autoplay={false}
      afterChange={setShowedSlide}
      fade
      accessibility
      ref={slider}
      dots
      infinite
      prevArrow={<CarouselArrow onClick={moveToPrevSlide} isPrev />}
      nextArrow={<CarouselArrow onClick={moveToNextSlide} />}
      dotsClass='hero__paging-bar-container'
    >
      {slides.map((slide, index: number) => {
        if (isVideoUrlOnSlide(slide)) {
          return (
            <div className='hero__container' key={`hero${index}`}>
              <video
                ref={(el: HTMLVideoElement) => (videoComponent.current[index] = el)}
                className='hero__video-player'
                muted={true}
                playsInline={true}
              >
                <source src={slide.media.videoUrl} />
              </video>
              <Foreground
                alignment={slide.alignment}
                title={slide.title}
                subTitle={slide.subtitle}
                cta={slide.cta}
                body={slide.body}
              />
            </div>
          );
        } else if (isYoutubeIdOnSlide(slide)) {
          return (
            <YoutubePlayer
              ref={(el) => (youTubeVideoComponent.current[index] = el)}
              videoId={checkIfIsMobile() ? slide.media.youtubeMobileVideoId : slide.media.youtubeDesktopVideoId}
              key={`hero${index}`}
            />
          );
        }
        return (
          <div className='hero__container' key={index}>
            <BuilderBackgroundImage
              className='hero__container'
              imageModel={{ image: slide?.media?.image, title: "", position: slide?.media?.position }}
            >
              <Foreground
                alignment={slide.alignment}
                title={slide.title}
                subTitle={slide.subtitle}
                cta={slide.cta}
                body={slide.body}
              />
            </BuilderBackgroundImage>
          </div>
        );
      })}
    </Slider>
  );
};

export default Hero;
