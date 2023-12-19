import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import "./SplashScreen.css"; // Import the CSS file
import ShootingStars from "./ShootingStars";

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
      {
        y: OrgHeight / 2 - OrgHeight / 4,
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
      }
    );

    bottomLineTimeline.fromTo(
      bottomLine,
      { y: OrgHeight, opacity: 0.5 },
      {
        y: OrgHeight / 2 - OrgHeight / 4,
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
      }
    );

    leftLineTimeline.fromTo(
      leftLine,
      { x: 0, opacity: 0.5 },
      {
        x: OrgWidth / 2 - OrgHeight / 4 ,
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
      }
    );

    rightLineTimeline.fromTo(
      rightLine,
      { x: OrgWidth, opacity: 0.5 },
      {
        x: OrgWidth / 2 - OrgHeight / 4 ,
        opacity: 1,
        duration: 1.5,
        ease: "power2.inOut",
      }
    );

    const XMTimeline = gsap.timeline({
      delay: 1.5,
    });

    XMTimeline.fromTo(".XM", { opacity: 0 }, { opacity: 1, duration: 0.5 });

    // Timeline for "O" appearing after "X"
    const OBCTimeline = gsap.timeline({
      delay: 1.7,
    });

    OBCTimeline.fromTo(".OBC", { opacity: 0 }, { opacity: 1, duration: 0.5 });

    // Timeline for "X" appearing after "O"
    const XTRTimeline = gsap.timeline({
      delay: 1.9,
    });
    XTRTimeline.fromTo(".XTR", { opacity: 0 }, { opacity: 1, duration: 0.5 });

    // Timeline for "0" appearing after "X"
    const OTMTimeline = gsap.timeline({
      delay: 2.1,
    });
    OTMTimeline.fromTo(".OTM", { opacity: 0 }, { opacity: 1, duration: 0.5 });

    // Timeline for "X" appearing after "O"
    const XLBTimeline = gsap.timeline({
      delay: 2.3,
    });
    XLBTimeline.fromTo(".XLB", { opacity: 0 }, { opacity: 1, duration: 0.5 });
XLBTimeline.to(".XM, .XTR, .XLB", { scale: 1.15, duration: 0.5 }, "-=0.5");
    gsap
      .timeline()
      .add([
        topLineTimeline,
        bottomLineTimeline,
        leftLineTimeline,
        rightLineTimeline,
        XMTimeline,
        OBCTimeline,
        XTRTimeline,
        OTMTimeline,
        XLBTimeline,
      ]);

    return () => {
      topLineTimeline.kill();
      bottomLineTimeline.kill();
      leftLineTimeline.kill();
      rightLineTimeline.kill();
    };
  }, []);

  return (
    <>
      <div className="SSContainer">
        <div>
          <div className="TopLine" ref={topLineRef} />
          <div className="BottomLine" ref={bottomLineRef} />
          <div className="LeftLine" ref={leftLineRef} />
          <div className="RightLine" ref={rightLineRef} />
        </div>
        <div className="Content">
          <p className="XM">X</p>
          <p className="OBC">O</p>
          <p className="XTR">X</p>
          <p className="OTM">O</p>
          <p className="XLB">X</p>
        </div>
      </div>
      <div className="SSBox">
        <ShootingStars />
      </div>
    </>
  );
};

export default SplashScreen;
