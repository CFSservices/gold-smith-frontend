// //** Orders page */


import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { SelectButton } from "primereact/selectbutton";
import { Calendar } from "primereact/calendar";
import { useState, useMemo, useEffect, useRef } from "react";
import { ordersList, type Order, type OrderItem } from "@/mocks/data/orders";
import { OrderDetailsModal } from "@/components/orders/OrderDetailsModal";
import { NewOrderModal } from "@/components/orders/NewOrderModal";
import { OrderPlacedModal } from "@/components/orders/OrderPlacedModal";
import { DeliverOrderModal } from "@/components/orders/DeliverOrderModal";

export function OrdersPage() {
  const orderTabs = [
    { label: " Pending ", value: "pending" },
    { label: " Delivered ", value: "delivered" },
    { label: " Cancelled ", value: "cancelled" },
  ];

  const [status, setStatus] = useState("pending");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>(ordersList);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [deliveryDates, setDeliveryDates] = useState<Record<number, Date | null>>({});
  const [orderForDelivery, setOrderForDelivery] = useState<Order | null>(null);
  const calendarRefs = useRef<Record<number, Calendar | null>>({});

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

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = o.status === status;
      const matchSearch =
        o.orderId.toLowerCase().includes(search.toLowerCase()) ||
        o.customer.name.toLowerCase().includes(search.toLowerCase());

      return matchStatus && matchSearch;
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
    if (selectedOrder && selectedOrder.id === orderId) {
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
    const orderItems: OrderItem[] = orderData.items.map((item, index) => ({
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
  <div className="flex flex-col gap-2 w-32">
    {/* Order ID */}
    {/* <div className="font-semibold text-sm text-gray-700">
      #{row.id}
    </div> */}

    {/* Images */}
    <div className="flex gap-2 flex-wrap">
      {row.images.slice(0, 4).map((img: string, i: number) => (
        <img
          key={i}
          src={img}
          className="w-10 h-10 rounded-md object-cover border"
        />
      ))}
    </div>
  </div>
);


    // ✅ Order + Amount column
   const OrderID = (row: any) => (
    <div>
      <div className="font-semibold">{row.orderId}</div>
      <div className="text-gray-600">₹{row.amount.toLocaleString()}</div>
      <div className="text-gray-500">{row.itemCount} Items</div>
    </div>
  );

    // ✅ Staff + Customer column
    const staffCustomerTemplate = (row: any) => (
    <div className="flex items-center gap-3">
      <div className="flex flex-col gap-2">
        <img
          src={row.staff.avatar}
          className="w-10 h-10 rounded-lg border-2 border-gray-300"
        />
        <img
          src={row.customer.avatar}
          className="w-10 h-10 rounded-lg border-2 border-green-500"
        />
      </div>

      <div>
        <div className="font-semibold">{row.staff.name}</div>
        <div className="text-sm text-gray-500">{row.staff.phone}</div>

        <div className="font-semibold mt-2">{row.customer.name}</div>
        <div className="text-sm text-gray-500">{row.customer.phone}</div>
      </div>
    </div>
  );

  // ✅ Status column template
  const statusTemplate = (row: Order) => {
    const currentDate = deliveryDates[row.id] ?? null;
    const hasGiftNotification = row.giftCollection?.status === 'pending';

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
                <i
                  className="pi pi-times absolute right-8 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  onClick={handleClearDate}
                />
              )}
              <i className="pi pi-calendar absolute right-3 text-amber-700 dark:text-amber-500 text-lg" />
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
          icon="pi pi-box"
          severity="warning"
          size="small"
          onClick={handleDeliverOrder}
          className="w-full"
        />

        {/* {hasGiftNotification && (
          <div className="flex items-center gap-2 mt-1 relative">
            <i className="pi pi-gift text-amber-700 dark:text-amber-500 text-lg" />
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
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mt-0">
          Orders
        </h1>
        <Button
          label="New Order"
          icon="pi pi-plus-circle"
          severity="warning"
          onClick={() => setShowNewOrderModal(true)}
        />
      </div>

      <hr className="border-gray-300 dark:border-gray-700 my-4 flex-shrink-0" />

      {/* Tabs + Search */}
      <div className="flex justify-between items-center mt-8 mb-4 px-8 flex-shrink-0">
        <SelectButton
          value={status}
          onChange={(e) => setStatus(e.value)}
          options={orderTabs}
        />

        <span className="p-input-icon-left relative">
          <i className="pi pi-search absolute left-3 " />
          <InputText
            placeholder="Search orders"
            className="w-64 pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <DataTable 
          value={filteredOrders} 
          scrollable
          scrollHeight="calc(100vh - 300px)"
          onRowClick={onRowClick}
          rowClassName={() => "cursor-pointer hover:bg-gray-50 dark:hover:bg-secondary-800"}
          dataKey="id"
        >
          <Column header="#" body={rowNumberTemplate} style={{ width: '60px' }} />
          <Column header="order" body={imagesTemplate} />
          <Column header="orderID,Amount & Item Count" body={OrderID} />
          <Column header="Staff & Customer" body={staffCustomerTemplate} />
          <Column field="orderedOn" header="Ordered On" />
          <Column field="source" header="Ordered Source" />
          <Column header="Status" body={statusTemplate} />
        </DataTable>
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
        onHide={() => setShowNewOrderModal(false)}
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
