/**
 * Settings Page
 */

import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';
import { InputSwitch } from 'primereact/inputswitch';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useTheme } from '@/hooks/useTheme';
import type { Theme } from '@/types';

const themeOptions = [
  { label: 'Light', value: 'light', icon: 'pi pi-sun' },
  { label: 'Dark', value: 'dark', icon: 'pi pi-moon' },
  { label: 'System', value: 'system', icon: 'pi pi-desktop' },
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
          Customize your application preferences
        </p>
      </div>

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

      {/* Save Button */}
      <div className="flex justify-end">
        <Button label="Save Changes" icon="pi pi-check" />
      </div>
    </div>
  );
}

export default SettingsPage;
