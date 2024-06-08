import React from "react";

import {
  CheckCircleFilled,
  CheckCircleOutlined,
  MinusCircleFilled,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { Tag, TagProps } from "antd";

type Props = {
  stage: string;
};

/**
 * Renders a tag component representing the deal stage.
 * @param stage - The contact stage.
 */
export const DealStageTag = ({ stage }: Props) => {
  let icon: React.ReactNode = null;
  let color: TagProps["color"] = undefined;

  switch (stage) {
    case "UNASSIGNED":
    case "NEW":
      icon = <PlayCircleOutlined />;
      color = "cyan";
      break;
      
    case "FOLLOW-UP":
    case "UNDER REVIEW":
    case "DEMO":
      icon = <CheckCircleOutlined />;
      color = "green";
      break;

    case "LOST":
      icon = <MinusCircleFilled />;
      color = "red";
      break;

    case "WON":
      icon = <CheckCircleFilled />;
      color = "green";
      break;

    default:
      break;
  }

  return (
    <Tag color={color} style={{ textTransform: "capitalize" }}>
      {icon} {stage.toLowerCase()}
    </Tag>
  );
};