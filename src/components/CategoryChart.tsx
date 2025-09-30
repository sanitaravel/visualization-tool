import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CategoryData } from '../utils/dataProcessor';

/**
 * Props for the CategoryChart component
 */
interface CategoryChartProps {
  /** Array of category data for the chart */
  data: CategoryData[];
  /** Whether data is currently loading */
  loading: boolean;
}

/**
 * Component that displays a bar chart of question distribution by category
 */
const CategoryChart: React.FC<CategoryChartProps> = ({ data, loading }) => {
  // Calculate integer ticks for Y-axis to avoid duplicates
  const maxCount = data.length > 0 ? Math.max(...data.map(d => d.count)) : 0;
  const yTicks = Array.from({ length: maxCount + 1 }, (_, i) => i);

  if (loading) {
    return (
      <div className="chart-container">
        <h3>Questions by Category</h3>
        <div className="loading">Loading chart...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Questions by Category</h3>
        <div className="no-data">No data available</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Questions by Category</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={120}
            interval={0}
            fontSize={12}
            tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
          />
          <YAxis
            type="number"
            domain={[0, 'dataMax']}
            ticks={yTicks}
          />
          <Tooltip
            formatter={(value: number) => [`${value} questions`, 'Count']}
            labelStyle={{ color: '#000' }}
          />
          <Bar
            dataKey="count"
            fill="#8884d8"
            name="Questions"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryChart;