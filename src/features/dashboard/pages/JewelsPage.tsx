/**
 * Jewels Page - Placeholder
 */

import { Card } from "primereact/card";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

export function JewelsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isParentRoute = location.pathname === '/jewels' || location.pathname === '/jewels/';
  return (
    <div className="body dark:body">
      { isParentRoute ? (
        <>
          <div>
            <section className="page-header dark:page-header px-3 py-2">
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white m-0">Jewels</h1>
              <p className="m-0 text-secondary-900 dark:text-white">Jewels</p>
            </section>
            <hr className="m-0"/>
            <section className="py-4 h-full">
              <div>
                <h1 className="text-xl font-semibold text-secondary-900 dark:text-white px-4 mt-0 mb-4">Purpose</h1>
              </div>
              <div className="grid grid-cols-1 lg:flex gap-6 px-6">
                <div onClick={() => navigate('/jewels/inventory')} className="cursor-pointer">
                  <Card className="bg-base-bg w-104.5 h-auto">
                    <div className="p-card-body p-0">
                        <div>
                          <span className="material-symbols-rounded text-[#704F01]"> diamond </span>
                        </div>
                        <div>
                          <h1 className="text-xl font-bold text-secondary-900 dark:text-black my-1">Inventory</h1>
                          <p className="m-0 text-sm text-black">Manage Jewel Stock and content</p>
                        </div>
                    </div>
                  </Card>         
                </div>
              <div onClick={() => navigate('/jewels/categories')} className="cursor-pointer">
                <Card className="bg-base-bg w-104.5 h-auto">
                  <div className="p-card-body p-0">
                  <div>
                    <span className="material-symbols-rounded text-[#704F01]"> playing_cards</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-secondary-900 dark:text-black my-1">Categories</h1>
                    <p className="m-0 text-sm text-black">Manage Jewel Categories(Ex. chain, Nose pin etc)</p>
                  </div>
                  </div>
                </Card>
                </div>
              </div>
            </section>
          </div>
        </>
        ): (
        <Outlet/>
      )}
    </div>
  );
}

export default JewelsPage;
