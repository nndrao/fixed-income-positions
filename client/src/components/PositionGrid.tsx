import { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Position } from "../pages/PositionDashboard";

interface PositionGridProps {
  positions: Position[];
}

export function PositionGrid({ positions }: PositionGridProps) {
  const columnDefs = useMemo<ColDef[]>(() => [
    { 
      field: "symbol", 
      headerName: "Symbol",
      pinned: "left",
      filter: "agTextColumnFilter"
    },
    { 
      field: "quantity", 
      headerName: "Quantity",
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => params.value.toLocaleString()
    },
    { 
      field: "price", 
      headerName: "Price",
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => params.value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    },
    { 
      field: "marketValue", 
      headerName: "Market Value",
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => params.value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      })
    },
    { 
      field: "pnl", 
      headerName: "P&L",
      filter: "agNumberColumnFilter",
      cellStyle: (params) => ({
        color: params.value >= 0 ? '#16a34a' : '#dc2626'
      }),
      valueFormatter: (params) => params.value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        signDisplay: 'always'
      })
    },
    { 
      field: "timestamp", 
      headerName: "Last Update",
      filter: "agDateColumnFilter",
      valueFormatter: (params) => new Date(params.value).toLocaleTimeString()
    }
  ], []);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
  }), []);

  return (
    <div className="ag-theme-alpine w-full h-[600px] mt-4">
      <AgGridReact
        rowData={positions}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowSelection="multiple"
        suppressRowClickSelection={false}
      />
    </div>
  );
}
