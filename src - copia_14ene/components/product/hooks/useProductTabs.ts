import { useState } from "react";

export function useProductTabs() {
  const [activeTab, setActiveTab] = useState("identificacion");

  return { activeTab, setActiveTab };
}
