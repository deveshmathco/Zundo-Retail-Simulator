// components/BrandTable.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../styles/BrandTable.css';

const BrandTable = ({ brands, onDataChange, initialData = [], isEditing = false }) => {
    const [rows, setRows] = useState([]);
    const [availableBrands, setAvailableBrands] = useState([]);
    const onDataChangeRef = useRef(onDataChange);
    const prevIsEditingRef = useRef(isEditing);

    useEffect(() => {
        onDataChangeRef.current = onDataChange;
    }, [onDataChange]);

    useEffect(() => {
        if (prevIsEditingRef.current && !isEditing) {
            setRows([]);
            if (brands && Array.isArray(brands)) {
                setAvailableBrands(brands);
            }
            onDataChangeRef.current([]);
        }
        prevIsEditingRef.current = isEditing;
    }, [isEditing, brands]);

    useEffect(() => {
        if (!isEditing && brands && Array.isArray(brands)) {
            const initialRows = [];
            setRows(initialRows);
            setAvailableBrands(brands);
            onDataChangeRef.current(initialRows);
        }
    }, [brands, isEditing]); 

    useEffect(() => {
        if (isEditing && initialData && initialData.length > 0) {
            // //console.log("Loading initial data for editing:", initialData);
            
            const normalizedData = initialData.map(item => ({
                ...item,
                brand: typeof item.brand === 'object' ? item.brand : { id: item.brand, name: item.brand }
            }));
            
            setRows(normalizedData);
            
            if (brands && Array.isArray(brands)) {
                const usedBrandIds = normalizedData.map(row => row.brand?.id).filter(Boolean);
                const availableBrandsArray = brands.filter(brand => !usedBrandIds.includes(brand.id));
                setAvailableBrands(availableBrandsArray);
            }
            
            onDataChangeRef.current(normalizedData);
        }
        else if (initialData && initialData.length === 0) {
            //console.log("Resetting brand table - initialData is empty");
            setRows([]);
            if (brands && Array.isArray(brands)) {
                setAvailableBrands(brands);
            }
        }
    }, [initialData, isEditing, brands]);

    const handleAddRow = () => {
        if (availableBrands.length > 0) {
            const brandObject = availableBrands[0];
            const newRow = {
                brand: brandObject,
                active: false,
                optimise: false,
                min: 0,
                slider: 0,
                max: 100,
                budget: null,
            };
            //console.log("Adding new row with brand:", brandObject);
            setRows([...rows, newRow]);
            setAvailableBrands(prevBrands => prevBrands.slice(1));
            onDataChangeRef.current([...rows, newRow]);
        }
    };

    const handleRemoveRow = (index) => {
        const removedBrand = rows[index].brand;
        setAvailableBrands(prevBrands => [...prevBrands, removedBrand].sort((a, b) => a?.name?.localeCompare(b?.name) || 0));
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
        onDataChangeRef.current(newRows);
    };

    const handleChange = (index, field, value) => {
        const newRows = [...rows];
        newRows[index][field] = value;
        setRows(newRows);
        onDataChangeRef.current(newRows);
    };

    const handleBrandChange = (index, value) => {
        const oldBrand = rows[index].brand;
        const newRows = [...rows];
        newRows[index].brand = value;
        setRows(newRows);

        setAvailableBrands(prevBrands => {
            const updatedBrands = prevBrands.filter(brand => brand.id !== value.id);
            if (oldBrand) {
                updatedBrands.push(oldBrand);
            }
            return updatedBrands.sort((a, b) => a?.name?.localeCompare(b?.name) || 0);
        });
        onDataChangeRef.current(newRows);
    };

    return (
        <div className="brand-table-container">
            <table>
                <thead>
                    <tr>
                        <th>Brands</th>
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
                    {rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                <select
                                    style={{ width: '120px' }}
                                    value={row.brand?.name || ''}
                                    onChange={(e) => handleBrandChange(index, brands.find(brand => brand.name === e.target.value))}
                                >
                                    {availableBrands.concat(row.brand).filter(Boolean).sort((a, b) => a?.name?.localeCompare(b?.name) || 0).map(brand => (
                                        <option key={brand?.id} value={brand?.name}>{brand?.name}</option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={row.active}
                                        onChange={() => handleChange(index, 'active', !row.active)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </td>
                            <td>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={row.optimise}
                                        onChange={() => handleChange(index, 'optimise', !row.optimise)}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.min}
                                    onChange={(e) => handleChange(index, 'min', parseInt(e.target.value))}
                                />
                            </td>
                            <td>
                                <input
                                    type="range"
                                    min={row.min}
                                    max={row.max}
                                    value={row.slider}
                                    onChange={(e) => handleChange(index, 'slider', parseInt(e.target.value))}
                                />
                                <input
                                    type="number"
                                    value={row.slider}
                                    onChange={(e) => handleChange(index, 'slider', parseInt(e.target.value))}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.max}
                                    onChange={(e) => handleChange(index, 'max', parseInt(e.target.value))}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={row.budget}
                                    onChange={(e) => handleChange(index, 'budget', parseInt(e.target.value))}
                                />
                            </td>
                            <td>
                                <button className="remove-button" onClick={() => handleRemoveRow(index)}>
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                {availableBrands.length > 0 && (
                    <button
                        className="add-button"
                        onClick={handleAddRow}
                    >
                        Add a brand
                    </button>
                )}
                {availableBrands.length === 0 && <p className="no-more-brands-message">No more brands can be added</p>}
            </table>
        </div>
    );
};

export default BrandTable;