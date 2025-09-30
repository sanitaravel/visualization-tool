import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { DifficultyData } from '../utils/dataProcessor';

/**
 * Props for the DifficultyChart component
 */
interface DifficultyChartProps {
  /** Array of difficulty data for the chart */
  data: DifficultyData[];
  /** Whether data is currently loading */
  loading: boolean;
}

/**
 * Component that displays a pie chart of question distribution by difficulty
 */
const DifficultyChart: React.FC<DifficultyChartProps> = ({ data, loading }) => {
  // Sort data in the correct order: Easy, Medium, Hard
//   const sortedData = React.useMemo(() => {
//     const order = ['Easy', 'Medium', 'Hard'];
//     return [...data].sort((a, b) => {
//       const aIndex = order.indexOf(a.name);
//       const bIndex = order.indexOf(b.name);
//       return aIndex - bIndex;
//     });
//   }, [data]);

  // Color scheme for difficulty levels
  const COLORS = {
    Easy: '#4CAF50',    // Green
    Medium: '#FF9800',  // Orange
    Hard: '#F44336'     // Red
  };

  // Custom tooltip component to show difficulty name in its color
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const name = data.payload.name;
      const color = COLORS[name as keyof typeof COLORS] || '#000000';
      return (
        <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <p style={{ color, margin: 0, fontWeight: 'bold' }}>
            {name}: {data.value} questions
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend component to ensure correct order
  const renderLegend = (props: any) => {
    const { payload } = props;
    // Sort payload to match our desired order
    const sortedPayload = payload?.sort((a: any, b: any) => {
      const order = ['Easy', 'Medium', 'Hard'];
      const aIndex = order.indexOf(a.value);
      const bIndex = order.indexOf(b.value);
      return aIndex - bIndex;
    });

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', justifyContent: 'center', gap: '20px' }}>
        {sortedPayload?.map((entry: any, index: number) => (
          <li key={`legend-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '12px', height: '12px', backgroundColor: entry.color, borderRadius: '2px' }}></span>
            <span style={{ color: entry.color }}>{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="chart-container">
        <h3>Questions by Difficulty</h3>
        <div className="loading">Loading chart...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Questions by Difficulty</h3>
        <div className="no-data">No data available</div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <h3>Questions by Difficulty</h3>
      <ResponsiveContainer width="100%" height={360}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name as keyof typeof COLORS] || '#8884d8'}
              />
            ))}
          </Pie>
          <Tooltip content={CustomTooltip} />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DifficultyChart;