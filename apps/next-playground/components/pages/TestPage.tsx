import { Tabs } from "asheeui";

const tabs = [
  { id: "1", label: "Tab 1", content: <div>Content 1</div> },
  { id: "2", label: "Tab 2", content: <div>Content 2</div> },
  { id: "3", label: "Tab 3", content: <div>Content 3</div> },
];

export default function TabsSizeDemo() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs size="sm" tabs={tabs} />
      <Tabs size="md" tabs={tabs} />
      <Tabs size="lg" tabs={tabs} />
    </div>
  );
}
