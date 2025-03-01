import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatChartData } from "../../app/utils/chartHelpers";

export const ChartsTab = ({ comparisonData }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ChartCard
        title="Net Worth Comparison"
        description="Estimated artist net worth in millions USD"
        category="net_worth"
        tooltipFormatter={(value) => `$${value}M`}
        artistsData={comparisonData.insights.artists}
      />

      <ChartCard
        title="Earnings Per Performance"
        description="Average earnings per show in thousands USD"
        category="earnings_per_performance"
        tooltipFormatter={(value) => `$${value}K`}
        artistsData={comparisonData.insights.artists}
      />

      <ChartCard
        title="Global Influence"
        description="Industry impact score (scale of 1-10)"
        category="global_influence"
        yAxisDomain={[0, 10]}
        artistsData={comparisonData.insights.artists}
      />

      <ChartCard
        title="Awards & Recognition"
        description="Major awards won throughout career"
        category="awards_recognition"
        artistsData={comparisonData.insights.artists}
      />
    </div>
  );
};

// Reusable chart card component
const ChartCard = ({
  title,
  description,
  category,
  tooltipFormatter,
  yAxisDomain,
  artistsData,
}) => {
  const chartData = formatChartData(category, artistsData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={yAxisDomain} />
            <Tooltip formatter={tooltipFormatter} />
            <Legend />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
