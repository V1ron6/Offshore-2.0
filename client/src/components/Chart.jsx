/**
 * ========================================
 * Chart Component
 * ========================================
 * 
 * Simple bar and line charts for data visualization.
 * 
 * Props:
 * - type: 'bar' | 'line' - Chart type
 * - data: array - Chart data points
 * - dataKey: string - Key for values in data
 * - xAxisKey: string - Key for x-axis labels
 * - color: string - Chart color hex code
 * - height: number - Chart height in pixels
 * - showLegend: boolean - Show legend
 * 
 * USAGE:
 * Display sales, analytics, or other metrics.
 * 
 * Example:
 * <Chart 
 *   type="bar" 
 *   data={[
 *     { name: 'Jan', value: 400 },
 *     { name: 'Feb', value: 300 },
 *     { name: 'Mar', value: 500 }
 *   ]}
 *   dataKey="value"
 *   xAxisKey="name"
 *   color="#ef4444"
 * />
 * 
 * <Chart 
 *   type="line" 
 *   data={salesData}
 *   height={400}
 * />
 */

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Chart = ({
  type = 'bar',
  data = [],
  dataKey = 'value',
  xAxisKey = 'name',
  color = '#ef4444',
  height = 300,
  showLegend = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const chartProps = {
    data,
    margin: { top: 5, right: 30, left: 0, bottom: 5 }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      {type === 'bar' ? (
        <BarChart {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          {showLegend && <Legend />}
          <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
        </BarChart>
      ) : (
        <LineChart {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          {showLegend && <Legend />}
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ fill: color }} />
        </LineChart>
      )}
    </ResponsiveContainer>
  );
};

export default Chart;
