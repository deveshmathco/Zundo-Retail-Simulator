// components/SavedScenarios.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchScenarios,
  setSelectedScenario,
} from "../redux/slices/scenariosSlice";
import "../styles/SavedScenarios.css";

const SavedScenarios = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { scenarios, loading, error } = useSelector((state) => state.scenarios);

  useEffect(() => {
    dispatch(fetchScenarios());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleEditScenario = (scenario) => {
    const formattedScenario = {
      ...scenario,
      tableData: scenario.tableData.map((item) => ({
        ...item,
        brand:
          typeof item.brand === "object"
            ? item.brand
            : { id: item.brand, name: item.brand },
      })),
    };

    dispatch(setSelectedScenario(formattedScenario));

    navigate("/build");
  };

  const renderAllScenariosTable = () => {
    if (!scenarios || scenarios.length === 0) return <p>No scenarios saved.</p>;

    const tableRows = [];
    scenarios.forEach((scenario) => {
      scenario.tableData.forEach((brandData) => {
        tableRows.push({
          scenarioId: scenario.id,
          scenarioName: scenario.scenarioName,
          optimizationStrategy: scenario.optimizationStrategy,
          simulationScope: scenario.simulationScope,
          brandName: brandData.brand.name || brandData.brand,
          active: brandData.active,
          optimise: brandData.optimise,
          min: brandData.min,
          slider: brandData.slider,
          max: brandData.max,
          budget: brandData.budget,
        });
      });
    });

    return (
      <table className="all-scenarios-table">
        <thead>
          <tr>
            <th>Scenario Name</th>
            <th>Optimization Strategy</th>
            <th>Simulation Scope</th>
            <th>Brand</th>
            <th>Active</th>
            <th>Optimise</th>
            <th>Min</th>
            <th>Slider</th>
            <th>Max</th>
            <th>Budget</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={`${row.scenarioId}-${row.brandName}-${index}`}>
              <td>{row.scenarioName}</td>
              <td>{row.optimizationStrategy}</td>
              <td>{row.simulationScope.join(", ")}</td>
              <td>{row.brandName}</td>
              <td>{row.active ? "Yes" : "No"}</td>
              <td>{row.optimise ? "Yes" : "No"}</td>
              <td>{row.min}</td>
              <td>{row.slider}</td>
              <td>{row.max}</td>
              <td>{row.budget}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() =>
                    handleEditScenario(
                      scenarios.find((s) => s.id === row.scenarioId)
                    )
                  }
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderScenarioTables = () => {
    if (!scenarios || scenarios.length === 0) return <p>No scenarios saved.</p>;

    return scenarios.map((scenario) => (
      <div key={scenario.id} className="scenario-table-container">
        <div className="scenario-header">
          <h3>{scenario.scenarioName}</h3>
          <button
            className="edit-button"
            onClick={() => handleEditScenario(scenario)}
          >
            Edit
          </button>
        </div>
        <div className="scenario-details">
          <p>
            <strong>Data Level:</strong> {scenario.dataLevel}
          </p>
          <p>
            <strong>Optimization Strategy:</strong>{" "}
            {scenario.optimizationStrategy}
          </p>
          <p>
            <strong>Simulation Scope:</strong>{" "}
            {scenario.simulationScope.join(", ") || "None"}
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Active</th>
              <th>Optimise</th>
              <th>Min</th>
              <th>Slider</th>
              <th>Max</th>
              <th>Budget</th>
            </tr>
          </thead>
          <tbody>
            {scenario.tableData.map((brandData, index) => (
              <tr key={index}>
                <td>{brandData.brand.name || brandData.brand}</td>
                <td>{brandData.active ? "Yes" : "No"}</td>
                <td>{brandData.optimise ? "Yes" : "No"}</td>
                <td>{brandData.min}</td>
                <td>{brandData.slider}</td>
                <td>{brandData.max}</td>
                <td>{brandData.budget}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  const renderColumnsPerScenario = () => {
    if (!scenarios || scenarios.length === 0) return <p>No scenarios saved.</p>;

    const allBrands = scenarios.reduce((brands, scenario) => {
      scenario.tableData.forEach((brandData) => {
        const brandIdentifier =
          typeof brandData.brand === "object"
            ? brandData.brand.id
            : brandData.brand;
        if (
          !brands.some((b) =>
            typeof b === "object"
              ? b.id === brandIdentifier
              : b === brandIdentifier
          )
        ) {
          brands.push(brandData.brand);
        }
      });
      return brands;
    }, []);

    return (
      <table>
        <thead>
          <tr>
            <th>Brand</th>
            {scenarios.map((scenario) => (
              <th colSpan="7" key={scenario.id}>
                {scenario.scenarioName}
                <button
                  className="small-edit-button"
                  onClick={() => handleEditScenario(scenario)}
                >
                  Edit
                </button>
              </th>
            ))}
          </tr>
          <tr>
            <th></th>
            {scenarios.map((scenario) => (
              <React.Fragment key={scenario.id}>
                <th>Active</th>
                <th>Optimise</th>
                <th>Min</th>
                <th>Slider</th>
                <th>Max</th>
                <th>Budget</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {allBrands.map((brand) => (
            <tr key={typeof brand === "object" ? brand.id : brand}>
              <td>{typeof brand === "object" ? brand.name : brand}</td>
              {scenarios.map((scenario) => {
                const brandData = scenario.tableData.find((data) =>
                  typeof data.brand === "object" && typeof brand === "object"
                    ? data.brand.id === brand.id
                    : data.brand === brand
                );
                if (brandData) {
                  return (
                    <React.Fragment
                      key={`${scenario.id}-${
                        typeof brand === "object" ? brand.id : brand
                      }`}
                    >
                      <td>{brandData.active ? "Yes" : "No"}</td>
                      <td>{brandData.optimise ? "Yes" : "No"}</td>
                      <td>{brandData.min}</td>
                      <td>{brandData.slider}</td>
                      <td>{brandData.max}</td>
                      <td>{brandData.budget}</td>
                    </React.Fragment>
                  );
                } else {
                  return (
                    <React.Fragment
                      key={`${scenario.id}-${
                        typeof brand === "object" ? brand.id : brand
                      }-empty`}
                    >
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </React.Fragment>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="saved-scenarios-container">
      <h2 className="page-title">Saved Scenarios</h2>
      <p className="page-subtitle">View and manage all your saved scenarios</p>

      <div className="scenarios-section">
        <h3>All Scenarios</h3>
        {renderAllScenariosTable()}
      </div>

      <div className="scenarios-section">
        <h3>Scenario Details</h3>
        {renderScenarioTables()}
      </div>

      <div className="scenarios-section">
        <h3>Brand Comparison</h3>
        {renderColumnsPerScenario()}
      </div>
    </div>
  );
};

export default SavedScenarios;
