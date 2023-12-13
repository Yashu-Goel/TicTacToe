import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./SplashScreen.css"; // Import the CSS file

const SplashScreen = () => {
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const leftLineRef = useRef(null);
  const rightLineRef = useRef(null);

  useEffect(() => {
    const topLine = topLineRef.current;
    const bottomLine = bottomLineRef.current;
    const leftLine = leftLineRef.current;
    const rightLine = rightLineRef.current;

    const topLineTimeline = gsap.timeline();
    const bottomLineTimeline = gsap.timeline();
    const leftLineTimeline = gsap.timeline();
    const rightLineTimeline = gsap.timeline();

    const OrgHeight = window.screen.height;
    const OrgWidth = window.screen.width;

    topLineTimeline.fromTo(
      topLine,
      { y: 0, opacity: 0.5 },
      { y: ((OrgHeight / 2) - (OrgHeight / 4)), opacity: 1, duration: 1, ease: "power2.inOut" }
    );

    bottomLineTimeline.fromTo(
      bottomLine,
      { y: OrgHeight, opacity: 0.5 },
      {
        y: ((OrgHeight / 2) - (OrgHeight / 4)),
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
      }
    );

    leftLineTimeline.fromTo(
      leftLine,
      { x: 0, opacity: 0.5 },
      {
        x: ((OrgWidth / 2) - (OrgHeight / 4) - 10),
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
      }
    );

    rightLineTimeline.fromTo(
      rightLine,
      { x: OrgWidth, opacity: 0.5 },
      {
        x: ((OrgWidth / 2) - (OrgHeight / 4) - 10),
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
      }
    );

    gsap
      .timeline()
      .add([
        topLineTimeline,
        bottomLineTimeline,
        leftLineTimeline,
        rightLineTimeline,
      ]);

    return () => {
      topLineTimeline.kill();
      bottomLineTimeline.kill();
      leftLineTimeline.kill();
      rightLineTimeline.kill();
    };
  }, []);

  return (
    <div className="SSContainer">
      <div>
        <div className="TopLine" ref={topLineRef} />
        <div className="BottomLine" ref={bottomLineRef} />
        <div className="LeftLine" ref={leftLineRef} />
        <div className="RightLine" ref={rightLineRef} />
      </div>
    </div>
  );
};

export default SplashScreen;
