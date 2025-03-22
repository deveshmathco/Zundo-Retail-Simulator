import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchScenarios } from "../redux/slices/scenariosSlice";
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  ComposedChart,
} from "recharts";
import "../styles/Dashboard.css";

const COLORS = [
  "#624CAB",
  "#A088C2",
  "#4A2A7A",
  "#C0A9E2",
  "#7B68EE",
  "#9370DB",
  "#8A2BE2",
];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { scenarios, loading } = useSelector((state) => state.scenarios);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [scenarioOptions, setScenarioOptions] = useState([]);

  useEffect(() => {
    dispatch(fetchScenarios());

    const intervalId = setInterval(() => {
      dispatch(fetchScenarios());
    }, 30000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  useEffect(() => {
    if (scenarios && scenarios.length > 0) {
      setScenarioOptions(
        scenarios.map((scenario) => ({
          id: scenario.id,
          name: scenario.scenarioName,
        }))
      );

      if (!selectedScenario) {
        setSelectedScenario(scenarios[0].id);
      }
    }
  }, [scenarios, selectedScenario]);

  const handleScenarioChange = (event) => {
    setSelectedScenario(event.target.value);
  };

  const getCurrentScenario = () => {
    if (!selectedScenario || !scenarios) return null;
    return scenarios.find((scenario) => scenario.id === selectedScenario);
  };

  const getSliderVsConstraintsData = () => {
    const scenario = getCurrentScenario();
    if (!scenario || !scenario.tableData) return [];

    return scenario.tableData.map((item) => ({
      name: item.brand.name || item.brand,
      min: item.min,
      max: item.max,
      slider: item.slider,
    }));
  };

  const getBudgetDistributionData = () => {
    const scenario = getCurrentScenario();
    if (!scenario || !scenario.tableData) return [];

    return scenario.tableData
      .filter((item) => item.budget > 0)
      .map((item) => ({
        name: item.brand.name || item.brand,
        value: parseInt(item.budget) || 0,
      }));
  };

  const getUtilizationRatioData = () => {
    const scenario = getCurrentScenario();
    if (!scenario || !scenario.tableData) return [];

    return scenario.tableData.map((item) => ({
      name: item.brand.name || item.brand,
      utilizationRatio: item.max > 0 ? (item.slider / item.max) * 100 : 0,
    }));
  };

  const getActiveBrandsData = () => {
    const scenario = getCurrentScenario();
    if (!scenario || !scenario.tableData)
      return { active: 0, inactive: 0, total: 0 };

    const active = scenario.tableData.filter((item) => item.active).length;
    const total = scenario.tableData.length;

    return [
      { name: "Active", value: active },
      { name: "Inactive", value: total - active },
    ];
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!scenarios || scenarios.length === 0)
    return (
      <div className="no-data">
        No scenarios available. Please create a scenario first.
      </div>
    );

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <div className="scenario-selector">
        <label htmlFor="scenario-dropdown">Select Scenario:</label>
        <select
          id="scenario-dropdown"
          value={selectedScenario || ""}
          onChange={handleScenarioChange}
        >
          {scenarioOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <div className="charts-container">
        {/* Slider vs Constraints Chart */}
        <div className="chart-card">
          <h3>Slider Values vs Constraints</h3>
          <ResponsiveContainer
            width="100%"
            height={300}
            minHeight={250}
            aspect={window.innerWidth <= 480 ? 1 : undefined}
          >
            <ComposedChart
              data={getSliderVsConstraintsData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="min" fill="#8884d8" name="Min" />
              <Bar dataKey="max" fill="#82ca9d" name="Max" />
              <Line
                type="monotone"
                dataKey="slider"
                stroke="#ff7300"
                name="Slider"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Distribution Pie Chart */}
        <div className="chart-card">
          <h3>Budget Distribution</h3>
          <ResponsiveContainer
            width="100%"
            height={300}
            minHeight={250}
            aspect={window.innerWidth <= 480 ? 1 : undefined}
          >
            <PieChart>
              <Pie
                data={getBudgetDistributionData()}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getBudgetDistributionData().map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Utilization Ratio Chart */}
        <div className="chart-card">
          <h3>Utilization Ratio (Slider/Max %)</h3>
          <ResponsiveContainer
            width="100%"
            height={300}
            minHeight={250}
            aspect={window.innerWidth <= 480 ? 1 : undefined}
          >
            <BarChart
              data={getUtilizationRatioData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis unit="%" />
              <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              <Legend />
              <Bar
                dataKey="utilizationRatio"
                fill="#624CAB"
                name="Utilization Ratio"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Active Brands Ratio */}
        <div className="chart-card">
          <h3>Active vs Inactive Brands</h3>
          <ResponsiveContainer
            width="100%"
            height={300}
            minHeight={250}
            aspect={window.innerWidth <= 480 ? 1 : undefined}
          >
            <PieChart>
              <Pie
                data={getActiveBrandsData()}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                <Cell fill="#624CAB" />
                <Cell fill="#C0A9E2" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
