/**
 * Order Placed Modal - Shows order details after new order is placed
 * Same layout as OrderDetailsModal with Cancel/Undo/Download/Print/Done actions
 */

import { useState, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Icon } from '@/components/ui/Icon';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';
import { formatCurrency, formatDate } from '@/utils/format';
import { OrderProductCard } from './OrderProductCard';
import { ViewProductModal } from './ViewProductModal';
import { DeliverOrderModal } from './DeliverOrderModal';
import { CancelOrderModal } from './CancelOrderModal';
import type { Order, OrderItem } from '@/features/orders/types';

interface OrderPlacedModalProps {
  order: Order;
  visible: boolean;
  onHide: () => void;
  onOrderConfirm?: () => void;
  onDeliveryComplete?: (orderId: number) => void;
}

export function OrderPlacedModal({
  order,
  visible,
  onHide,
  onOrderConfirm,
  onDeliveryComplete,
}: OrderPlacedModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<OrderItem | null>(null);
  const [showDeliverModal, setShowDeliverModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const formatDateTime = (dateTime: string) => {
    return dateTime || formatDate(new Date());
  };

  const handleProductClick = useCallback((item: OrderItem) => {
    setSelectedProduct(item);
  }, []);

  const handleDone = useCallback(() => {
    if (onOrderConfirm) {
      onOrderConfirm();
    }
    onHide();
  }, [onOrderConfirm, onHide]);

  const handleConfirmDelivery = useCallback(() => {
    if (onDeliveryComplete) {
      onDeliveryComplete(order.id);
    }
    setShowDeliverModal(false);
  }, [order.id, onDeliveryComplete]);

  const handleConfirmCancel = useCallback(() => {
    setShowCancelModal(false);
    onHide();
  }, [onHide]);

  return (
    <>
      <Dialog
        header={
          <div className="flex justify-between items-start w-full pr-8">
            <div>
              <h2 className="text-xl-bold text-secondary-900 dark:text-white">
                {order.orderId}
              </h2>
              <p className="text-sm-normal text-secondary-500 dark:text-secondary-400 mt-1">
                {formatDateTime(order.orderDateTime ?? order.orderedOn)}
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
        footer={
          <div className="flex items-center justify-between w-full">
            <Button
              icon={<PrimeReactIcon name="delete" size={20} />}
              text
              rounded
              severity="danger"
              tooltip="Cancel Order"
              tooltipOptions={{ position: 'top' }}
              onClick={() => { setShowCancelModal(true); }}
              aria-label="Cancel order"
            />
            <div className="flex items-center gap-2">
              <Button
                icon={<PrimeReactIcon name="undo" size={20} />}
                text
                rounded
                tooltip="Undo"
                tooltipOptions={{ position: 'top' }}
                aria-label="Undo"
              />
              <Button
                icon={<PrimeReactIcon name="download" size={20} />}
                text
                rounded
                tooltip="Download"
                tooltipOptions={{ position: 'top' }}
                aria-label="Download order"
              />
              <Button
                icon={<PrimeReactIcon name="print" size={20} />}
                text
                rounded
                tooltip="Print"
                tooltipOptions={{ position: 'top' }}
                aria-label="Print order"
              />
              <Button
                label="Done"
                icon={<PrimeReactIcon name="check" size={20} />}
                severity="success"
                onClick={handleDone}
                aria-label="Done"
              />
            </div>
          </div>
        }
      >
        <div className="space-y-0">
          {/* Payment + Source + Customer section */}
          <div className="border-y border-border-default dark:border-secondary-700">
            <div className="flex">
              {/* LEFT — Payment & Customer */}
              <div className="flex-1 p-6">
                <div className="text-sm-normal text-secondary-600 dark:text-secondary-400 mb-1">
                  Total Paid (Inclusive of GST)
                </div>
                <div className="text-2xl-bold text-secondary-900 dark:text-white">
                  {formatCurrency(order.totalPaid ?? order.amount)}
                </div>
                {order.transactionId && (
                  <div className="text-xs-normal text-secondary-500 dark:text-secondary-400 mt-1">
                    Transaction ID: {order.transactionId} via {order.paymentMethod ?? 'RazorPay'}
                  </div>
                )}

                {/* Customer card */}
                <div className="flex items-center gap-3 mt-4">
                  <img
                    src={order.customer.avatar}
                    alt={order.customer.name}
                    className="w-12 h-12 rounded-lg border-2 border-success object-cover"
                  />
                  <div>
                    <div className="text-base-semibold text-secondary-900 dark:text-white">
                      {order.customer.name}
                    </div>
                    <div className="text-sm-normal text-secondary-500 dark:text-secondary-400">
                      {order.customer.phone}
                    </div>
                  </div>
                </div>

                <div className="text-sm-normal text-secondary-600 dark:text-secondary-400 mt-2">
                  {order.jewelCount ?? order.itemCount} Jewels , {order.unitCount ?? order.itemCount} Units
                </div>
              </div>

              {/* RIGHT — Source + Delivery status */}
              <div className="w-[280px] p-6 flex flex-col justify-between">
                <div>
                  <div className="text-base-semibold text-secondary-900 dark:text-white text-right">
                    {order.source}
                  </div>
                  {order.sourceDetails && (
                    <div className="text-right mt-1">
                      <div className="text-sm-normal text-secondary-600 dark:text-secondary-400">
                        {order.sourceDetails.id}
                      </div>
                      <div className="text-sm-normal text-secondary-600 dark:text-secondary-400">
                        {order.sourceDetails.title}
                        {order.sourceDetails.subtitle && (
                          <> ({order.sourceDetails.subtitle})</>
                        )}
                      </div>
                      <Button
                        label="View Details"
                        link
                        className="p-0 text-sm ml-auto block"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2 text-sm-normal text-secondary-600 dark:text-secondary-400">
                    <Icon
                      name="location_on"
                      size={20}
                      className="text-gold-600 dark:text-gold-400"
                    />
                    <span>Delivery Pending</span>
                  </div>
                  <Button
                    label="Deliver Order"
                    icon={<PrimeReactIcon name="package_2" size={20} />}
                    onClick={() => { setShowDeliverModal(true); }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border-default dark:bg-secondary-700 w-full" />

          {/* Product list */}
          <div className="p-6 space-y-3">
            {order.items?.map((item, idx) => (
              <OrderProductCard
                key={item.id}
                item={item}
                index={idx + 1}
                onClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      </Dialog>

      {/* View Product Modal */}
      <ViewProductModal
        item={selectedProduct}
        visible={selectedProduct !== null}
        onHide={() => { setSelectedProduct(null); }}
      />

      {/* Deliver Order Modal */}
      {showDeliverModal && (
        <DeliverOrderModal
          order={order}
          visible={showDeliverModal}
          onHide={() => { setShowDeliverModal(false); }}
          onConfirmDelivery={handleConfirmDelivery}
        />
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <CancelOrderModal
          order={order}
          visible={showCancelModal}
          onHide={() => { setShowCancelModal(false); }}
          onConfirmCancel={handleConfirmCancel}
        />
      )}
    </>
  );
}
