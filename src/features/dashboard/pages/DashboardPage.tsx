/**
 * User Dashboard Page
 */

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/utils/format';
import { Icon } from '@/components/ui/Icon';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';

// Mock data for demonstration
const mockStats = [
  {
    title: 'Total Gold Stock',
    value: '245.5g',
    icon: 'package_2', // Material Symbols
    change: '+12.5%',
    changeType: 'positive' as const,
  },
  {
    title: 'Today\'s Sales',
    value: formatCurrency(125000),
    icon: 'currency_rupee', // Material Symbols
    change: '+8.2%',
    changeType: 'positive' as const,
  },
  {
    title: 'Pending Orders',
    value: '8',
    icon: 'schedule', // Material Symbols
    change: '-2',
    changeType: 'negative' as const,
  },
  {
    title: 'Active Customers',
    value: '156',
    icon: 'person', // Material Symbols
    change: '+5',
    changeType: 'positive' as const,
  },
];

export function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.firstName ?? 'User'}!
        </h1>
        <p className="mt-1 text-gold-100">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat) => (
          <Card key={stat.title} className="shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <p
                  className={`text-sm mt-2 ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.change} from last week
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
                <Icon name={stat.icon} size={24} className="text-gold-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" className="shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            label="New Sale"
            icon={<PrimeReactIcon name="add" size={20} />}
            severity="success"
            className="w-full"
          />
          <Button
            label="Add Stock"
            icon={<PrimeReactIcon name="package_2" size={20} />}
            severity="info"
            className="w-full"
          />
          <Button
            label="View Orders"
            icon={<PrimeReactIcon name="list" size={20} />}
            severity="warning"
            className="w-full"
          />
          <Button
            label="Reports"
            icon={<PrimeReactIcon name="bar_chart" size={20} />}
            severity="help"
            className="w-full"
          />
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Transactions" className="shadow-sm">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b border-secondary-100 dark:border-secondary-700 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-100 dark:bg-secondary-700 flex items-center justify-center">
                    <Icon name="shopping_cart" size={20} className="text-secondary-500" />
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900 dark:text-white">
                      Order #{1000 + i}
                    </p>
                    <p className="text-sm text-secondary-500">
                      Gold Chain - 22K
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-secondary-900 dark:text-white">
                    {formatCurrency(15000 * i)}
                  </p>
                  <p className="text-sm text-green-600">Completed</p>
                </div>
              </div>
            ))}
          </div>
          <Button
            label="View All Transactions"
            link
            className="mt-4 p-0"
          />
        </Card>

        <Card title="Gold Rate Today" className="shadow-sm">
          <div className="space-y-4">
            <div className="p-4 bg-gold-50 dark:bg-gold-900/20 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    24K Gold (1g)
                  </p>
                  <p className="text-2xl font-bold text-gold-600">
                    {formatCurrency(6250)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm">
                    <Icon name="arrow_upward" size={12} />
                    +0.5%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    22K Gold (1g)
                  </p>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                    {formatCurrency(5729)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm">
                    <Icon name="arrow_upward" size={12} />
                    +0.5%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    18K Gold (1g)
                  </p>
                  <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                    {formatCurrency(4688)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-sm">
                    <Icon name="arrow_downward" size={12} />
                    -0.2%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
