/**
 * Order Placed Modal Component
 * Shows order details after a new order is placed
 */

import { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Icon } from '@/components/ui/Icon';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';
import { type Order } from '@/mocks/data/orders';
import { formatCurrency, formatDate } from '@/utils/format';
import { DeliverOrderModal } from './DeliverOrderModal';
import { CancelOrderModal } from './CancelOrderModal';

interface OrderPlacedModalProps {
  order: Order;
  visible: boolean;
  onHide: () => void;
  onOrderStatusUpdate?: (orderId: number, newStatus: 'pending' | 'delivered' | 'cancelled') => void;
  onDeliveryComplete?: (orderId: number) => void;
  onOrderConfirm?: (order: Order) => void; // Called when "Done" is clicked to add order to list
}

export function OrderPlacedModal({ 
  order, 
  visible, 
  onHide,
  onDeliveryComplete,
  onOrderConfirm,
}: OrderPlacedModalProps) {
  const [showDeliverOrderModal, setShowDeliverOrderModal] = useState(false);
  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);

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

  const handleConfirmCancel = (data: {
    staffName: string;
    otp: string;
    reason: string;
  }) => {
    // Handle order cancellation
    console.log('Order cancelled:', data);
    
    // Close both modals - don't add order to orders page
    setShowCancelOrderModal(false);
    onHide();
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
      className="order-placed-modal"
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
                      <Icon name="location_on" size={20} className="text-gold-600 dark:text-gold-400" />
                      <span>Delivery Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="close" size={24} className="text-red-600 dark:text-red-400" />
                      <Button 
                        label="Deliver Order" 
                        severity="warning" 
                        onClick={() => setShowDeliverOrderModal(true)}
                      />
                    </div>
                  </>
                ) : order.status === 'delivered' ? (
                  <>
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <Icon name="check_circle" size={20} className="text-green-600 dark:text-green-400" />
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
                      <Icon name="error" size={20} className="text-red-600 dark:text-red-400" />
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
        <div className="flex items-center justify-between gap-2 pt-4 border-t border-gray-200 dark:border-secondary-700">
          <Button
            icon={<PrimeReactIcon name="delete" size={20} />}
            text
            tooltip="Cancel Order"
            tooltipOptions={{ position: 'top' }}
            onClick={() => setShowCancelOrderModal(true)}
          />
          <div className="flex items-center gap-2">
            <Button
              icon={<PrimeReactIcon name="undo" size={20} />}
              text
              tooltip="Undo"
              tooltipOptions={{ position: 'top' }}
            />
            <Button
              icon={<PrimeReactIcon name="download" size={20} />}
              text
              tooltip="Download"
              tooltipOptions={{ position: 'top' }}
            />
            <Button
              icon={<PrimeReactIcon name="print" size={20} />}
              text
              tooltip="Print"
              tooltipOptions={{ position: 'top' }}
            />
            <Button
              label="Done"
              icon={<PrimeReactIcon name="check" size={20} />}
              onClick={() => {
                // Add order to list when "Done" is clicked
                if (onOrderConfirm) {
                  onOrderConfirm(order);
                }
                onHide();
              }}
            />
          </div>
        </div>
      </div>
    </Dialog>

    {/* Deliver Order Modal */}
    {showDeliverOrderModal && (
      <DeliverOrderModal
        order={order}
        visible={showDeliverOrderModal}
        onHide={() => setShowDeliverOrderModal(false)}
        onConfirmDelivery={handleConfirmDelivery}
      />
    )}

    {/* Cancel Order Modal */}
    {order && (
      <CancelOrderModal
        order={order}
        visible={showCancelOrderModal}
        onHide={() => setShowCancelOrderModal(false)}
        onConfirmCancel={handleConfirmCancel}
      />
    )}
    </>
  );
}
