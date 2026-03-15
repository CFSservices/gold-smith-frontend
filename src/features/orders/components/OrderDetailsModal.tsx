/**
 * Order Details Modal - Full rebuild per Figma
 * Figma nodes: 224:26576, 397:32072
 * Sections: header, payment summary, scheme info, customer card,
 * gift collection (3 states), product list, bottom action bar
 */

import { useState, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Icon } from '@/components/ui/Icon';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';
import { formatCurrency, formatDate } from '@/utils/format';
import { GiftCollectionSection } from './GiftCollectionSection';
import { OrderProductCard } from './OrderProductCard';
import { ViewProductModal } from './ViewProductModal';
import type { Order, OrderItem, OrderStatus } from '@/features/orders/types';

interface OrderDetailsModalProps {
  order: Order;
  visible: boolean;
  onHide: () => void;
  onOrderStatusUpdate?: (orderId: number, newStatus: OrderStatus) => void;
  onDeliveryComplete?: (orderId: number) => void;
  onDeliverOrderClick?: (order: Order) => void;
  onCancelOrderClick?: (order: Order) => void;
  onScanStockClick?: (order: Order) => void;
}

export function OrderDetailsModal({
  order,
  visible,
  onHide,
  onDeliveryComplete: _onDeliveryComplete, // Used for direct deliver flow
  onDeliverOrderClick,
  onCancelOrderClick,
  onScanStockClick,
}: OrderDetailsModalProps) {
  const [selectedProduct, setSelectedProduct] = useState<OrderItem | null>(null);

  const formatDateTime = (dateTime: string) => {
    return dateTime || formatDate(new Date());
  };

  const handleDeliverClick = useCallback(() => {
    if (onDeliverOrderClick) {
      onDeliverOrderClick(order);
    }
  }, [order, onDeliverOrderClick]);

  const handleScanStockClick = useCallback(() => {
    if (onScanStockClick) {
      onScanStockClick(order);
    }
  }, [order, onScanStockClick]);

  const handleCancelClick = useCallback(() => {
    if (onCancelOrderClick) {
      onCancelOrderClick(order);
    }
  }, [order, onCancelOrderClick]);

  const handleProductClick = useCallback((item: OrderItem) => {
    setSelectedProduct(item);
  }, []);

  const handleDone = useCallback(() => {
    onHide();
  }, [onHide]);

  const scannedCount = order.items?.reduce(
    (acc, item) => acc + (item.stockIds?.length ?? 0),
    0,
  ) ?? 0;

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
        className="order-details-modal"
        modal
        draggable={false}
        resizable={false}
        dismissableMask
        blockScroll
        footer={
          <div className="flex items-center justify-between w-full">
            {/* Left action icons */}
            <div className="flex items-center gap-2">
              {order.status === 'pending' && (
                <Button
                  icon={<PrimeReactIcon name="cancel" size={20} />}
                  text
                  rounded
                  severity="danger"
                  tooltip="Cancel Order"
                  tooltipOptions={{ position: 'top' }}
                  onClick={handleCancelClick}
                  aria-label="Cancel order"
                />
              )}
              {order.status === 'cancelled' && (
                <Button
                  icon={<PrimeReactIcon name="cancel" size={20} />}
                  text
                  rounded
                  severity="danger"
                  tooltip="Cancelled"
                  tooltipOptions={{ position: 'top' }}
                  aria-label="Order cancelled"
                />
              )}
              <Button
                icon={<PrimeReactIcon name="history" size={20} />}
                text
                rounded
                tooltip="History"
                tooltipOptions={{ position: 'top' }}
                aria-label="Order history"
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
            </div>

            {/* Right action buttons */}
            <div className="flex items-center gap-2">
              {order.status === 'pending' && (
                <Button
                  label="Scan Stock"
                  icon={<PrimeReactIcon name="qr_code_scanner" size={20} />}
                  severity="secondary"
                  onClick={handleScanStockClick}
                  badge={scannedCount > 0 ? String(scannedCount) : undefined}
                  badgeClassName="bg-red-500"
                  aria-label="Scan stock"
                />
              )}
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

                {/* Delivery status area */}
                <div className="mt-6 flex flex-col items-end gap-3">
                  {order.status === 'pending' && (
                    <>
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
                        onClick={handleDeliverClick}
                      />
                    </>
                  )}
                  {order.status === 'delivered' && order.deliveryInfo && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <Icon
                          name="check_circle"
                          size={18}
                          filled
                          className="text-green-600 dark:text-green-400"
                        />
                        <span className="text-sm-semibold text-green-600 dark:text-green-400">
                          Delivered
                        </span>
                      </div>
                      <div className="text-xs-normal text-secondary-600 dark:text-secondary-400 text-right">
                        {order.deliveryInfo.mode === 'home_delivery'
                          ? 'Home Delivery'
                          : 'Self Collection At Store'}
                      </div>
                      <div className="text-xs-normal text-secondary-600 dark:text-secondary-400 text-right">
                        On {order.deliveryInfo.deliveredAt}
                      </div>
                    </>
                  )}
                  {order.status === 'cancelled' && order.cancellationInfo && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <Icon
                          name="cancel"
                          size={18}
                          filled
                          className="text-red-600 dark:text-red-400"
                        />
                        <span className="text-sm-semibold text-red-600 dark:text-red-400">
                          Cancelled
                        </span>
                      </div>
                      <div className="text-xs-normal text-secondary-600 dark:text-secondary-400 text-right">
                        On {order.cancellationInfo.cancelledAt}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gift Collection — only show for pending orders with gift data */}
          {order.giftCollection && (
            <GiftCollectionSection order={order} />
          )}

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
    </>
  );
}
