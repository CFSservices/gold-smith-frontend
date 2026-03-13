import { Card } from "primereact/card";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

export function ContentPage() {

  const navigate = useNavigate();
  const location = useLocation();

  const isParentRoute = location.pathname === '/content' || location.pathname === '/content/';

  return (
    <div className="body dark:body">
      { isParentRoute ? (
        <>
          <div className="h-full">
            <section className="page-header dark:page-header px-3 py-2">
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white m-0">Content</h1>
              <p className="m-0 text-secondary-900 dark:text-white">Content</p>
            </section>
            <hr className="m-0"/>
            <section className="py-4 h-full">
              <div>
                <h1 className="text-xl font-semibold text-secondary-900 dark:text-white px-4 mt-0 mb-4">Purpose</h1>
              </div>
              <div className="flex flex-wrap gap-6 px-6">
                <div className="w-[362px] cursor-pointer">
                  <Card pt={{ 
                    root: { className: 'p-4 border border-gray-200 h-[120px] rounded-2xl bg-base-bg w-full shadow-none'},
                    body: { className: 'p-0' },
                    content: { className: 'p-0 m-0' } }}>
                    <div>
                        <div>
                          <span className="material-symbols-rounded text-[#704F01] font-normal"> home </span>
                        </div>
                        <div>
                          <h1 className="text-lg font-semibold text-secondary-900 dark:text-black m-0">Home Screen Contents</h1>
                          <p className="m-0 text-xs text-black">Control what customers see in their app's home screen</p>
                        </div>
                    </div>
                  </Card>         
                </div>
                <div onClick={() => navigate('/content/scheme-rules')} className="w-[362px] cursor-pointer">
                  <Card pt={{ 
                      root: { className: 'p-4 border border-gray-200 h-[120px] rounded-2xl bg-base-bg w-full shadow-none'},
                      body: { className: 'p-0' },
                      content: { className: 'p-0 m-0' } }}>
                    <div>
                      <div>
                        <span className="material-symbols-rounded text-[#704F01] font-normal"> menu_book </span>
                      </div>
                      <div>
                        <h1 className="text-lg font-semibold text-secondary-900 dark:text-black m-0">Scheme Rules</h1>
                        <p className="m-0 text-xs text-black">Manage schemes and rule contents</p>
                      </div>
                    </div>
                  </Card>
                  </div>
                  <div className="w-[362px] cursor-pointer">
                    <Card pt={{ 
                        root: { className: 'p-4 border border-gray-200 h-[120px] rounded-2xl bg-base-bg w-full shadow-none'},
                        body: { className: 'p-0' },
                        content: { className: 'p-0 m-0' } }}>
                      <div>
                        <div>
                          <span className="material-symbols-rounded text-[#704F01] font-normal"> gavel </span>
                        </div>
                        <div>
                          <h1 className="text-lg font-semibold text-secondary-900 dark:text-black m-0">Legal Documentation</h1>
                          <p className="m-0 text-xs text-black">Terms, conditions and policies</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="w-[362px] cursor-pointer">
                    <Card pt={{ 
                        root: { className: 'p-4 border border-gray-200 h-[120px] rounded-2xl bg-base-bg w-full shadow-none'},
                        body: { className: 'p-0' },
                        content: { className: 'p-0 m-0' } }}>
                      <div>
                        <div>
                          <span className="material-symbols-rounded text-[#704F01] font-normal"> edit_notifications </span>
                        </div>
                        <div>
                          <h1 className="text-lg font-semibold text-secondary-900 dark:text-black m-0">Occasions</h1>
                          <p className="m-0 text-xs text-black">Manage notification content sent on occasions</p>
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

export default ContentPage;
