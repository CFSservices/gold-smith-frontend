/**
 * Admin Dashboard Page
 */

import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { formatCurrency, formatDate } from '@/utils/format';

// Mock data
const mockStats = [
  {
    title: 'Total Users',
    value: '1,234',
    icon: 'pi pi-users',
    color: 'bg-blue-500',
  },
  {
    title: 'Active Merchants',
    value: '456',
    icon: 'pi pi-building',
    color: 'bg-green-500',
  },
  {
    title: 'Total Revenue',
    value: formatCurrency(12500000),
    icon: 'pi pi-indian-rupee',
    color: 'bg-gold-500',
  },
  {
    title: 'Pending Approvals',
    value: '23',
    icon: 'pi pi-clock',
    color: 'bg-orange-500',
  },
];

const recentUsers = [
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@email.com', role: 'merchant', status: 'active', createdAt: new Date() },
  { id: 2, name: 'Priya Sharma', email: 'priya@email.com', role: 'user', status: 'pending', createdAt: new Date() },
  { id: 3, name: 'Amit Patel', email: 'amit@email.com', role: 'merchant', status: 'active', createdAt: new Date() },
  { id: 4, name: 'Sunita Devi', email: 'sunita@email.com', role: 'staff', status: 'active', createdAt: new Date() },
  { id: 5, name: 'Vikram Singh', email: 'vikram@email.com', role: 'merchant', status: 'suspended', createdAt: new Date() },
];

export function AdminDashboardPage() {
  // Chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue (in Lakhs)',
        data: [65, 59, 80, 81, 56, 95],
        fill: true,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderColor: '#f59e0b',
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
  };

  const statusTemplate = (rowData: { status: string }) => {
    const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      active: 'success',
      pending: 'warning',
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
    return <span className="capitalize">{rowData.role}</span>;
  };

  const dateTemplate = (rowData: { createdAt: Date }) => {
    return formatDate(rowData.createdAt);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="text-secondary-500 dark:text-secondary-400">
          Overview of your platform&apos;s performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat) => (
          <Card key={stat.title} className="shadow-sm">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center`}
              >
                <i className={`${stat.icon} text-2xl text-white`} />
              </div>
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card title="Revenue Trend" className="shadow-sm">
          <div style={{ height: '300px' }}>
            <Chart type="line" data={chartData} options={chartOptions} />
          </div>
        </Card>

        {/* User Distribution */}
        <Card title="User Distribution" className="shadow-sm">
          <div style={{ height: '300px' }}>
            <Chart
              type="doughnut"
              data={{
                labels: ['Merchants', 'Users', 'Staff', 'Admins'],
                datasets: [
                  {
                    data: [456, 650, 100, 28],
                    backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6'],
                    hoverBackgroundColor: ['#d97706', '#2563eb', '#059669', '#7c3aed'],
                  },
                ],
              }}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </Card>
      </div>

      {/* Recent Users Table */}
      <Card title="Recent User Registrations" className="shadow-sm">
        <DataTable
          value={recentUsers}
          stripedRows
          paginator
          rows={5}
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column field="name" header="Name" sortable />
          <Column field="email" header="Email" sortable />
          <Column field="role" header="Role" body={roleTemplate} sortable />
          <Column field="status" header="Status" body={statusTemplate} sortable />
          <Column
            field="createdAt"
            header="Registered"
            body={dateTemplate}
            sortable
          />
        </DataTable>
      </Card>
    </div>
  );
}

export default AdminDashboardPage;
