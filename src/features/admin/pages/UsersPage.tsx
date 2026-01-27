/**
 * Admin Users Management Page
 */

import { useState } from 'react';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { Dropdown } from 'primereact/dropdown';
import { formatDate, getInitials } from '@/utils/format';
import { Icon } from '@/components/ui/Icon';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';

// Mock data
const mockUsers = [
  { id: '1', firstName: 'Rajesh', lastName: 'Kumar', email: 'rajesh@email.com', phone: '9876543210', role: 'merchant', status: 'active', createdAt: '2024-01-15' },
  { id: '2', firstName: 'Priya', lastName: 'Sharma', email: 'priya@email.com', phone: '9876543211', role: 'user', status: 'pending', createdAt: '2024-02-20' },
  { id: '3', firstName: 'Amit', lastName: 'Patel', email: 'amit@email.com', phone: '9876543212', role: 'merchant', status: 'active', createdAt: '2024-03-10' },
  { id: '4', firstName: 'Sunita', lastName: 'Devi', email: 'sunita@email.com', phone: '9876543213', role: 'staff', status: 'active', createdAt: '2024-03-15' },
  { id: '5', firstName: 'Vikram', lastName: 'Singh', email: 'vikram@email.com', phone: '9876543214', role: 'merchant', status: 'suspended', createdAt: '2024-04-01' },
  { id: '6', firstName: 'Meera', lastName: 'Nair', email: 'meera@email.com', phone: '9876543215', role: 'user', status: 'active', createdAt: '2024-04-10' },
  { id: '7', firstName: 'Suresh', lastName: 'Reddy', email: 'suresh@email.com', phone: '9876543216', role: 'merchant', status: 'active', createdAt: '2024-04-15' },
  { id: '8', firstName: 'Anita', lastName: 'Gupta', email: 'anita@email.com', phone: '9876543217', role: 'staff', status: 'inactive', createdAt: '2024-05-01' },
];

const roleOptions = [
  { label: 'All Roles', value: null },
  { label: 'Admin', value: 'admin' },
  { label: 'Merchant', value: 'merchant' },
  { label: 'User', value: 'user' },
  { label: 'Staff', value: 'staff' },
];

const statusOptions = [
  { label: 'All Status', value: null },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' },
];

export function UsersPage() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Filter users
  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      !globalFilter ||
      user.firstName.toLowerCase().includes(globalFilter.toLowerCase()) ||
      user.lastName.toLowerCase().includes(globalFilter.toLowerCase()) ||
      user.email.toLowerCase().includes(globalFilter.toLowerCase());

    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Templates
  const nameTemplate = (rowData: { firstName: string; lastName: string; email: string }) => {
    return (
      <div className="flex items-center gap-3">
        <Avatar
          label={getInitials(`${rowData.firstName} ${rowData.lastName}`)}
          shape="circle"
          className="bg-gold-500 text-white"
        />
        <div>
          <p className="font-medium text-secondary-900 dark:text-white">
            {rowData.firstName} {rowData.lastName}
          </p>
          <p className="text-sm text-secondary-500">{rowData.email}</p>
        </div>
      </div>
    );
  };

  const statusTemplate = (rowData: { status: string }) => {
    const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      active: 'success',
      pending: 'warning',
      inactive: 'info',
      suspended: 'danger',
    };
    return (
      <Tag
        value={rowData.status}
        severity={statusColors[rowData.status]}
        className="capitalize"
      />
    );
  };

  const roleTemplate = (rowData: { role: string }) => {
    const roleColors: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      merchant: 'bg-gold-100 text-gold-800 dark:bg-gold-900/30 dark:text-gold-400',
      user: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      staff: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${roleColors[rowData.role]}`}
      >
        {rowData.role}
      </span>
    );
  };

  const dateTemplate = (rowData: { createdAt: string }) => {
    return formatDate(rowData.createdAt);
  };

  const actionsTemplate = () => {
    return (
      <div className="flex items-center gap-2">
        <Button icon={<PrimeReactIcon name="visibility" size={18} />} text severity="info" size="small" tooltip="View" />
        <Button icon={<PrimeReactIcon name="edit" size={18} />} text severity="warning" size="small" tooltip="Edit" />
        <Button icon={<PrimeReactIcon name="delete" size={18} />} text severity="danger" size="small" tooltip="Delete" />
      </div>
    );
  };

  // Header with filters
  const header = (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
      <div className="flex flex-wrap gap-2">
        <span className="p-input-icon-left">
          <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search users..."
            className="w-64"
          />
        </span>
        <Dropdown
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.value as string | null)}
          options={roleOptions}
          optionLabel="label"
          optionValue="value"
          placeholder="Filter by Role"
          className="w-40"
        />
        <Dropdown
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.value as string | null)}
          options={statusOptions}
          optionLabel="label"
          optionValue="value"
          placeholder="Filter by Status"
          className="w-40"
        />
      </div>
      <Button label="Add User" icon={<PrimeReactIcon name="add" size={20} />} />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          User Management
        </h1>
        <p className="text-secondary-500 dark:text-secondary-400">
          Manage users, roles, and permissions
        </p>
      </div>

      {/* Users Table */}
      <Card className="shadow-sm">
        <DataTable
          value={filteredUsers}
          header={header}
          stripedRows
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          tableStyle={{ minWidth: '60rem' }}
          emptyMessage="No users found"
        >
          <Column header="User" body={nameTemplate} sortable sortField="firstName" />
          <Column field="phone" header="Phone" sortable />
          <Column header="Role" body={roleTemplate} sortable sortField="role" />
          <Column header="Status" body={statusTemplate} sortable sortField="status" />
          <Column header="Registered" body={dateTemplate} sortable sortField="createdAt" />
          <Column header="Actions" body={actionsTemplate} style={{ width: '150px' }} />
        </DataTable>
      </Card>
    </div>
  );
}

export default UsersPage;
