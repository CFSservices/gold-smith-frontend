/**
 * Scheme Details Modal Component
 */

import { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Tag } from 'primereact/tag';
import { Avatar } from 'primereact/avatar';
import { type Scheme, type PaymentMonth } from '@/mocks/data/schemes';
import { PaymentConfirmationModal } from './PaymentConfirmationModal';
import { PauseSchemeModal } from './PauseSchemeModal';
import { StopSchemeModal } from './StopSchemeModal';

interface SchemeDetailsModalProps {
  scheme: Scheme;
  visible: boolean;
  onHide: () => void;
  onPause?: (schemeId: number) => void;
  onUpdate?: (updatedScheme: Scheme) => void;
}

export function SchemeDetailsModal({
  scheme,
  visible,
  onHide,
  onPause,
  onUpdate,
}: SchemeDetailsModalProps) {
  const [gracePeriodDays, setGracePeriodDays] = useState<number>(scheme.gracePeriod?.daysExtended || 0);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMonth | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [currentScheme, setCurrentScheme] = useState<Scheme>(scheme);

  // Update local scheme state when prop changes
  useEffect(() => {
    setCurrentScheme(scheme);
  }, [scheme]);

  if (!scheme) {
    return null;
  }

  const statusConfig: Record<
    string,
    { label: string; severity: 'success' | 'warning' | 'danger' | 'info' }
  > = {
    on_track: {
      label: 'On Track',
      severity: 'success',
    },
    completed: {
      label: 'Completed',
      severity: 'success',
    },
    breached: {
      label: 'Breaching',
      severity: 'warning',
    },
    paused: {
      label: 'Paused',
      severity: 'info',
    },
    stopped: {
      label: 'Stopped',
      severity: 'danger',
    },
  };

  const statusInfo = statusConfig[currentScheme.status];

  const handlePause = () => {
    setShowPauseModal(true);
  };

  const handleStop = () => {
    setShowStopModal(true);
  };

  const handleConfirmPause = (_data: { otp: string; comments: string }) => {
    // Update the scheme status to paused
    const updatedScheme: Scheme = {
      ...currentScheme,
      status: 'paused',
    };

    setCurrentScheme(updatedScheme);

    // Call the update callback to propagate changes to parent
    if (onUpdate) {
      onUpdate(updatedScheme);
    }

    // Call the pause callback if provided
    if (onPause && currentScheme.id) {
      onPause(currentScheme.id);
    }

    setShowPauseModal(false);
  };

  const handleConfirmStop = (_data: { otp: string; comments: string }) => {
    // Update the scheme status to stopped
    const updatedScheme: Scheme = {
      ...currentScheme,
      status: 'stopped',
    };

    setCurrentScheme(updatedScheme);

    // Call the update callback to propagate changes to parent
    if (onUpdate) {
      onUpdate(updatedScheme);
    }

    setShowStopModal(false);
  };

  const handlePaymentClick = (payment: PaymentMonth) => {
    // Allow clicking on completed or due payments
    if (payment.status === 'completed' || payment.status === 'due') {
      setSelectedPayment(payment);
      setShowPaymentModal(true);
    }
  };

  const handleRecordPayment = (paymentData: {
    paymentMethod: string;
    amountReceived: number;
    dateTime: string;
    transactionId: string;
  }) => {
    if (!currentScheme.paymentTimeline || !selectedPayment) return;

    // Find the index of the current payment in the timeline
    const paymentIndex = currentScheme.paymentTimeline.findIndex(
      (p) => p.month === selectedPayment.month && p.year === selectedPayment.year
    );

    if (paymentIndex === -1) return;

    // Create updated payment timeline
    const updatedTimeline = [...currentScheme.paymentTimeline];
    
    // Update the current payment to completed
    updatedTimeline[paymentIndex] = {
      ...updatedTimeline[paymentIndex],
      status: 'completed',
      paymentMethod: paymentData.paymentMethod,
      amountReceived: paymentData.amountReceived,
      dateTime: paymentData.dateTime,
      transactionId: paymentData.transactionId,
    };

    // Find the next pending payment and mark it as due
    const nextPendingIndex = updatedTimeline.findIndex(
      (p, idx) => idx > paymentIndex && p.status === 'pending'
    );

    if (nextPendingIndex !== -1) {
      updatedTimeline[nextPendingIndex] = {
        ...updatedTimeline[nextPendingIndex],
        status: 'due',
      };
    }

    // Calculate updated values
    const completedCount = updatedTimeline.filter((p) => p.status === 'completed').length;
    const newTotalPaid = (currentScheme.totalPaid || 0) + paymentData.amountReceived;
    
    // Update dues - if we just completed the current due, check if there's a next one
    let updatedDues = { ...currentScheme.dues };
    if (nextPendingIndex !== -1) {
      const nextPayment = updatedTimeline[nextPendingIndex];
      updatedDues.currentDue = `${nextPayment.month} ${nextPayment.year} Due`;
      updatedDues.hasDues = true;
    } else {
      // No more pending payments
      updatedDues.hasDues = false;
      updatedDues.currentDue = undefined;
    }

    // Create updated scheme
    const updatedScheme: Scheme = {
      ...currentScheme,
      paymentTimeline: updatedTimeline,
      progress: {
        ...currentScheme.progress,
        completed: completedCount,
      },
      totalPaid: newTotalPaid,
      dues: updatedDues,
    };

    setCurrentScheme(updatedScheme);

    // Call the update callback
    if (onUpdate) {
      onUpdate(updatedScheme);
    }

    // Close the payment modal
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  // Group payment timeline by year (use currentScheme instead of scheme)
  const groupedTimeline = currentScheme.paymentTimeline?.reduce((acc, payment) => {
    if (!acc[payment.year]) {
      acc[payment.year] = [];
    }
    acc[payment.year].push(payment);
    return acc;
  }, {} as Record<number, typeof currentScheme.paymentTimeline>) || {};

  return (
    <Dialog
      header={
        <div className="flex justify-between items-center w-full">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
            {currentScheme.schemeId}
          </h2>
        </div>
      }
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '900px' }}
      className="scheme-details-modal"
      modal
      draggable={false}
      resizable={false}
      dismissableMask
      blockScroll
      closable
    >
      <div className="space-y-6">
        {/* Header Section - Customer Information and Scheme Details */}
        <div className="flex items-start justify-between gap-4">
          {/* Left Side - Customer Information */}
<div className="flex flex-col gap-3">

  {/* Row 1 → Avatar + Name + Phone */}
  <div className="flex items-center gap-3">
    <Avatar
      image={currentScheme.customer.avatar}
      label={currentScheme.customer.name.charAt(0)}
      shape="circle"
      className="w-12 h-12"
    />
    <div>
      <div className="font-semibold text-lg text-secondary-900 dark:text-white">
        {currentScheme.customer.name}
      </div>
      <div className="text-sm text-secondary-600 dark:text-secondary-400">
        {currentScheme.customer.phone}
      </div>
    </div>
  </div>

  {/* Row 2 → Payment Status (below) */}
  <div className="text-sm text-secondary-600 dark:text-secondary-400">
    Total Paid (Inclusive of GST)
    ₹{(currentScheme.totalPaid || 0).toLocaleString('en-IN')} /
    ₹{(currentScheme.totalAmount || currentScheme.monthlyDeposit * currentScheme.progress.total).toLocaleString('en-IN')}
  </div>

</div>


          {/* Right Side - Scheme Name, Status, Progress and Due Information */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <div className="font-semibold text-lg text-secondary-900 dark:text-white">
                {currentScheme.plan.name} ({currentScheme.plan.code})
              </div>
              <Tag
                value={statusInfo.label}
                severity={statusInfo.severity}
                className="text-sm px-3 py-1 rounded-full"
              />
            </div>
            {/* Progress Information */}
            <div className="text-sm text-secondary-600 dark:text-secondary-400">
              {currentScheme.progress.completed} of {currentScheme.progress.total} Done
            </div>
            {/* Due Information */}
            {currentScheme.dues.hasDues && currentScheme.dues.currentDue && (
              <div className="text-sm text-secondary-600 dark:text-secondary-400">
                {currentScheme.dues.currentDue}
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-secondary-700 w-full" />

        {/* Gift Collection Section */}
        {currentScheme.giftCollection && (
          <div className="px-6 py-4 border-t border-b border-gray-200 dark:border-secondary-700">
            <div className="flex items-center justify-between gap-4">
              {/* Left Side */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <i className="pi pi-gift text-xl text-gray-700 dark:text-gray-300" />
                <div className="leading-tight">
                  <div className="font-semibold text-secondary-900 dark:text-white">
                    Gift Collection
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      currentScheme.giftCollection.status === 'completed'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {currentScheme.giftCollection.status === 'completed' ? 'Completed' : 'Pending'}
                  </div>
                </div>
              </div>

              {/* Right Side - Completed Details */}
              {currentScheme.giftCollection.status === 'completed' && (
                <div className="flex flex-col gap-2 items-end text-right">
                  <div className="flex items-center gap-2 text-sm text-secondary-900 dark:text-white">
                    <i className="pi pi-map-marker text-gray-600 dark:text-gray-400" />
                    <span>Self Collected At Store</span>
                  </div>
                  <div className="text-sm text-secondary-700 dark:text-secondary-300">
                    {currentScheme.giftCollection.giftName}
                  </div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">
                    On {currentScheme.giftCollection.collectedAt} To {currentScheme.giftCollection.collectedBy}
                  </div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">
                    Authenticated by {currentScheme.giftCollection.authenticatedBy} with SMS OTP {currentScheme.giftCollection.otp}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        {currentScheme.giftCollection && (
          <div className="h-px bg-gray-200 dark:bg-secondary-700 w-full" />
        )}

        {/* Monthly Progress Timeline */}
        {currentScheme.paymentTimeline && currentScheme.paymentTimeline.length > 0 && (
          <div className="space-y-6">
            {Object.entries(groupedTimeline)
              .sort(([yearA], [yearB]) => Number(yearA) - Number(yearB))
              .map(([year, payments]) => (
                <div key={year} className="space-y-3">
                  <div className="text-base font-semibold text-secondary-700 dark:text-secondary-300 mb-3">
                    {year}
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-4 px-1">
                    {payments.map((payment, index) => {
                      const isCompleted = payment.status === 'completed';
                      const isDue = payment.status === 'due';

                      return (
                        <div
                          key={`${payment.year}-${payment.month}-${index}`}
                          className="flex flex-col items-center gap-2 min-w-[55px]"
                        >
                          <div
                            onClick={() => handlePaymentClick(payment)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                              isCompleted
                                ? 'bg-green-500 border-green-500 text-white shadow-md cursor-pointer hover:bg-green-600 hover:scale-105'
                                : isDue
                                ? 'bg-white dark:bg-secondary-800 border-amber-500 dark:border-amber-500 shadow-md cursor-pointer hover:bg-amber-50 dark:hover:bg-secondary-700 hover:scale-105'
                                : 'bg-white dark:bg-secondary-800 border-gray-300 dark:border-secondary-600'
                            }`}
                          >
                            {isCompleted ? (
                              <i className="pi pi-check text-sm text-white font-bold" />
                            ) : isDue ? (
                              <span className="text-xs text-amber-500 font-bold">●</span>
                            ) : (
                              <span className="text-xs text-gray-400 dark:text-gray-500">○</span>
                            )}
                          </div>
                          <div className="text-sm font-semibold text-secondary-900 dark:text-white">
                            {payment.month}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Divider */}
        {currentScheme.paymentTimeline && currentScheme.paymentTimeline.length > 0 && (
          <div className="h-px bg-gray-200 dark:bg-secondary-700 w-full" />
        )}

        {/* Grace Period Extension */}
        {currentScheme.status !== 'completed' && currentScheme.status !== 'stopped' && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-secondary-900 dark:text-white">
              Extend Grace Period by
            </label>
            <div className="flex items-center gap-2">
              <Button
                icon="pi pi-minus"
                text
                rounded
                onClick={() => setGracePeriodDays(Math.max(0, gracePeriodDays - 1))}
                disabled={gracePeriodDays === 0}
                className="flex-shrink-0 w-8 h-8"
              />
              <InputNumber
                value={gracePeriodDays}
                onValueChange={(e) => setGracePeriodDays(e.value || 0)}
                min={0}
                max={365}
                showButtons={false}
                className="w-20"
                inputClassName="text-center"
              />
              <Button
                icon="pi pi-plus"
                text
                rounded
                onClick={() => setGracePeriodDays(Math.min(365, gracePeriodDays + 1))}
                disabled={gracePeriodDays === 365}
                className="flex-shrink-0 w-8 h-8"
              />
            </div>
          </div>
        )}

        {/* Footer Section - Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-secondary-700">
          <div className="flex items-center gap-3">
            {currentScheme.status !== 'completed' && currentScheme.status !== 'stopped' && (
              <>
                <Button
                  icon="pi pi-square"
                  severity="danger"
                  onClick={handleStop}
                  className="w-10 h-10 p-0"
                />
                <Button
                  label="Pause"
                  icon="pi pi-pause"
                  severity="secondary"
                  onClick={handlePause}
                  className="px-6"
                />
              </>
            )}
          </div>
          <Button
            label="Done"
            icon="pi pi-check"
            severity="success"
            onClick={onHide}
            className="px-6"
          />
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {selectedPayment && (
        <PaymentConfirmationModal
          payment={selectedPayment}
          scheme={currentScheme}
          visible={showPaymentModal}
          onHide={() => {
            setShowPaymentModal(false);
            setSelectedPayment(null);
          }}
          onRecordPayment={handleRecordPayment}
        />
      )}

      {/* Pause Scheme Modal */}
      <PauseSchemeModal
        scheme={currentScheme}
        visible={showPauseModal}
        onHide={() => setShowPauseModal(false)}
        onConfirmPause={handleConfirmPause}
      />

      {/* Stop Scheme Modal */}
      <StopSchemeModal
        scheme={currentScheme}
        visible={showStopModal}
        onHide={() => setShowStopModal(false)}
        onConfirmStop={handleConfirmStop}
      />
    </Dialog>
  );
}
