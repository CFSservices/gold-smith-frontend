/**
 * Order Details Modal Component
 */

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { type Order } from '@/mocks/data/orders';
import { formatCurrency, formatDate } from '@/utils/format';
import { DeliverOrderModal } from './DeliverOrderModal';

interface OrderDetailsModalProps {
  order: Order;
  visible: boolean;
  onHide: () => void;
  onOrderStatusUpdate?: (orderId: number, newStatus: 'pending' | 'delivered' | 'cancelled') => void;
  onDeliveryComplete?: (orderId: number) => void;
}

export function OrderDetailsModal({ 
  order, 
  visible, 
  onHide,
  onDeliveryComplete,
}: OrderDetailsModalProps) {
  const [showDeliverOrderModal, setShowDeliverOrderModal] = useState(false);
  const [selectedGiftCollection, setSelectedGiftCollection] = useState<string | null>(null);
  const [giftOtp, setGiftOtp] = useState('');
  const [giftName, setGiftName] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [giftCollectionCompleted, setGiftCollectionCompleted] = useState(false);

  const formatDateTime = (dateTime: string) => {
    return dateTime || formatDate(new Date());
  };

  const handleConfirmDelivery = (data: {
    otp: string;
    deliveryMode: string;
    comments: string;
  }) => {
    // Handle delivery confirmation
    console.log('Delivery confirmed:', data);
    
    // Update order status and notify parent
    if (onDeliveryComplete && order.id) {
      onDeliveryComplete(order.id);
    }
    
    // Close deliver order modal
    setShowDeliverOrderModal(false);
  };

  if (!order) {
    return null;
  }

  return (
    <>
    <Dialog
      header={
        <div className="flex justify-between items-start w-full pr-8">
          <div>
            <h2 className="text-xl font-bold text-secondary-900 dark:text-white">
              {order.orderId}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formatDateTime(order.orderDateTime || order.orderedOn)}
            </p>
          </div>
        </div>
      }
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '800px' }}
      className="order-details-modal"
      modal
      draggable={false}
      resizable={false}
      dismissableMask
      blockScroll
    >
      <div className="space-y-6">
        {/* Payment Information */}
<div className="border-y border-gray-200 dark:border-secondary-700">

  <div className="flex">
    
    {/* LEFT SIDE */}
    <div className="flex-1 p-6">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        Total Paid (Inclusive of GST)
      </div>

      <div className="text-3xl font-bold text-secondary-900 dark:text-white">
        {formatCurrency(order.totalPaid || order.amount)}
      </div>

      {order.transactionId && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Transaction ID: {order.transactionId} via{" "}
          {order.paymentMethod || "RazorPay"}
        </div>
      )}

      {/* Customer */}
      <div className="flex items-center gap-3 mt-4">
        <img
          src={order.customer.avatar}
          className="w-12 h-12 rounded-md border-2 border-green-500"
        />
        <div>
          <div className="font-semibold">{order.customer.name}</div>
          <div className="text-sm text-gray-500">
            {order.customer.phone}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600 mt-2">
        {order.jewelCount} Jewels , {order.unitCount} Units
      </div>
    </div>


    {/* RIGHT SIDE */}
    <div className="w-[280px] p-6 flex flex-col justify-between">
      <div>
        <div className="font-semibold text-secondary-900 dark:text-white mb-2">
          {order.source}
        </div>

        {order.sourceDetails && (
          <>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {order.sourceDetails.id}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {order.sourceDetails.title}
              {order.sourceDetails.subtitle && (
                <> ({order.sourceDetails.subtitle})</>
              )}
            </div>

            <Button label="View Details" link className="p-0 text-sm" />
          </>
        )}
      </div>

      {/* Delivery */}
      <div className="mt-6 flex flex-col items-start gap-3">
        {order.status === 'pending' ? (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <i className="pi pi-map-marker text-amber-600" />
              <span>Delivery Pending</span>
            </div>
            <Button 
              label="Deliver Order" 
              severity="warning" 
              onClick={() => setShowDeliverOrderModal(true)}
            />
          </>
        ) : order.status === 'delivered' ? (
          <>
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <i className="pi pi-check-circle text-green-600 dark:text-green-400" />
              <span className="font-semibold">Delivered</span>
            </div>
            <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                Order has been delivered
              </span>
            </div>
          </>
        ) : order.status === 'cancelled' ? (
          <>
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <i className="pi pi-times-circle text-red-600 dark:text-red-400" />
              <span className="font-semibold">Cancelled</span>
            </div>
            <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <span className="text-sm text-red-700 dark:text-red-300 font-medium">
                Order has been cancelled
              </span>
            </div>
          </>
        ) : null}
      </div>
    </div>


  </div>
</div>

<div>
  {/* Gift Collection Strip - 3 Step Process */}
  <div className="px-6 py-4">
    <div className="flex items-center justify-between gap-4">
      {/* Left */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <i className="pi pi-gift text-xl text-gray-700" />

        <div className="leading-tight">
          <div className="font-semibold text-secondary-900 dark:text-white">
            Gift Collection
          </div>
          <div className={`text-sm font-medium ${giftCollectionCompleted ? 'text-green-600' : 'text-red-600'}`}>
            {giftCollectionCompleted ? 'Completed' : 'Pending'}
          </div>
        </div>
      </div>

      {/* Right - Step 1: Initial Dropdown */}
      {!selectedGiftCollection && !giftCollectionCompleted && (
        <Dropdown
          options={[
            { label: 'Home Delivery', value: 'home delivery' },
            { label: 'Self Collection', value: 'self collection' },
          ]}
          placeholder="Select"
          className="w-40"
          value={selectedGiftCollection}
          onChange={(e) => {
            const selectedValue = e.value as string;
            setSelectedGiftCollection(selectedValue);
          }}
        />
      )}

      {/* Right - Step 2: Selected State with Home Delivery and OTP side by side, Gift Name below */}
      {selectedGiftCollection && !giftCollectionCompleted && (
        <div className="flex flex-col gap-3 flex-1 justify-end items-end">
          {/* First row: Home Delivery dropdown and OTP side by side */}
          <div className="flex items-center gap-3">
            <Dropdown
              options={[
                { label: 'Home Delivery', value: 'home delivery' },
                { label: 'Self Collection', value: 'self collection' },
              ]}
              value={selectedGiftCollection}
              className="w-40"
              disabled
            />
            <div style={{ width: '120px' }}>
              <InputText
                value={giftOtp}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only allow numeric input and limit to 6 digits
                  if (value === '' || /^\d{0,6}$/.test(value)) {
                    setGiftOtp(value);
                  }
                }}
                placeholder="OTP"
                className="w-full"
                maxLength={6}
                inputMode="numeric"
                pattern="[0-9]{6}"
              />
            </div>
            {/* Tick icon outside OTP field - shown by default, enabled only when OTP is 6 digits and Gift Name is entered */}
            <Button
              icon="pi pi-check"
              className={giftOtp.length === 6 && giftName ? "text-green-600" : "text-gray-400"}
              text
              rounded
              onClick={() => {
                if (giftOtp.length === 6 && giftName) {
                  setOtpVerified(true);
                  setGiftCollectionCompleted(true);
                }
              }}
              tooltip="Complete Gift Collection"
              disabled={!(giftOtp.length === 6 && giftName)}
            />
          </div>
          
          {/* Second row: Gift Name field */}
          <div className="flex items-center gap-3 w-full justify-end">
            <div style={{ width: '350px' }}>
              <InputText
                value={giftName}
                onChange={(e) => setGiftName(e.target.value)}
                placeholder="Gift Name"
                className="w-full"
                disabled={giftCollectionCompleted}
              />
            </div>
          </div>
        </div>
      )}

      {/* Right - Step 3: Completed State */}
      {giftCollectionCompleted && (
        <div className="flex flex-col gap-2 items-end text-right">
          <div className="flex items-center gap-2 text-sm text-secondary-900 dark:text-white">
            <i className="pi pi-map-marker text-gray-600" />
            <span>Self Collected At Store</span>
          </div>
          <div className="text-sm text-secondary-700 dark:text-secondary-300">
            {giftName || 'Prestige Stainless Steel Pressure Cooker 5 Litre'}
          </div>
          <div className="text-sm text-secondary-600 dark:text-secondary-400">
            On {formatDate(new Date())} To {order.customer.name}
          </div>
          <div className="text-sm text-secondary-600 dark:text-secondary-400">
            Authenticated by {order.staff.name} with SMS OTP GS- {giftOtp || '123411'}
          </div>
        </div>
      )}
    </div>
  </div>
</div>

<div className="h-px bg-gray-200 dark:bg-secondary-700 w-full" />

        {/* Items in Order */}
        <div>
          <h3 className="font-semibold text-lg mb-4 text-secondary-900 dark:text-white">Items in Order</h3>
          <div className="space-y-4">
            {order.items?.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 border border-gray-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg text-secondary-900 dark:text-white mb-1">
                    {item.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Unit price: {formatCurrency(item.unitPrice)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Material: {item.material} • {item.weight}
                  </div>
                  {item.productId && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Product ID: {item.productId}
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 dark:border-secondary-700">
                    <div className="text-base font-semibold text-secondary-900 dark:text-white">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {item.quantity} {item.quantity === 1 ? 'Unit' : 'Units'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-secondary-700">
          <div className="flex items-center gap-4">
            <Button
              icon="pi pi-history"
              text
              rounded
              tooltip="History"
              tooltipOptions={{ position: 'top' }}
            />
            <Button
              icon="pi pi-download"
              text
              rounded
              tooltip="Download"
              tooltipOptions={{ position: 'top' }}
            />
            <Button
              icon="pi pi-print"
              text
              rounded
              tooltip="Print"
              tooltipOptions={{ position: 'top' }}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              label="Scan Stock"
              severity="secondary"
            />
            <Button
              label="✓ Done"
              severity="success"
              onClick={onHide}
            />
          </div>
        </div>
      </div>
    </Dialog>
    {order && (
      <DeliverOrderModal
        order={order}
        visible={showDeliverOrderModal}
        onHide={() => setShowDeliverOrderModal(false)}
        onConfirmDelivery={handleConfirmDelivery}
      />
    )}
    </>
  );
}
