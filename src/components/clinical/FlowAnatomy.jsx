import AnatomyAtlas from "@/components/dashboard/AnatomyAtlas";

export default function FlowAnatomy({ activeNode, onSelectNode }) {
  return (
    <AnatomyAtlas
      activeNode={activeNode}
      onSelectNode={onSelectNode}
      compact={true}
    />
  );
}
