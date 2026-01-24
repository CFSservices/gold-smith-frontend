/**
 * Profile Page
 */

import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useAuthStore } from '@/store/authStore';
import { getInitials, formatDate } from '@/utils/format';

export function ProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">Profile</h1>
        <p className="text-secondary-500 dark:text-secondary-400">
          Manage your account information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="shadow-sm">
          <div className="text-center">
            <Avatar
              label={user ? getInitials(`${user.firstName} ${user.lastName}`) : 'U'}
              size="xlarge"
              shape="circle"
              className="bg-gold-500 text-white mb-4"
              style={{ width: '100px', height: '100px', fontSize: '2rem' }}
            />
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-secondary-500 dark:text-secondary-400">{user?.email}</p>
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold-100 text-gold-800 dark:bg-gold-900/30 dark:text-gold-400 capitalize">
                {user?.role ?? 'User'}
              </span>
            </div>

            <div className="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-secondary-500 dark:text-secondary-400">Member since</p>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-secondary-500 dark:text-secondary-400">Last login</p>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    {user?.lastLoginAt ? formatDate(user.lastLoginAt) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Edit Profile Form */}
        <div className="lg:col-span-2">
          <Card title="Personal Information" className="shadow-sm">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    First Name
                  </label>
                  <InputText
                    value={user?.firstName ?? ''}
                    className="w-full"
                    readOnly
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                    Last Name
                  </label>
                  <InputText
                    value={user?.lastName ?? ''}
                    className="w-full"
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Email Address
                </label>
                <InputText
                  value={user?.email ?? ''}
                  className="w-full"
                  readOnly
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Phone Number
                </label>
                <InputText
                  value={user?.phone ?? 'Not provided'}
                  className="w-full"
                  readOnly
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  label="Edit Profile"
                  icon="pi pi-pencil"
                  severity="warning"
                />
              </div>
            </form>
          </Card>

          {/* Security Section */}
          <Card title="Security" className="shadow-sm mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900 dark:text-white">Password</p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    Last changed 30 days ago
                  </p>
                </div>
                <Button
                  label="Change Password"
                  outlined
                  size="small"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                <div>
                  <p className="font-medium text-secondary-900 dark:text-white">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    Add an extra layer of security
                  </p>
                </div>
                <Button
                  label="Enable"
                  outlined
                  severity="success"
                  size="small"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
