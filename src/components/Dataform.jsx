// components/DataForm.jsx
import React, { useState, useEffect } from "react";
import "../styles/DataForm.css";
import BrandTable from "./BrandTable";

import {
  addScenario,
  updateScenario,
  fetchScenarios,
  clearSelectedScenario,
} from "../redux/slices/scenariosSlice";
import { useDispatch, useSelector } from "react-redux";

const DataForm = () => {
  const [dataLevel, setDataLevel] = useState("");
  const [optimizationStrategy, setOptimizationStrategy] =
    useState("Minimise cost");
  const [simulationScope, setSimulationScope] = useState([]);
  const [scenarioName, setScenarioName] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [scenarioId, setScenarioId] = useState(null);
  const [nameError, setNameError] = useState(false);

  const dispatch = useDispatch();
  const { brands: reduxBrands, selectedScenario } = useSelector(
    (state) => state.scenarios
  );

  useEffect(() => {
    if (selectedScenario) {
      //console.log("Loading scenario for editing:", selectedScenario);
      setDataLevel(selectedScenario.dataLevel || "");
      setOptimizationStrategy(
        selectedScenario.optimizationStrategy || "Minimise cost"
      );
      setSimulationScope(selectedScenario.simulationScope || []);
      setScenarioName(selectedScenario.scenarioName || "");

      // deep copy of tableData to prevent reference issues
      const tableDataCopy = selectedScenario.tableData
        ? JSON.parse(JSON.stringify(selectedScenario.tableData))
        : [];
      setTableData(tableDataCopy);

      setIsEditing(true);
      setScenarioId(selectedScenario.id);
    }
  }, [selectedScenario]);

  const handleDataLevelChange = (e) => {
    setDataLevel(e.target.value);
  };

  const handleOptimizationStrategyChange = (e) => {
    setOptimizationStrategy(e.target.value);
  };

  const handleSimulationScopeChange = (option) => {
    if (simulationScope.includes(option)) {
      setSimulationScope(simulationScope.filter((item) => item !== option));
    } else {
      setSimulationScope([...simulationScope, option]);
    }
  };

  const handleTableDataChange = (data) => {
    setTableData(data);
  };

  const handleReset = () => {
    //console.log("Resetting form");
    setDataLevel("");
    setOptimizationStrategy("Minimise cost");
    setSimulationScope([]);
    setScenarioName("");

    setTableData([]);

    setIsEditing(false);
    setScenarioId(null);
    setNameError(false);
    dispatch(clearSelectedScenario());
  };

  const handleSubmit = () => {
    if (!scenarioName.trim()) {
      alert("'Name this Scenario' field cannot be empty");
      setNameError(true);
      return;
    }
    setNameError(false);

    if (!tableData || tableData.length === 0) {
      alert("Each scenario must have at least one brand");
      return;
    }

    const scenario = {
      dataLevel,
      optimizationStrategy,
      simulationScope,
      scenarioName,
      tableData,
    };

    if (isEditing && scenarioId) {
      dispatch(updateScenario({ ...scenario, id: scenarioId }))
        .then(() => {
          //console.log("Scenario updated successfully");
          dispatch(fetchScenarios());
          handleReset();
        })
        .catch((error) => {
          console.error("Error updating scenario:", error);
        });
    } else {
      dispatch(addScenario(scenario))
        .then(() => {
          //console.log("Scenario added successfully");
          dispatch(fetchScenarios());
          handleReset();
        })
        .catch((error) => {
          console.error("Error adding scenario:", error);
        });
    }
  };

  const options = [
    "Include Discounts",
    "Prioritize High Margin Items",
    "Limit to In-Stock Only",
    "Focus on Seasonal Products",
  ];

  return (
    <div className="data-form-container">
      <h2>
        {isEditing ? `Edit Scenario: ${scenarioName}` : "Create New Scenario"}
      </h2>
      {isEditing && (
        <div className="editing-indicator">
          <p>You are currently editing an existing scenario</p>
        </div>
      )}
      <div className="form-group">
        <label>Data Level</label>
        <select
          name="dataLevel"
          value={dataLevel}
          onChange={handleDataLevelChange}
          style={{ width: "150px" }}
        >
          <option value="" disabled>
            Options
          </option>
          <option value="Sparse">Sparse</option>
          <option value="Integrity">Integrity</option>
          <option value="Abstracted">Abstracted</option>
        </select>
      </div>
      <div className="form-group">
        <label>Optimization Strategy</label>
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              name="optimizationStrategy"
              value="Minimise cost"
              checked={optimizationStrategy === "Minimise cost"}
              onChange={handleOptimizationStrategyChange}
            />
            Minimise cost
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="optimizationStrategy"
              value="Maximise revenue"
              checked={optimizationStrategy === "Maximise revenue"}
              onChange={handleOptimizationStrategyChange}
            />
            Maximise revenue
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="optimizationStrategy"
              value="Balanced approach"
              checked={optimizationStrategy === "Balanced approach"}
              onChange={handleOptimizationStrategyChange}
            />
            Balanced approach
          </label>
        </div>
      </div>
      <div className="form-group">
        <label>Simulation Scope</label>
        <div className="simulation-scope-options">
          {options.map((option) => (
            <label key={option} className="checkbox-label">
              <input
                type="checkbox"
                value={option}
                checked={simulationScope.includes(option)}
                onChange={() => handleSimulationScopeChange(option)}
              />
              {option}
            </label>
          ))}
        </div>
      </div>
      <BrandTable
        brands={reduxBrands}
        onDataChange={handleTableDataChange}
        initialData={tableData}
        isEditing={isEditing}
      />
      <div className="flex-container">
        <div className="form-group">
          <label style={{ fontFamily: "Verdana", fontWeight: "bold" }}>
            Name this scenario <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            value={scenarioName}
            onChange={(e) => {
              setScenarioName(e.target.value);
              if (e.target.value.trim()) {
                setNameError(false);
              }
            }}
            style={{ borderColor: nameError ? "red" : "" }}
          />
          {nameError && (
            <div style={{ color: "red", fontSize: "0.8rem", marginTop: "5px" }}>
              Name this Scenario field cannot be empty
            </div>
          )}
        </div>
        <div className="button-group">
          <button className="form-button" onClick={handleSubmit}>
            {isEditing ? "Update" : "Submit"}
          </button>
          <button className="form-button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataForm;
