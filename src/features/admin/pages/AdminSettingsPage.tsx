/**
 * Admin Settings Page
 */

import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputSwitch } from 'primereact/inputswitch';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';

export function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
          Admin Settings
        </h1>
        <p className="text-secondary-500 dark:text-secondary-400">
          Configure system-wide settings for the platform
        </p>
      </div>

      {/* General Settings */}
      <Card title="General Settings" className="shadow-sm">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Application Name
              </label>
              <InputText value="Gold Smith" className="w-full" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Support Email
              </label>
              <InputText value="support@goldsmith.com" className="w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Contact Phone
              </label>
              <InputText value="+91 98765 43210" className="w-full" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Business Address
              </label>
              <InputText value="Mumbai, Maharashtra, India" className="w-full" />
            </div>
          </div>
        </div>
      </Card>

      {/* Gold Rate Settings */}
      <Card title="Gold Rate Settings" className="shadow-sm">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                24K Gold Rate (per gram)
              </label>
              <InputNumber
                value={6250}
                mode="currency"
                currency="INR"
                locale="en-IN"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                22K Gold Rate (per gram)
              </label>
              <InputNumber
                value={5729}
                mode="currency"
                currency="INR"
                locale="en-IN"
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                18K Gold Rate (per gram)
              </label>
              <InputNumber
                value={4688}
                mode="currency"
                currency="INR"
                locale="en-IN"
                className="w-full"
              />
            </div>
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">
                Auto-update Gold Rates
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Automatically fetch gold rates from external API
              </p>
            </div>
            <InputSwitch checked={true} onChange={() => {}} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">
                Price Update Notifications
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Notify merchants when gold prices are updated
              </p>
            </div>
            <InputSwitch checked={true} onChange={() => {}} />
          </div>
        </div>
      </Card>

      {/* Registration Settings */}
      <Card title="Registration Settings" className="shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">
                Allow New Registrations
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Enable or disable new user registrations
              </p>
            </div>
            <InputSwitch checked={true} onChange={() => {}} />
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">
                Email Verification Required
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Require email verification for new accounts
              </p>
            </div>
            <InputSwitch checked={true} onChange={() => {}} />
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">
                Admin Approval for Merchants
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Require admin approval for merchant accounts
              </p>
            </div>
            <InputSwitch checked={true} onChange={() => {}} />
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card title="Security Settings" className="shadow-sm">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Session Timeout (minutes)
              </label>
              <InputNumber value={30} min={5} max={120} className="w-full" />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Max Login Attempts
              </label>
              <InputNumber value={5} min={3} max={10} className="w-full" />
            </div>
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">
                Two-Factor Authentication
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Require 2FA for admin accounts
              </p>
            </div>
            <InputSwitch checked={false} onChange={() => {}} />
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">
                Password Expiry
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Force password change every 90 days
              </p>
            </div>
            <InputSwitch checked={false} onChange={() => {}} />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button label="Reset to Defaults" severity="secondary" outlined />
        <Button label="Save Settings" icon={<PrimeReactIcon name="check" size={20} />} />
      </div>
    </div>
  );
}

export default AdminSettingsPage;
