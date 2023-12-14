import React from "react";

export function Send(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size || "1em"}
      height={props.size || "1em"}
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill={props.color || "#24c260"}
        d="M3 20v-6l8-2l-8-2V4l19 8l-19 8Z"
      ></path>
    </svg>
  );
}
export default Send;
