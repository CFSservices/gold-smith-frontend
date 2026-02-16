/**
 * Schemes Management Page
 */

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { Tag } from "primereact/tag";
import { Avatar } from "primereact/avatar";
import { useState, useMemo } from "react";
import { schemesList, type Scheme } from "@/mocks/data/schemes";
import { SchemeDetailsModal } from "@/components/schemes/SchemeDetailsModal";
import { NewSchemeModal } from "@/components/schemes/NewSchemeModal";

export function SchemesPage() {
  const schemeTabs = [
    { label: " On Track ", value: "on_track" },
    { label: " Completed ", value: "completed" },
    { label: " Breached ", value: "breached" },
    { label: " Paused ", value: "paused" },
    { label: " Stopped ", value: "stopped" },
  ];

  const [status, setStatus] = useState<"on_track" | "completed" | "breached" | "paused" | "stopped">("on_track");
  const [search, setSearch] = useState("");
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>(schemesList);
  const [showNewSchemeModal, setShowNewSchemeModal] = useState(false);

  // Count schemes by status
  const statusCounts = useMemo(() => {
    return {
      on_track: schemes.filter((s) => s.status === "on_track").length,
      completed: schemes.filter((s) => s.status === "completed").length,
      breached: schemes.filter((s) => s.status === "breached").length,
      paused: schemes.filter((s) => s.status === "paused").length,
      stopped: schemes.filter((s) => s.status === "stopped").length,
    };
  }, [schemes]);

  // Update tab labels with counts
  const tabsWithCounts = schemeTabs.map((tab) => ({
    ...tab,
    label: `${tab.label}(${statusCounts[tab.value as keyof typeof statusCounts]})`,
  }));

  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      const matchStatus = s.status === status;
      const matchSearch =
        s.schemeId.toLowerCase().includes(search.toLowerCase()) ||
        s.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        s.customer.email.toLowerCase().includes(search.toLowerCase()) ||
        s.plan.name.toLowerCase().includes(search.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [status, search, schemes]);

  // Row number template
  const rowNumberTemplate = (rowData: Scheme) => {
    const rowIndex = filteredSchemes.findIndex((scheme) => scheme.id === rowData.id);
    return <span>{rowIndex + 1}</span>;
  };

  // Scheme ID, Plan, Monthly Deposit template
  const schemeInfoTemplate = (row: Scheme) => (
    <div className="flex flex-col gap-1 min-w-0">
      <div className="font-semibold text-xs sm:text-sm md:text-base text-secondary-900 dark:text-white break-words">
        {row.schemeId}
      </div>
      <div className="text-xs sm:text-sm text-secondary-700 dark:text-secondary-300 break-words">
        {row.plan.name} ({row.plan.code})
      </div>
      <div className="text-xs sm:text-sm font-medium text-secondary-600 dark:text-secondary-400">
        ₹{row.monthlyDeposit.toLocaleString()} / month
      </div>
      {/* Mobile customer info */}
      <div className="sm:hidden mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Avatar
            image={row.customer.avatar}
            label={row.customer.name.charAt(0)}
            shape="circle"
            className="w-6 h-6 flex-shrink-0"
          />
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <div className="font-semibold text-xs text-secondary-900 dark:text-white truncate">
              {row.customer.name}
            </div>
            <div className="text-xs text-secondary-500 dark:text-secondary-500 truncate">
              {row.customer.phone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Customer template
  const customerTemplate = (row: Scheme) => (
    <div className="flex items-center gap-2 sm:gap-3">
      <Avatar
        image={row.customer.avatar}
        label={row.customer.name.charAt(0)}
        shape="circle"
        className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
      />
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <div className="font-semibold text-xs sm:text-sm md:text-base text-secondary-900 dark:text-white truncate">
          {row.customer.name}
        </div>
        <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 truncate">
          {row.customer.email}
        </div>
        <div className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-500">
          {row.customer.phone}
        </div>
      </div>
    </div>
  );

  // Status template
  const statusTemplate = (row: Scheme) => {
    const statusConfig: Record<
      string,
      { label: string; severity: "success" | "warning" | "danger" | "info" | null; color: string }
    > = {
      on_track: {
        label: "On Track",
        severity: "success",
        color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      },
      completed: {
        label: "Completed",
        severity: "success",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      },
      breached: {
        label: "Breaching",
        severity: "warning",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      },
      paused: {
        label: "Paused",
        severity: "info",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      },
      stopped: {
        label: "Stopped",
        severity: "danger",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      },
    };

    const config = statusConfig[row.status];

    return (
      <div className="flex flex-col gap-1.5 sm:gap-2 min-w-[160px] sm:min-w-[200px] md:min-w-[250px]">
        <Tag
          value={config.label}
          severity={config.severity}
          className="w-fit text-xs sm:text-sm"
        />
        <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400">
          {row.progress.completed} of {row.progress.total} Done
        </div>
        {row.dues.hasDues ? (
          <div className="text-xs sm:text-sm text-red-600 dark:text-red-400 break-words">
            {row.dues.currentDue}
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-green-600 dark:text-green-400">No Dues</div>
        )}
        {row.dues.nextDue && (
          <div className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 break-words">
            {row.dues.nextDue}
          </div>
        )}
        {row.gracePeriod?.isActive && (
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            <i className="pi pi-exclamation-triangle text-yellow-600 dark:text-yellow-400 text-xs sm:text-sm flex-shrink-0" />
            <span className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400 break-words">
              {row.gracePeriod.message}
            </span>
          </div>
        )}
      </div>
    );
  };

  // Actions template
  const actionsTemplate = (row: Scheme) => {
    return (
      <div className="flex items-center gap-2 sm:gap-3" onClick={(e) => e.stopPropagation()}>
        <Button
          icon="pi pi-box"
          text
          severity="warning"
          size="small"
          className="text-amber-700 dark:text-amber-500"
        />
        <div className="relative">
          <Button
            icon="pi pi-gift"
            text
            severity="warning"
            size="small"
            className="text-amber-700 dark:text-amber-500"
          />
          {row.dues.hasDues ? (
            <i className="pi pi-exclamation-circle absolute -top-1 -right-1 text-red-500 text-xs" />
          ) : (
            <i className="pi pi-check-circle absolute -top-1 -right-1 text-green-500 text-xs" />
          )}
        </div>
      </div>
    );
  };

  // Handle row click
  const onRowClick = (e: any) => {
    // PrimeReact DataTable onRowClick event structure
    const target = e.originalEvent?.target as HTMLElement;
    
    // Don't open modal if clicking on interactive elements
    if (target && (
      target.tagName === 'BUTTON' || 
      target.closest('button') || 
      target.closest('.p-dropdown') ||
      target.closest('.p-inputtext') ||
      target.closest('input')
    )) {
      return;
    }
    
    // Get the scheme data from the event
    const scheme = e.data as Scheme;
    if (scheme) {
      setSelectedScheme(scheme);
    }
  };

  // Handle pause scheme
  const handlePauseScheme = (schemeId: number) => {
    // Update the scheme status to paused
    setSchemes((prevSchemes) =>
      prevSchemes.map((s) =>
        s.id === schemeId ? { ...s, status: 'paused' as const } : s
      )
    );
    
    // Update selected scheme if it's the one being paused
    if (selectedScheme && selectedScheme.id === schemeId) {
      setSelectedScheme({ ...selectedScheme, status: 'paused' as const });
    }
  };

  // Handle scheme update (e.g., after payment recording)
  const handleSchemeUpdate = (updatedScheme: Scheme) => {
    setSchemes((prevSchemes) =>
      prevSchemes.map((s) => (s.id === updatedScheme.id ? updatedScheme : s))
    );
    setSelectedScheme(updatedScheme);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 flex-shrink-0 px-2 sm:px-4 lg:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-white mt-0">
            Schemes
          </h1>
          <p className="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 mt-1">
            Schemes
          </p>
        </div>
        <Button
          label="New Scheme"
          icon="pi pi-plus-circle"
          severity="warning"
          className="w-full sm:w-auto text-sm sm:text-base"
          onClick={() => setShowNewSchemeModal(true)}
        />
      </div>

      <hr className="border-gray-300 dark:border-gray-700 my-4 flex-shrink-0" />

      {/* Tabs + Search */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mt-4 sm:mt-8 mb-4 px-2 sm:px-4 lg:px-8 flex-shrink-0">
        <div className="w-full lg:w-auto overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
          <SelectButton
            value={status}
            onChange={(e) => setStatus(e.value)}
            options={tabsWithCounts}
            className="flex-nowrap text-xs sm:text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <Button
            icon="pi pi-filter"
            text
            severity="secondary"
            className="flex-shrink-0 hidden sm:inline-flex"
            tooltip="Filter"
          />
          <span className="p-input-icon-left relative flex-1 lg:flex-initial lg:w-64">
            <i className="pi pi-search absolute left-3 top-8 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 pointer-events-none" />
            <InputText
              placeholder="Search"
              className="w-full lg:w-64 pl-10 pr-3 text-sm sm:text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden px-2 sm:px-4 lg:px-0">
        <DataTable
          value={filteredSchemes}
          scrollable
          scrollHeight="calc(100vh - 300px)"
          onRowClick={onRowClick}
          rowClassName={() => "cursor-pointer hover:bg-gray-50 dark:hover:bg-secondary-800"}
          dataKey="id"
          responsiveLayout="scroll"
          className="text-xs sm:text-sm md:text-base"
          emptyMessage="No schemes found"
        >
          <Column
            header="#"
            body={rowNumberTemplate}
            style={{ width: "50px", minWidth: "50px" }}
            className="text-center"
          />
          <Column
            header="Scheme ID, Plan, Monthly Deposit"
            body={schemeInfoTemplate}
            style={{ minWidth: "180px" }}
          />
          <Column
            header="Customer"
            body={customerTemplate}
            style={{ minWidth: "180px" }}
            className="hidden sm:table-cell"
          />
          <Column
            field="startedOn"
            header="Started On"
            style={{ minWidth: "100px" }}
            className="hidden lg:table-cell"
          />
          <Column
            header="Current Status"
            body={statusTemplate}
            style={{ minWidth: "180px" }}
          />
          <Column
            header="Actions"
            body={actionsTemplate}
            style={{ width: "100px", minWidth: "100px" }}
            className="text-center"
          />
        </DataTable>
      </div>

      {/* Scheme Details Modal */}
      {selectedScheme && (
        <SchemeDetailsModal
          scheme={selectedScheme}
          visible={true}
          onHide={() => {
            setSelectedScheme(null);
          }}
          onPause={handlePauseScheme}
          onUpdate={handleSchemeUpdate}
        />
      )}

      {/* New Scheme Modal */}
      <NewSchemeModal
        visible={showNewSchemeModal}
        onHide={() => setShowNewSchemeModal(false)}
        onCreateScheme={(schemeData) => {
          // Map NewSchemeModal data to Scheme type and add to list
          setSchemes((prevSchemes) => {
            const nextId = prevSchemes.length > 0 ? Math.max(...prevSchemes.map((s) => s.id)) + 1 : 1;

            const today = new Date();
            const dd = String(today.getDate()).padStart(2, "0");
            const mm = String(today.getMonth() + 1).padStart(2, "0");
            const yyyy = today.getFullYear();
            const startedOn = `${dd}/${mm}/${yyyy}`;

            const newSchemeId = `#${Date.now()}`;

            const newScheme: Scheme = {
              id: nextId,
              schemeId: newSchemeId,
              plan: {
                name: schemeData.plan.name,
                code: schemeData.plan.code,
              },
              monthlyDeposit: schemeData.monthlyDeposit,
              customer: {
                name: schemeData.customer.name,
                email: schemeData.customer.email || "",
                phone: schemeData.customer.phone,
                avatar: schemeData.customer.avatar || "assets/users/u1.jpg",
              },
              startedOn,
              status: "on_track",
              progress: {
                completed: 0,
                total: schemeData.plan.tenure,
              },
              dues: {
                hasDues: false,
              },
              totalPaid: 0,
              totalAmount: schemeData.plan.tenure * schemeData.monthlyDeposit,
            };

            return [...prevSchemes, newScheme];
          });

          // Close the modal after adding
          setShowNewSchemeModal(false);

          // Ensure the "On Track" tab is selected so the new scheme is visible
          setStatus("on_track");
        }}
      />
    </div>
  );
}

export default SchemesPage;
