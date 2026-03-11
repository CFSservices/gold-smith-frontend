// //** Orders page */


import { DeliverOrderModal } from "@/components/orders/DeliverOrderModal";
import { NewOrderModal } from "@/components/orders/NewOrderModal";
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal";
import { OrderPlacedModal } from "@/components/orders/OrderPlacedModal";
import { Icon } from "@/components/ui/Icon";
import { PrimeReactIcon } from "@/components/ui/Icon/PrimeReactIcon";
import { PageHeader } from "@/components/ui/PageHeader";
import { ordersList, type Order, type OrderItem } from "@/mocks/data/orders";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { useEffect, useMemo, useRef, useState } from "react";

export function OrdersPage() {
  const [status, setStatus] = useState<"pending" | "delivered" | "cancelled">("pending");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>(ordersList);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [deliveryDates, setDeliveryDates] = useState<Record<number, Date | null>>({});
  const [orderForDelivery, setOrderForDelivery] = useState<Order | null>(null);
  const calendarRefs = useRef<Record<number, Calendar | null>>({});

  // Tab labels with counts - Figma: "Pending (4)", "Delivered (2)", "Cancelled (2)"
  const orderTabs = useMemo(() => {
    const pending = orders.filter((o) => o.status === "pending").length;
    const delivered = orders.filter((o) => o.status === "delivered").length;
    const cancelled = orders.filter((o) => o.status === "cancelled").length;
    return [
      { label: ` Pending (${pending}) `, value: "pending" as const },
      { label: ` Delivered (${delivered}) `, value: "delivered" as const },
      { label: ` Cancelled (${cancelled}) `, value: "cancelled" as const },
    ];
  }, [orders]);

  // Update orders when ordersList changes (for development/testing)
  useEffect(() => {
    setOrders([...ordersList]);
    // Initialize delivery dates from orders
    const initialDates: Record<number, Date | null> = {};
    ordersList.forEach((order) => {
      if (order.expectedDelivery) {
        // Parse date from format "01/01/2024" or "01 Jan 2024"
        const dateStr = order.expectedDelivery;
        // Try parsing different date formats
        let date: Date | null = null;
        if (dateStr.includes('/')) {
          // Format: "01/01/2024" (DD/MM/YYYY)
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
          }
        } else {
          // Try standard date parsing
          date = new Date(dateStr);
        }
        if (date && !isNaN(date.getTime())) {
          initialDates[order.id] = date;
        }
      }
    });
    setDeliveryDates(initialDates);
  }, []);

  // Helper to parse DD/MM/YYYY or fallback formats
  const parseOrderDate = (dateStr: string | undefined): number => {
    if (!dateStr) {return 0;}
    if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const d = new Date(
          Number(parts[2]),
          Number(parts[1]) - 1,
          Number(parts[0])
        );
        return d.getTime() || 0;
      }
    }
    const fallback = new Date(dateStr);
    return isNaN(fallback.getTime()) ? 0 : fallback.getTime();
  };

  const filteredOrders = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    const byStatusAndSearch = orders.filter((o) => {
      const matchStatus = o.status === status;
      const matchSearch =
        !lowerSearch ||
        o.orderId.toLowerCase().includes(lowerSearch) ||
        o.customer.name.toLowerCase().includes(lowerSearch);

      return matchStatus && matchSearch;
    });

    // Sort by orderedOn / orderDateTime descending so most recent is first
    return [...byStatusAndSearch].sort((a, b) => {
      const dateB =
        parseOrderDate(b.orderedOn) || parseOrderDate(b.orderDateTime);
      const dateA =
        parseOrderDate(a.orderedOn) || parseOrderDate(a.orderDateTime);
      return dateB - dateA;
    });
  }, [orders, status, search]);

  // Handle order status update
  const handleOrderStatusUpdate = (orderId: number, newStatus: 'pending' | 'delivered' | 'cancelled') => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, deliveryStatus: newStatus === 'delivered' ? 'delivered' : order.deliveryStatus }
          : order
      )
    );

    // Update selected order if it's the one being updated
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus, deliveryStatus: newStatus === 'delivered' ? 'delivered' : selectedOrder.deliveryStatus });
    }
  };

  // Handle new order placement
  const handleOrderPlaced = (orderData: {
    customer: { name: string; phone: string; avatar?: string };
    items: Array<{ id: string; name: string; image: string; price: number; weight: string; barcode: string }>;
    paymentMethod: string;
    totalValue: number;
  }) => {
    // Generate order ID
    const newOrderId = Math.floor(Math.random() * 10000000);
    const orderIdString = `#${newOrderId}`;
    
    // Generate transaction ID
    const transactionId = Math.floor(Math.random() * 100000000).toString();
    
    // Get current date and time
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
    const orderDateTime = `${dateStr} ${timeStr}, ${dayName}`;
    
    // Calculate GST (assuming 18% GST)
    const gstRate = 0.18;
    const totalWithGST = orderData.totalValue * (1 + gstRate);
    
    // Convert items to OrderItem format
    const orderItems: OrderItem[] = orderData.items.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      unitPrice: item.price,
      quantity: 1,
      material: 'Gold', // Default material
      weight: item.weight,
      productId: item.barcode,
    }));
    
    // Get unique jewel count (assuming each item is a jewel)
    const jewelCount = orderData.items.length;
    const unitCount = orderData.items.length;
    
    // Get images from items
    const images = orderData.items.map(item => item.image);
    
    // Determine source and payment method based on payment method type
    let source = 'Cash / Card / UPI';
    let paymentMethodDisplay = 'RazorPay';
    let sourceDetails = undefined;
    
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
    
    // Create new order (but don't add to list yet - wait for "Done" button)
    const newOrder: Order = {
      id: orders.length + 1,
      orderId: orderIdString,
      amount: orderData.totalValue,
      itemCount: orderData.items.length,
      images: images,
      staff: {
        name: 'John Doe',
        phone: '7998139111',
        avatar: 'assets/users/u1.jpg',
      },
      customer: {
        name: orderData.customer.name,
        phone: orderData.customer.phone,
        avatar: orderData.customer.avatar || 'assets/users/u2.jpg',
      },
      orderedOn: dateStr,
      orderDateTime: orderDateTime,
      source: source,
      status: 'pending',
      totalPaid: totalWithGST,
      transactionId: transactionId,
      paymentMethod: paymentMethodDisplay,
      items: orderItems,
      deliveryStatus: 'pending',
      jewelCount: jewelCount,
      unitCount: unitCount,
      sourceDetails: sourceDetails,
    };
    
    // Close new order modal
    setShowNewOrderModal(false);
    
    // Show order placed modal (the new component) - order will be added when "Done" is clicked
    setPlacedOrder(newOrder);
  };

  // Row number template - shows sequential numbers (1, 2, 3...)
  const rowNumberTemplate = (rowData: Order) => {
    // Find the index of this row in the filtered orders array
    const rowIndex = filteredOrders.findIndex((order) => order.id === rowData.id);
    return <span>{rowIndex + 1}</span>;
  };

const imagesTemplate = (row: any) => (
  <div className="flex flex-col gap-1.5 py-4">
    <div className="flex flex-wrap gap-1.5">
      {row.images.slice(0, 4).map((img: string) => (
        <img
          key={img}
          src={img}
          className="w-8 h-8 rounded-lg object-cover border border-border-default dark:border-secondary-700"
          alt=""
        />
      ))}
    </div>
  </div>
);


    // Order ID, Amount & Item Count - Figma 16px font, 14px body
    const OrderID = (row: any) => (
    <div className="py-4">
      <div className="font-medium text-base text-secondary-900 dark:text-white">{row.orderId}</div>
      <div className="font-medium text-base text-secondary-700 dark:text-secondary-300">₹{row.amount.toLocaleString()}</div>
      <div className="text-sm text-text-muted dark:text-secondary-400">{row.itemCount} Items</div>
    </div>
  );

    // Staff + Customer - Figma: staff border #555, customer border #00a91c
    const staffCustomerTemplate = (row: any) => (
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
        <div className="font-medium text-base text-secondary-700 dark:text-secondary-300">{row.staff.name}</div>
        <div className="text-sm text-text-muted dark:text-secondary-400">{row.staff.phone}</div>
        <div className="font-medium text-base text-secondary-700 dark:text-secondary-300 mt-2">{row.customer.name}</div>
        <div className="text-sm text-text-muted dark:text-secondary-400">{row.customer.phone}</div>
      </div>
    </div>
  );

  // ✅ Status column template
  const statusTemplate = (row: Order) => {
    const currentDate = deliveryDates[row.id] ?? null;

    const formatDateDisplay = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleDateString('en-GB', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    };

    const handleDateChange = (e: any) => {
      setDeliveryDates((prev) => ({
        ...prev,
        [row.id]: e.value as Date | null,
      }));
      // Update order's expectedDelivery field
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === row.id
            ? {
                ...order,
                expectedDelivery: e.value
                  ? formatDateDisplay(e.value as Date)
                  : undefined,
              }
            : order
        )
      );
    };

    const handleClearDate = (e: React.MouseEvent) => {
      e.stopPropagation();
      setDeliveryDates((prev) => ({
        ...prev,
        [row.id]: null,
      }));
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === row.id ? { ...order, expectedDelivery: undefined } : order
        )
      );
    };

    const handleDeliverOrder = (e: React.MouseEvent) => {
      e.stopPropagation();
      setOrderForDelivery(row);
    };

    return (
      <div className="flex flex-col gap-2 min-w-[230px]">
        <div className="text-xs text-gray-600 dark:text-gray-400">Expected Delivery By</div>
        
        <div className="relative w-full">
          <div
            className="relative w-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              calendarRefs.current[row.id]?.show();
            }}
          >
            <div className="w-full h-9 sm:h-10 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center px-3 pr-12 text-sm bg-white dark:bg-secondary-800">
              <span className={currentDate ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}>
                {currentDate ? formatDateDisplay(currentDate) : 'Select Date'}
              </span>
              {currentDate && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={handleClearDate}
                  onKeyDown={(e) => e.key === 'Enter' && handleClearDate(e as unknown as React.MouseEvent)}
                  className="absolute right-8 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 cursor-pointer"
                  aria-label="Clear date"
                >
                  <Icon name="close" size={18} />
                </span>
              )}
              <Icon name="calendar_month" size={20} className="absolute right-3 text-gold-dark dark:text-gold-400" />
            </div>
            <Calendar
              ref={(el) => {
                calendarRefs.current[row.id] = el;
              }}
              value={currentDate}
              onChange={handleDateChange}
              dateFormat="dd M yy"
              className="hidden"
              showIcon={false}
            />
          </div>
        </div>

        <Button
          label="Deliver Order"
          icon={<PrimeReactIcon name="package_2" size={20} />}
          size="small"
          onClick={handleDeliverOrder}
          className="w-full"
        />

        {/* {hasGiftNotification && (
          <div className="flex items-center gap-2 mt-1 relative">
            <Icon name="featured_seasonal_and_gifts" size={24} className="text-gold-700 dark:text-gold-400" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-secondary-800"></span>
          </div>
        )} */}
      </div>
    );
  };

  const onRowClick = (e: any) => {
    // PrimeReact DataTable onRowClick event structure
    const target = e.originalEvent?.target as HTMLElement;
    
    // Don't open modal if clicking on interactive elements
    if (target && (
      target.tagName === 'BUTTON' || 
      target.closest('button') || 
      target.closest('[aria-label="Clear date"]') ||
      target.closest('.p-calendar') ||
      target.closest('.p-dropdown') ||
      target.closest('.p-inputtext') ||
      target.closest('input') ||
      target.closest('.p-calendar-panel')
    )) {
      return;
    }
    
    // Get the order data from the event
    const order = e.data as Order;
    if (order) {
      setSelectedOrder(order);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Fixed Page Title Section */}
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

      {/* Scrollable Content Section */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="flex flex-col h-full space-y-0 px-4 md:px-6 pt-4">
          {/* Filters + Actions - Figma: px-4 py-3, 16px gap */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between shrink-0 px-4 py-3">
            <div className="tab-bar">
              <SelectButton
                value={status}
                onChange={(e) => { setStatus(e.value); }}
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

          {/* Table - Figma header #f2f2f2 */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <DataTable
              className="datatable"
              value={filteredOrders}
              scrollable
              scrollHeight="flex"
              onRowClick={onRowClick}
              rowClassName={() => "cursor-pointer hover:bg-gray-50 dark:hover:bg-secondary-800"}
              dataKey="id"
              emptyMessage={
                orders.length === 0 ? (
                  <div className="py-8 text-center text-sm text-secondary-500 dark:text-secondary-400">
                    No orders to display yet.
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-secondary-500 dark:text-secondary-400">
                    No orders match the current filters.
                  </div>
                )
              }
            >
              <Column header="#" body={rowNumberTemplate} style={{ width: '60px' }} />
              <Column header="Order ID , Amount & Item Count" body={OrderID} style={{ minWidth: '180px' }} />
              <Column header="Order" body={imagesTemplate} style={{ minWidth: '120px' }} />
              <Column header="Staff & Customer" body={staffCustomerTemplate} />
              <Column field="orderedOn" header="Ordered On" />
              <Column field="source" header="Ordered Source" />
              <Column header="Status" body={statusTemplate} />
            </DataTable>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          visible={true}
          onHide={() => {
            setSelectedOrder(null);
          }}
          onOrderStatusUpdate={handleOrderStatusUpdate}
          onDeliveryComplete={(orderId) => {
            handleOrderStatusUpdate(orderId, 'delivered');
            setStatus('delivered'); // Switch to delivered tab
            setSelectedOrder(null); // Close modal
          }}
        />
      )}

      {/* New Order Modal */}
      <NewOrderModal
        visible={showNewOrderModal}
        onHide={() => { setShowNewOrderModal(false); }}
        onPaymentMethodSelect={(orderData) => {
          handleOrderPlaced(orderData);
        }}
      />

      {/* Order Placed Modal */}
      {placedOrder && (
        <OrderPlacedModal
          order={placedOrder}
          visible={!!placedOrder}
          onHide={() => {
            setPlacedOrder(null);
            setShowNewOrderModal(false);
          }}
          onOrderConfirm={(order) => {
            // Add order to list when "Done" is clicked
            setOrders((prevOrders) => [order, ...prevOrders]);
            setStatus('pending'); // Switch to pending tab to see the new order
          }}
          onDeliveryComplete={(orderId) => {
            handleOrderStatusUpdate(orderId, 'delivered');
            setStatus('delivered');
            setPlacedOrder(null);
          }}
        />
      )}

      {/* Deliver Order Modal */}
      {orderForDelivery && (
        <DeliverOrderModal
          order={orderForDelivery}
          visible={!!orderForDelivery}
          onHide={() => {
            setOrderForDelivery(null);
          }}
          onConfirmDelivery={(data) => {
            // Handle delivery confirmation
            console.log('Delivery confirmed:', data);
            if (orderForDelivery.id) {
              handleOrderStatusUpdate(orderForDelivery.id, 'delivered');
              setStatus('delivered');
            }
            setOrderForDelivery(null);
          }}
        />
      )}
    </div>
  );
}

export default OrdersPage;


/**
 * Orders Page - Placeholder
 */

// import { PageHeader } from '@/components/ui/PageHeader';

// export function OrdersPage() {
//   return (
//     <div className="flex flex-col h-full overflow-hidden">
//       {/* Fixed Page Title Section */}
//       <PageHeader title="Orders" breadcrumb="Orders" />

//       {/* Scrollable Content Section */}
//       <div className="flex-1 min-h-0 overflow-y-auto">
//         <div className="space-y-6 p-4 md:p-6 pt-7 md:pt-7">
//           <p className="text-secondary-500 dark:text-secondary-400">
//             Orders management page - Coming soon
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrdersPage;
