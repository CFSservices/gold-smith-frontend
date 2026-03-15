/**
 * Orders Page - Feature module version (Batch 2)
 * Pixel-perfect match to Figma nodes: 78:17117, 168:24185, 224:27132
 */

import { useCallback, useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { SelectButton } from 'primereact/selectbutton';

import { NewOrderModal } from '@/features/orders/components/NewOrderModal';
import { OrderPlacedModal } from '@/features/orders/components/OrderPlacedModal';
import { OrderDetailsModal } from '@/features/orders/components/OrderDetailsModal';
import { DeliverOrderModal } from '@/features/orders/components/DeliverOrderModal';
import { CancelOrderModal } from '@/features/orders/components/CancelOrderModal';
import { ScanStockModal } from '@/features/orders/components/ScanStockModal';
import { Icon } from '@/components/ui/Icon';
import { PrimeReactIcon } from '@/components/ui/Icon/PrimeReactIcon';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageHeader } from '@/components/ui/PageHeader';
import { useDebounce } from '@/hooks/useDebounce';
import { useOrders } from '@/features/orders/hooks';
import { CancelledStatusCell } from '@/features/orders/components/CancelledStatusCell';
import { DeliveredStatusCell } from '@/features/orders/components/DeliveredStatusCell';
import { OrderSourceBadge } from '@/features/orders/components/OrderSourceBadge';
import { PendingStatusCell } from '@/features/orders/components/PendingStatusCell';
import type { Order, OrderItem, OrderStatus } from '@/features/orders/types';

export function OrdersPage() {
  const [status, setStatus] = useState<OrderStatus>('pending');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [orderForDelivery, setOrderForDelivery] = useState<Order | null>(null);
  const [orderForCancel, setOrderForCancel] = useState<Order | null>(null);
  const [orderForScanStock, setOrderForScanStock] = useState<Order | null>(null);

  // Delivery date state (local until API integration)
  const [deliveryDates, setDeliveryDates] = useState<Record<number, Date | null>>({});

  // React Query
  const { data: orders = [], isLoading } = useOrders(status, debouncedSearch);

  // Filtered + sorted orders
  const filteredOrders = useMemo(() => {
    const lowerSearch = debouncedSearch.toLowerCase();

    const filtered = orders.filter((o) => {
      if (!lowerSearch) { return true; }
      return (
        o.orderId.toLowerCase().includes(lowerSearch) ||
        o.customer.name.toLowerCase().includes(lowerSearch)
      );
    });

    return [...filtered].sort((a, b) => {
      const parseDate = (s?: string) => {
        if (!s) { return 0; }
        if (s.includes('/')) {
          const [d, m, y] = s.split('/');
          return new Date(Number(y), Number(m) - 1, Number(d)).getTime() || 0;
        }
        const f = new Date(s);
        return isNaN(f.getTime()) ? 0 : f.getTime();
      };
      return (
        (parseDate(b.orderedOn) || parseDate(b.orderDateTime)) -
        (parseDate(a.orderedOn) || parseDate(a.orderDateTime))
      );
    });
  }, [orders, debouncedSearch]);

  // Tab counts — we need all-status counts, so derive from the hook data per status
  // For now use the current filtered list length; counts for other tabs come from separate queries
  // TODO: Replace with server-side counts when API is ready
  const allOrders = useOrders(undefined, '');
  const tabCounts = useMemo(() => {
    const all = allOrders.data ?? [];
    return {
      pending: all.filter((o) => o.status === 'pending').length,
      delivered: all.filter((o) => o.status === 'delivered').length,
      cancelled: all.filter((o) => o.status === 'cancelled').length,
    };
  }, [allOrders.data]);

  const orderTabs = useMemo(
    () => [
      { label: ` Pending (${tabCounts.pending}) `, value: 'pending' as const },
      { label: ` Delivered (${tabCounts.delivered}) `, value: 'delivered' as const },
      { label: ` Cancelled (${tabCounts.cancelled}) `, value: 'cancelled' as const },
    ],
    [tabCounts],
  );

  // --- Callbacks ---

  const handleDateChange = useCallback((orderId: number, date: Date | null) => {
    setDeliveryDates((prev) => ({ ...prev, [orderId]: date }));
  }, []);

  const handleDeliverOrder = useCallback((order: Order) => {
    setOrderForDelivery(order);
  }, []);

  const handleOrderStatusUpdate = useCallback(
    (orderId: number, newStatus: OrderStatus) => {
      // With React Query this will be handled by mutation + invalidation
      // For now, close modals and switch tab
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
      setStatus(newStatus);
    },
    [selectedOrder],
  );

  const handleOrderPlaced = useCallback(
    (orderData: {
      customer: { name: string; phone: string; avatar?: string };
      items: Array<{
        id: string;
        name: string;
        image: string;
        price: number;
        weight: string;
        barcode: string;
      }>;
      paymentMethod: string;
      totalValue: number;
    }) => {
      const newOrderId = Math.floor(Math.random() * 10000000);
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });

      const orderItems: OrderItem[] = orderData.items.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        unitPrice: item.price,
        quantity: 1,
        material: 'Gold',
        weight: item.weight,
        productId: item.barcode,
      }));

      let source = 'Cash / Card / UPI';
      let paymentMethodDisplay = 'RazorPay';
      let sourceDetails: { id: string; title: string; subtitle?: string } | undefined;

      if (orderData.paymentMethod === 'scheme_redemption') {
        source = 'Scheme Redemption';
        paymentMethodDisplay = 'Scheme Redemption';
        sourceDetails = {
          id: `#${Math.floor(Math.random() * 10000000)}`,
          title: 'Gold 11 Flexi (24 Jan 2025 - 24 Nov 2025)',
        };
      } else if (orderData.paymentMethod === 'advance_redemption') {
        source = 'Advance Redemption';
        paymentMethodDisplay = 'Advance Redemption';
      }

      const newOrder: Order = {
        id: Date.now(),
        orderId: `#${newOrderId}`,
        amount: orderData.totalValue,
        itemCount: orderData.items.length,
        images: orderData.items.map((i) => i.image),
        staff: { name: 'John Doe', phone: '7998139111', avatar: 'assets/users/u1.jpg' },
        customer: {
          name: orderData.customer.name,
          phone: orderData.customer.phone,
          avatar: orderData.customer.avatar ?? 'assets/users/u2.jpg',
        },
        orderedOn: dateStr,
        orderDateTime: `${dateStr} ${timeStr}, ${dayName}`,
        source: source as Order['source'],
        status: 'pending',
        totalPaid: orderData.totalValue * 1.18,
        transactionId: Math.floor(Math.random() * 100000000).toString(),
        paymentMethod: paymentMethodDisplay,
        items: orderItems,
        jewelCount: orderData.items.length,
        unitCount: orderData.items.length,
        sourceDetails,
        deliveryStatus: 'pending',
      };

      setShowNewOrderModal(false);
      setPlacedOrder(newOrder);
    },
    [],
  );

  // --- Row click ---
  const onRowClick = useCallback(
    (e: { originalEvent?: { target: EventTarget | null }; data: unknown }) => {
      const target = e.originalEvent?.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.closest('button') ||
          target.closest('[aria-label="Clear date"]') ||
          target.closest('.p-calendar') ||
          target.closest('.p-dropdown') ||
          target.closest('.p-inputtext') ||
          target.closest('input'))
      ) {
        return;
      }
      setSelectedOrder(e.data as Order);
    },
    [],
  );

  // --- Column body templates ---

  const rowNumberBody = useCallback(
    (_: Order, opts: { rowIndex: number }) => <span>{opts.rowIndex + 1}</span>,
    [],
  );

  const imagesBody = useCallback(
    (row: Order) => (
      <div className="flex flex-wrap gap-1.5 py-4">
        {row.images.slice(0, 4).map((img) => (
          <img
            key={img}
            src={img}
            className="w-8 h-8 rounded-lg object-cover border border-border-default dark:border-secondary-700"
            alt=""
          />
        ))}
      </div>
    ),
    [],
  );

  const orderIdBody = useCallback(
    (row: Order) => (
      <div className="py-4">
        <div className="text-base-medium text-secondary-900 dark:text-white">{row.orderId}</div>
        <div className="text-base-medium text-secondary-700 dark:text-secondary-300">
          &#8377;{row.amount.toLocaleString('en-IN')}
        </div>
        <div className="text-sm-normal text-text-muted dark:text-secondary-400">
          {row.itemCount} {row.itemCount === 1 ? 'Item' : 'Items'}
        </div>
      </div>
    ),
    [],
  );

  const staffCustomerBody = useCallback(
    (row: Order) => (
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-2">
          <img
            src={row.staff.avatar}
            alt=""
            className="w-12 h-12 rounded-lg border-2 border-text-muted dark:border-secondary-500 object-cover"
          />
          <img
            src={row.customer.avatar}
            alt=""
            className="w-12 h-12 rounded-lg border-2 border-success object-cover"
          />
        </div>
        <div>
          <div className="text-base-medium text-secondary-700 dark:text-secondary-300">
            {row.staff.name}
          </div>
          <div className="text-sm-normal text-text-muted dark:text-secondary-400">
            {row.staff.phone}
          </div>
          <div className="text-base-medium text-secondary-700 dark:text-secondary-300 mt-2">
            {row.customer.name}
          </div>
          <div className="text-sm-normal text-text-muted dark:text-secondary-400">
            {row.customer.phone}
          </div>
        </div>
      </div>
    ),
    [],
  );

  const sourceBody = useCallback(
    (row: Order) => <OrderSourceBadge source={row.source} />,
    [],
  );

  const statusBody = useCallback(
    (row: Order) => {
      if (row.status === 'pending') {
        return (
          <PendingStatusCell
            order={row}
            deliveryDate={deliveryDates[row.id] ?? null}
            onDateChange={handleDateChange}
            onDeliverOrder={handleDeliverOrder}
          />
        );
      }
      if (row.status === 'delivered') {
        return <DeliveredStatusCell order={row} />;
      }
      return <CancelledStatusCell order={row} />;
    },
    [deliveryDates, handleDateChange, handleDeliverOrder],
  );

  // Figma: column header changes per tab
  const statusColumnHeader = status === 'pending' ? 'Status' : 'Status';
  const orderIdHeader =
    status === 'pending' ? 'Order ID , Amount & Item Count' : 'Order ID , Amount & Units';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Orders"
        breadcrumb="Orders"
        actions={
          <Button
            label="New Order"
            icon={<PrimeReactIcon name="add_circle" size={20} />}
            onClick={() => { setShowNewOrderModal(true); }}
            aria-label="Create new order"
          />
        }
      />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col h-full space-y-0 px-4 md:px-6 pt-4">
          {/* Filters row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0 px-4 py-3">
            <div className="tab-bar">
              <SelectButton
                value={status}
                onChange={(e) => { setStatus(e.value as OrderStatus); }}
                options={orderTabs}
              />
            </div>

            <div className="flex items-center gap-4">
              <Button
                icon={<PrimeReactIcon name="filter_alt" size={28} />}
                text
                rounded
                className="text-gold-dark dark:text-gold-400"
                aria-label="Filter orders"
              />
              <IconField iconPosition="left" className="w-full sm:w-[194px]">
                <InputIcon>
                  <Icon name="search" size={20} className="text-secondary-500" />
                </InputIcon>
                <InputText
                  placeholder="Search"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); }}
                  aria-label="Search orders by ID or customer"
                  className="w-full"
                />
              </IconField>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <LoadingSpinner />
              </div>
            ) : (
              <DataTable
                className="datatable"
                value={filteredOrders}
                scrollable
                scrollHeight="flex"
                onRowClick={onRowClick}
                rowClassName={() =>
                  'cursor-pointer hover:bg-gray-50 dark:hover:bg-secondary-800'
                }
                dataKey="id"
                emptyMessage={
                  <div className="py-8 text-center text-sm text-secondary-500 dark:text-secondary-400">
                    {orders.length === 0
                      ? 'No orders to display yet.'
                      : 'No orders match the current filters.'}
                  </div>
                }
              >
                <Column header="#" body={rowNumberBody} style={{ width: '60px' }} />
                <Column header="" body={imagesBody} style={{ minWidth: '120px' }} />
                <Column header={orderIdHeader} body={orderIdBody} style={{ minWidth: '180px' }} />
                <Column header="Staff & Customer" body={staffCustomerBody} />
                <Column field="orderedOn" header="Ordered On" />
                <Column header="Order Source" body={sourceBody} />
                <Column header={statusColumnHeader} body={statusBody} />
              </DataTable>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          visible
          onHide={() => { setSelectedOrder(null); }}
          onOrderStatusUpdate={handleOrderStatusUpdate}
          onDeliveryComplete={(orderId: number) => {
            handleOrderStatusUpdate(orderId, 'delivered');
          }}
          onDeliverOrderClick={(o: Order) => {
            setSelectedOrder(null);
            setOrderForDelivery(o);
          }}
          onCancelOrderClick={(o: Order) => {
            setSelectedOrder(null);
            setOrderForCancel(o);
          }}
          onScanStockClick={(o: Order) => {
            setSelectedOrder(null);
            setOrderForScanStock(o);
          }}
        />
      )}

      <NewOrderModal
        visible={showNewOrderModal}
        onHide={() => { setShowNewOrderModal(false); }}
        onPaymentMethodSelect={handleOrderPlaced}
      />

      {placedOrder && (
        <OrderPlacedModal
          order={placedOrder}
          visible={!!placedOrder}
          onHide={() => {
            setPlacedOrder(null);
            setShowNewOrderModal(false);
          }}
          onOrderConfirm={() => {
            setStatus('pending');
          }}
          onDeliveryComplete={(orderId: number) => {
            handleOrderStatusUpdate(orderId, 'delivered');
            setPlacedOrder(null);
          }}
        />
      )}

      {orderForDelivery && (
        <DeliverOrderModal
          order={orderForDelivery}
          visible={!!orderForDelivery}
          onHide={() => { setOrderForDelivery(null); }}
          onConfirmDelivery={() => {
            handleOrderStatusUpdate(orderForDelivery.id, 'delivered');
            setOrderForDelivery(null);
          }}
        />
      )}

      {orderForCancel && (
        <CancelOrderModal
          order={orderForCancel}
          visible={!!orderForCancel}
          onHide={() => { setOrderForCancel(null); }}
          onConfirmCancel={() => {
            handleOrderStatusUpdate(orderForCancel.id, 'cancelled');
            setOrderForCancel(null);
          }}
        />
      )}

      {orderForScanStock && (
        <ScanStockModal
          order={orderForScanStock}
          visible={!!orderForScanStock}
          onHide={() => { setOrderForScanStock(null); }}
          onDone={() => {
            // TODO: Call scanStock mutation when API is ready
            setOrderForScanStock(null);
          }}
        />
      )}
    </div>
  );
}

export default OrdersPage;
