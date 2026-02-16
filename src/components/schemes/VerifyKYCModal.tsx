/**
 * KYC Verification Modal Component
 */

import { useState, useRef, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';

interface Customer {
  name: string;
  phone: string;
  avatar: string;
  email?: string;
  id?: string;
  kycVerified?: boolean;
}

interface VerifyKYCModalProps {
  customer: Customer;
  visible: boolean;
  onHide: () => void;
  onVerifyComplete?: (verified: boolean) => void;
}

export function VerifyKYCModal({
  customer,
  visible,
  onHide,
  onVerifyComplete,
}: VerifyKYCModalProps) {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarName, setAadhaarName] = useState('');
  const [aadhaarFrontFile, setAadhaarFrontFile] = useState<File | null>(null);
  const [aadhaarBackFile, setAadhaarBackFile] = useState<File | null>(null);
  const [aadhaarVerified, setAadhaarVerified] = useState(false);

  const [panNumber, setPanNumber] = useState('');
  const [panName, setPanName] = useState('');
  const [panFrontFile, setPanFrontFile] = useState<File | null>(null);
  const [panVerified, setPanVerified] = useState(false);

  const aadhaarFrontUploadRef = useRef<HTMLInputElement>(null);
  const aadhaarBackUploadRef = useRef<HTMLInputElement>(null);
  const panFrontUploadRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleAadhaarFrontUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAadhaarFrontFile(file);
    }
  };

  const handleAadhaarBackUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAadhaarBackFile(file);
    }
  };

  const handlePanFrontUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPanFrontFile(file);
    }
  };

  const handleVerifyAadhaar = () => {
    if (aadhaarNumber.trim() && aadhaarName.trim() && aadhaarFrontFile && aadhaarBackFile) {
      // Simulate verification
      setAadhaarVerified(true);
    }
  };

  const handleVerifyPAN = () => {
    if (panNumber.trim() && panName.trim() && panFrontFile) {
      // Simulate verification
      setPanVerified(true);
    }
  };

  const handleDone = () => {
    if (onVerifyComplete) {
      onVerifyComplete(aadhaarVerified && panVerified);
    }
    onHide();
  };

  const handleReset = () => {
    setAadhaarNumber('');
    setAadhaarName('');
    setAadhaarFrontFile(null);
    setAadhaarBackFile(null);
    setAadhaarVerified(false);
    setPanNumber('');
    setPanName('');
    setPanFrontFile(null);
    setPanVerified(false);
    // Reset file input refs
    if (aadhaarFrontUploadRef.current) {
      aadhaarFrontUploadRef.current.value = '';
    }
    if (aadhaarBackUploadRef.current) {
      aadhaarBackUploadRef.current.value = '';
    }
    if (panFrontUploadRef.current) {
      panFrontUploadRef.current.value = '';
    }
  };

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      handleReset();
    }
  }, [visible]);

  return (
    <Dialog
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
            Verify Now
          </h2>
        </div>
      }
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '800px' }}
      className="verify-kyc-modal"
      modal
      draggable={false}
      resizable={false}
      dismissableMask
      blockScroll
      closable
      onHide={onHide}
    >
      <div className="space-y-6">
        {/* User Information Section */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <Avatar
              image={customer.avatar}
              label={customer.name.charAt(0)}
              shape="circle"
              className="w-20 h-20"
            />
          </div>

          {/* Email ID */}
          <div>
            <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
              Email ID<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <InputText
                value={customer.email || ''}
                readOnly
                className="w-full pr-10"
              />
              <Button
                icon="pi pi-copy"
                text
                rounded
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => handleCopy(customer.email || '')}
                tooltip="Copy"
                tooltipOptions={{ position: 'top' }}
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
              Mobile Number<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <InputText
                value={customer.phone}
                readOnly
                className="w-full pr-10"
              />
              <Button
                icon="pi pi-copy"
                text
                rounded
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => handleCopy(customer.phone)}
                tooltip="Copy"
                tooltipOptions={{ position: 'top' }}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:border-secondary-700 w-full" />

        {/* Aadhaar Verification Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-secondary-900 dark:text-white">
              Aadhaar
            </span>
            {!aadhaarVerified ? (
              <i className="pi pi-exclamation-circle text-red-500" />
            ) : (
              <i className="pi pi-check-circle text-green-500" />
            )}
            <span
              className={`text-sm ${
                aadhaarVerified
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {aadhaarVerified ? 'Verified' : 'Verification Pending'}
            </span>
          </div>

          {/* Aadhaar Front and Back Upload */}
          <div className="grid grid-cols-2 gap-4">
            {/* Front */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Front
                </label>
                <i
                  className="pi pi-info-circle text-xs text-gray-400 cursor-help"
                  title="Upload Aadhaar front side"
                />
              </div>
              {aadhaarFrontFile ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(aadhaarFrontFile)}
                    alt="Aadhaar Front"
                    className="w-full h-32 object-cover rounded border border-gray-300 dark:border-secondary-600"
                  />
                  <Button
                    label="↑ Upload Again"
                    icon="pi pi-upload"
                    size="small"
                    className="w-full mt-2"
                    onClick={() => {
                      setAadhaarFrontFile(null);
                      if (aadhaarFrontUploadRef.current) {
                        aadhaarFrontUploadRef.current.value = '';
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-secondary-600 rounded flex items-center justify-center">
                    <i className="pi pi-image text-3xl text-gray-400" />
                  </div>
                  <input
                    ref={aadhaarFrontUploadRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAadhaarFrontUpload}
                    className="hidden"
                    id="aadhaar-front-upload"
                  />
                  <Button
                    label="↑ Upload"
                    icon="pi pi-upload"
                    size="small"
                    className="w-full"
                    onClick={() => aadhaarFrontUploadRef.current?.click()}
                  />
                </div>
              )}
            </div>

            {/* Back */}
            <div className="space-y-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Back
                </label>
                <i
                  className="pi pi-info-circle text-xs text-gray-400 cursor-help"
                  title="Upload Aadhaar back side"
                />
              </div>
              {aadhaarBackFile ? (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(aadhaarBackFile)}
                    alt="Aadhaar Back"
                    className="w-full h-32 object-cover rounded border border-gray-300 dark:border-secondary-600"
                  />
                  <Button
                    label="↑ Upload Again"
                    icon="pi pi-upload"
                    size="small"
                    className="w-full mt-2"
                    onClick={() => {
                      setAadhaarBackFile(null);
                      if (aadhaarBackUploadRef.current) {
                        aadhaarBackUploadRef.current.value = '';
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-secondary-600 rounded flex items-center justify-center">
                    <i className="pi pi-image text-3xl text-gray-400" />
                  </div>
                  <input
                    ref={aadhaarBackUploadRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAadhaarBackUpload}
                    className="hidden"
                    id="aadhaar-back-upload"
                  />
                  <Button
                    label="↑ Upload"
                    icon="pi pi-upload"
                    size="small"
                    className="w-full"
                    onClick={() => aadhaarBackUploadRef.current?.click()}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Aadhaar Number */}
          <div>
            <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
              Aadhaar Number
            </label>
            <InputText
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              placeholder="Enter Aadhaar Number"
              className="w-full"
              disabled={aadhaarVerified}
            />
          </div>

          {/* Full Name as on Aadhaar */}
          <div>
            <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
              Full Name as on Aadhaar
            </label>
            <InputText
              value={aadhaarName}
              onChange={(e) => setAadhaarName(e.target.value)}
              placeholder="Enter Full Name"
              className="w-full"
              disabled={aadhaarVerified}
            />
          </div>

          {/* Verify Aadhaar Button */}
          {!aadhaarVerified && (
            <Button
              label="✓ Verify"
              icon="pi pi-check"
              severity="success"
              onClick={handleVerifyAadhaar}
              disabled={!aadhaarNumber.trim() || !aadhaarName.trim() || !aadhaarFrontFile || !aadhaarBackFile}
              className="w-full"
            />
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:border-secondary-700 w-full" />

        {/* PAN Verification Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-secondary-900 dark:text-white">
              PAN
            </span>
            {!panVerified ? (
              <i className="pi pi-exclamation-circle text-red-500" />
            ) : (
              <i className="pi pi-check-circle text-green-500" />
            )}
            <span
              className={`text-sm ${
                panVerified
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {panVerified ? 'Verified' : 'Verification Pending'}
            </span>
          </div>

          {/* PAN Front Upload */}
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Front
              </label>
              <i
                className="pi pi-info-circle text-xs text-gray-400 cursor-help"
                title="Upload PAN card front side"
              />
            </div>
            {panFrontFile ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(panFrontFile)}
                  alt="PAN Front"
                  className="w-full h-32 object-cover rounded border border-gray-300 dark:border-secondary-600"
                />
                <Button
                  label="↑ Upload Again"
                  icon="pi pi-upload"
                  size="small"
                  className="w-full mt-2"
                  onClick={() => {
                    setPanFrontFile(null);
                    if (panFrontUploadRef.current) {
                      panFrontUploadRef.current.value = '';
                    }
                  }}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-secondary-600 rounded flex items-center justify-center">
                  <i className="pi pi-image text-3xl text-gray-400" />
                </div>
                <input
                  ref={panFrontUploadRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePanFrontUpload}
                  className="hidden"
                  id="pan-front-upload"
                />
                <Button
                  label="↑ Upload"
                  icon="pi pi-upload"
                  size="small"
                  className="w-full"
                  onClick={() => panFrontUploadRef.current?.click()}
                />
              </div>
            )}
          </div>

          {/* PAN Number */}
          <div>
            <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
              PAN Number
            </label>
            <div className="relative">
              <InputText
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                placeholder="Enter PAN Number"
                className="w-full pr-10"
                disabled={panVerified}
                maxLength={10}
              />
              {panNumber && !panVerified && (
                <Button
                  icon="pi pi-times"
                  text
                  rounded
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setPanNumber('')}
                />
              )}
            </div>
          </div>

          {/* Full Name as on PAN */}
          <div>
            <label className="block text-sm font-medium text-secondary-900 dark:text-white mb-2">
              Full Name as on PAN
            </label>
            <div className="relative">
              <InputText
                value={panName}
                onChange={(e) => setPanName(e.target.value)}
                placeholder="Enter Full Name"
                className="w-full pr-10"
                disabled={panVerified}
              />
              {panName && !panVerified && (
                <Button
                  icon="pi pi-times"
                  text
                  rounded
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setPanName('')}
                />
              )}
            </div>
          </div>

          {/* Verify PAN Button */}
          {!panVerified && (
            <Button
              label="✓ Verify"
              icon="pi pi-check"
              severity="success"
              onClick={handleVerifyPAN}
              disabled={!panNumber.trim() || !panName.trim() || !panFrontFile}
              className="w-full"
            />
          )}
        </div>

        {/* Done Button */}
        <div className="flex justify-end pt-4">
          <Button
            label="Done"
            icon="pi pi-check"
            severity="success"
            onClick={handleDone}
            disabled={!aadhaarVerified || !panVerified}
            className="px-6 py-2"
          />
        </div>
      </div>
    </Dialog>
  );
}
