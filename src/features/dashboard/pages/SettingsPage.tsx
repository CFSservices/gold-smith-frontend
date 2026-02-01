/**
 * Settings Page
 */

import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';

const themeOptions = [
  { label: 'Light', value: 'light', icon: 'light_mode' }, // Material Symbols
  { label: 'Dark', value: 'dark', icon: 'dark_mode' }, // Material Symbols
  { label: 'System', value: 'system', icon: 'computer' }, // Material Symbols
];

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Tamil', value: 'ta' },
  { label: 'Telugu', value: 'te' },
];

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const themeTemplate = (option: { label: string; value: string; icon: string }) => {
    return (
      <div className="flex items-center gap-2 px-2">
        <i className={option.icon} />
        <span>{option.label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Settings</h1>
        <p className="text-secondary-500 dark:text-secondary-400">
          Configure system-wide settings and preferences
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

      {/* Appearance Settings */}
      <Card title="Appearance" className="shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">Theme</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Choose your preferred color scheme
              </p>
            </div>
            <SelectButton
              value={theme}
              onChange={(e) => setTheme(e.value as Theme)}
              options={themeOptions}
              itemTemplate={themeTemplate}
              optionLabel="label"
              optionValue="value"
            />
          </div>

          <div className="border-t border-secondary-200 dark:border-secondary-700" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">Compact Mode</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Reduce spacing and padding for a denser UI
              </p>
            </div>
            <InputSwitch checked={false} onChange={() => {}} />
          </div>

          <div className="border-t border-secondary-200 dark:border-secondary-700" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">Sidebar Collapsed</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Start with a collapsed sidebar by default
              </p>
            </div>
            <InputSwitch checked={false} onChange={() => {}} />
          </div>
        </div>
      </Card>

      {/* Language & Region */}
      <Card title="Language & Region" className="shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">Language</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Select your preferred language
              </p>
            </div>
            <Dropdown
              value="en"
              options={languageOptions}
              optionLabel="label"
              optionValue="value"
              className="w-40"
            />
          </div>

          <div className="border-t border-secondary-200 dark:border-secondary-700" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">Currency</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Default currency for transactions
              </p>
            </div>
            <Dropdown
              value="INR"
              options={[{ label: 'Indian Rupee (₹)', value: 'INR' }]}
              optionLabel="label"
              optionValue="value"
              className="w-48"
              disabled
            />
          </div>

          <div className="border-t border-secondary-200 dark:border-secondary-700" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">Weight Unit</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Default unit for gold weight
              </p>
            </div>
            <Dropdown
              value="gram"
              options={[
                { label: 'Grams (g)', value: 'gram' },
                { label: 'Tola', value: 'tola' },
                { label: 'Troy Ounce (oz)', value: 'ounce' },
              ]}
              optionLabel="label"
              optionValue="value"
              className="w-40"
            />
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
                Get notified when gold prices are updated
              </p>
            </div>
            <InputSwitch checked={true} onChange={() => {}} />
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card title="Notifications" className="shadow-sm">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">Email Notifications</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Receive updates and alerts via email
              </p>
            </div>
            <InputSwitch checked={true} onChange={() => {}} />
          </div>

          <div className="border-t border-secondary-200 dark:border-secondary-700" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">Push Notifications</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Receive notifications in your browser
              </p>
            </div>
            <InputSwitch checked={false} onChange={() => {}} />
          </div>

          <div className="border-t border-secondary-200 dark:border-secondary-700" />

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-secondary-900 dark:text-white">Price Alerts</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Get notified when gold prices change significantly
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

export default SettingsPage;
