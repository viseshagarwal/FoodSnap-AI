import { FaFire, FaBullseye, FaDumbbell, FaChartLine } from "react-icons/fa";
import StatsCard from "./StatsCard";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Today's Calories"
        value="1,200"
        icon={FaFire}
        trend={5}
        color="orange"
      />
      <StatsCard
        title="Remaining Goal"
        value="800"
        icon={FaBullseye}
        color="indigo"
      />
      <StatsCard
        title="Protein"
        value="65g"
        icon={FaDumbbell}
        trend={-2}
        color="purple"
      />
      <StatsCard
        title="Weekly Progress"
        value="85%"
        icon={FaChartLine}
        trend={12}
        color="pink"
      />
    </div>
  );
}
