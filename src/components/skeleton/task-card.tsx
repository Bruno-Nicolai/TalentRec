import { Card, Skeleton } from "antd";

const TaskCardSkeleton = () => {
  return (
    <Card
      size="small"
      bodyStyle={{
        display: "flex",
        justifyContent: "center",
        gap: "8px",
      }}
      title={
        <Skeleton.Button
          active
          size="small"
          style={{
            width: "200px",
            height: "22px",
          }}
        />
      }
    >
      <Skeleton.Button
        active
        size="small"
        style={{
          width: "200px",
        }}
      />
      <Skeleton.Avatar active size="small" />
    </Card>
  );
};

export default TaskCardSkeleton;