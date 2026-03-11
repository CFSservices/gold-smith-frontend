// /**
//  * Admin Orders Page
//  */

// import { useState, useMemo, useRef } from 'react';
// import { Button } from 'primereact/button';
// import { Column } from 'primereact/column';
// import { DataTable } from 'primereact/datatable';
// import { InputText } from 'primereact/inputtext';
// import { SelectButton } from 'primereact/selectbutton';
// import { Calendar } from 'primereact/calendar';
// import { Badge } from 'primereact/badge';
// import { ordersList, type Order } from '@/mocks/data/orders';
// import { formatCurrency } from '@/utils/format';
// import { OrderDetailsModal } from '@/components/orders/OrderDetailsModal';

// export function AdminOrdersPage() {
//   const [status, setStatus] = useState<'pending' | 'delivered' | 'cancelled'>('pending');
//   const [search, setSearch] = useState('');
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [deliveryDates, setDeliveryDates] = useState<Record<number, Date>>({});
//   const calendarRefs = useRef<Record<number, Calendar | null>>({});

//   const orderTabs = [
//     { 
//       label: `Pending (${ordersList.filter(o => o.status === 'pending').length})`, 
//       value: 'pending' as const
//     },
//     { 
//       label: `Delivered (${ordersList.filter(o => o.status === 'delivered').length})`, 
//       value: 'delivered' as const
//     },
//     { 
//       label: `Cancelled (${ordersList.filter(o => o.status === 'cancelled').length})`, 
//       value: 'cancelled' as const
//     },
//   ];

//   const filteredOrders = useMemo(() => {
//     return ordersList.filter((o) => {
//       const matchStatus = o.status === status;
//       const matchSearch =
//         o.orderId.toLowerCase().includes(search.toLowerCase()) ||
//         o.customer.name.toLowerCase().includes(search.toLowerCase());

//       return matchStatus && matchSearch;
//     });
//   }, [status, search]);

//   const orderIdTemplate = (row: Order) => (
//     <div className="flex gap-3">
//       {/* Images */}
//       <div className="flex gap-2 flex-wrap">
//         {row.images.slice(0, 4).map((img: string, i: number) => (
//           <img
//             key={i}
//             src={img}
//             alt={`Product ${i + 1}`}
//             className="w-10 h-10 rounded-md object-cover border border-gray-200"
//           />
//         ))}
//       </div>
//       {/* Order Details */}
//       <div>
//         <div className="font-semibold text-sm">Order ID: {row.orderId}</div>
//         <div className="text-gray-600 text-sm">Amount: {formatCurrency(row.amount)}</div>
//         <div className="text-gray-500 text-xs">{row.itemCount} Items</div>
//       </div>
//     </div>
//   );

//   const sourceTemplate = (row: Order) => (
//     <div className="text-sm">
//       {row.source}
//     </div>
//   );

//   const statusTemplate = (row: Order) => {
//     const currentDate = deliveryDates[row.id] ?? null;
//     const hasNotification = row.id === 1;

//     const formatDateDisplay = (date: Date) =>
//       date.toLocaleDateString('en-GB', {
//         day: '2-digit',
//         month: 'short',
//         year: 'numeric',
//       });

//     return (
//       <div className="flex flex-col gap-2 min-w-[230px]">
//         <div className="text-xs text-gray-600">Expected Delivery By</div>
//         <div className="flex items-center gap-2">
//           <div
//             className="relative w-full cursor-pointer"
//             onClick={(e) => {
//               e.stopPropagation();
//               calendarRefs.current[row.id]?.show();
//             }}
//           >
//             <div className="w-full h-9 rounded-lg border border-gray-300 flex items-center px-3 pr-12 text-sm bg-white">
//               <span className={currentDate ? 'text-gray-800' : 'text-gray-400'}>
//                 {currentDate ? formatDateDisplay(currentDate) : 'Select Date'}
//               </span>
//               <i className="pi pi-calendar absolute right-3 text-amber-700 text-lg" />
//             </div>
//             <Calendar
//               ref={(el) => {
//                 calendarRefs.current[row.id] = el;
//               }}
//               value={currentDate}
//               onChange={(e) =>
//                 setDeliveryDates((prev) => ({
//                   ...prev,
//                   [row.id]: e.value as Date,
//                 }))
//               }
//               dateFormat="dd M yy"
//               className="hidden"
//             />
//           </div>
//           <Button
//             label="Deliver Order"
//             size="small"
//             severity="success"
//             onClick={(e) => {
//               e.stopPropagation();
//               // Handle deliver order
//             }}
//           />
//         </div>
//         {hasNotification && (
//           <div className="flex items-center gap-2 mt-1">
//             <i className="pi pi-gift text-red-500" />
//             <Badge value="1" severity="danger" />
//           </div>
//         )}
//       </div>
//     );
//   };

//   const onRowClick = (e: any) => {
//     // PrimeReact DataTable onRowClick event structure
//     const target = e.originalEvent?.target as HTMLElement;
    
//     // Don't open modal if clicking on interactive elements
//     if (target && (
//       target.tagName === 'BUTTON' || 
//       target.closest('button') || 
//       target.closest('.p-calendar') ||
//       target.closest('.p-dropdown') ||
//       target.closest('.p-inputtext') ||
//       target.closest('input') ||
//       target.closest('.p-calendar-panel')
//     )) {
//       return;
//     }
    
//     // Get the order data from the event
//     const order = e.data as Order;
//     if (order) {
//       setSelectedOrder(order);
//     }
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
//           Orders
//         </h1>
//       </div>

//       <hr className="border-gray-300 dark:border-gray-700 my-4" />

//       {/* Tabs + Search */}
//       <div className="flex justify-between items-center mt-8 mb-4">
//         <SelectButton
//           value={status}
//           onChange={(e) => setStatus(e.value)}
//           options={orderTabs}
//         />

//         <span className="p-input-icon-left relative">
//           <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2" />
//           <InputText
//             placeholder="Q Search"
//             className="w-64 pl-10"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <i className="pi pi-filter absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400" />
//         </span>
//       </div>

//       {/* Table */}
//       <DataTable
//         value={filteredOrders}
//         paginator
//         rows={5}
//         onRowClick={onRowClick}
//         rowClassName={() => "cursor-pointer hover:bg-gray-50 dark:hover:bg-secondary-800"}
//         dataKey="id"
//       >
//         <Column 
//           field="id" 
//           header="#" 
//           body={(row: Order) => (
//             <div>
//               #{row.id}
//             </div>
//           )}
//           style={{ width: '50px' }} 
//         />
//         <Column header="Order ID, Amount & Item Count" body={orderIdTemplate} />
//         <Column header="Source" body={sourceTemplate} />
//         <Column header="Status" body={statusTemplate} />
//       </DataTable>

//       {/* Order Details Modal */}
//       {selectedOrder && (
//         <OrderDetailsModal
//           order={selectedOrder}
//           visible={true}
//           onHide={() => {
//             setSelectedOrder(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// export default AdminOrdersPage;
