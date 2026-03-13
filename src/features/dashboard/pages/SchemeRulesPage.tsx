import { Button } from "primereact/button";
import { SelectButton } from "primereact/selectbutton";
import { InputText } from "primereact/inputtext";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import type { schemeRule, SchemeRuleRequest } from "@/types/schemeRules.types";
import { InputSwitch, type InputSwitchChangeEvent } from "primereact/inputswitch";
import { formatDate, formatDateTime } from "@/utils/format";
import { schemeRulesService } from "@/api/services/schemeRules.service";
import SchemeRuleForm from "@/components/schemeRules/schemeRuleForm";
import { useUser } from "@/store/authStore";

function extractProductList(response: unknown): unknown[] {
  const data = (response as { items?: any })?.items;
  if (!data) return [];
  const raw =
    (data as { data?: unknown[] })?.data ??
    (data as { items?: unknown[] })?.items ??
    (Array.isArray(data) ? data : []);
  // console.log("raw:", raw);
  return Array.isArray(raw) ? raw : [];
}

function mapBackendResponseToSchemeRule(s: any) {
  const schemeRule: any = {
    id: s.id,
    schemeName: s.scheme_name,
    schemeCode: s.scheme_code,
    schemeDescription: s.scheme_description,
    schemeStatus: s.scheme_status === 1 ? 'active' : 'inactive',
    duration: s.scheme_duration,
    minAmountToDeposit: Number(s.min_deposit_amount),
    schemeImages: s.scheme_images ?? [],
    destination: s.destination,
    minAmountToDepositForGiftEligibility: Number(s.gift_eligible_min_amount),
    extentionDays: s.grace_period,
    createdBy: s.created_by,
    updatedBy: s.updated_by,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }
  return schemeRule;
}

export function SchemeRulesPage() {
  const [tabValue, setTabValue] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>('new');
  const [schemes, setSchemes] = useState<schemeRule[]>([]);
  const [schemeData, setSchemeData] = useState<any>(null);
  const user = useUser();
  const toast = useRef<Toast>(null);

  const MOCK_DATA: schemeRule[] = [
    {
      id: 0,
      schemeCode: 'GS001',
      schemeName: 'Golden 11',
      schemeDescription: 'Golden 11 is a scheme that allows you to invest in gold and get a gift',
      schemeImages: [],
      schemeStatus: 'active',
      destination: 'Schemes',
      duration: 11,
      extentionDays: 10,
      minDepositAmount: '1000',
      maxDepositAmountForGift: '1000',
      createdBy: 'John Doe',
      updatedBy: 'John Doe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 1,
      schemeCode: 'GS002',
      schemeName: 'Golden 11 Flexi',
      schemeDescription: 'Golden 11 Flexi is a scheme that allows you to invest in gold and get a gift',
      schemeImages: [],
      schemeStatus: 'inactive',
      destination: 'Schemes',
      duration: 11,
      extentionDays: 10,
      minDepositAmount: '1000',
      maxDepositAmountForGift: '1000',
      createdBy: 'John Doe',
      updatedBy: 'John Doe',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const getAllSchemeRules = () => {
    schemeRulesService.getAllSchemeRules().then((res) => {
      if (res) {
        const responseData = res.data;
        const list = extractProductList(responseData);
        const items = list.map((item: any) => mapBackendResponseToSchemeRule(item));
        // console.log("items:", items);
        setSchemes(items);
        // console.log("items:", items);
        if(items.length === 0) {
          setSchemes(MOCK_DATA);
        }
      }
    });
  }

  useEffect(() => {
    getAllSchemeRules();
  }, []);

  const onToggleSchemeStatus = (id: string, schemeStatus: boolean) => {
    // console.log("id:", id);
    // console.log("schemeStatus:", schemeStatus);
    const statusValue = schemeStatus === true ? 'active' : 'inactive';
    schemeRulesService.updateSchemeStatus(id, { scheme_status: statusValue }).then((res) => {
      if(res) {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Scheme status updated successfully', life: 3000 });
        getAllSchemeRules();
      }
    });
  }

  const schemeRulesTabOptionsWithCounts = useMemo(() => {
    const countAll = schemes.length;
    const countActive = schemes.filter((s) => s.schemeStatus === 'active').length;
    const countInactive = schemes.filter((s) => s.schemeStatus === 'inactive').length;
    return [
      { label: `All (${countAll})`, value: 0 },
      { label: `Active (${countActive})`, value: 1 },
      { label: `Inactive (${countInactive})`, value: 2 },
    ];
  }, [schemes]);

  const onModalOpen = (modalType: string, data?: schemeRule) => {
    if(data) {
      // console.log("data:", data);
      setSchemeData(data);
    }
    setModalOpen(true);
    setModalType(modalType);
  }

  const onModalClose = () => {
    setModalOpen(false);
  }

  const serialNumberBodyTemplate = (_rowData: schemeRule, options: { rowIndex?: number }): number => (options.rowIndex ?? 0) + 1;

  const onSave = (schemeRuleData: any) => {
    // console.log("schemeRuleData:", schemeRuleData);
    if(modalType === 'new') {
      const createSchemeRuleRequest = {
        id: crypto.randomUUID(),
        scheme_code: schemeRuleData.schemeCode,
        scheme_name: schemeRuleData.schemeName,
        scheme_description: schemeRuleData.schemeDescription,
        scheme_status: schemeRuleData.schemeStatus,
        destination: schemeRuleData.destination,
        scheme_duration: String(schemeRuleData.duration),
        grace_period: Number(schemeRuleData.extentionDays),
        min_deposit_amount: String(schemeRuleData.minAmountToDeposit),
        gift_eligible_min_amount: String(schemeRuleData.minAmountToDepositForGiftEligibility),
        created_by: user?.id,
      }
      // console.log("createSchemeRuleRequest:", createSchemeRuleRequest);
      schemeRulesService.createSchemeRule(createSchemeRuleRequest as SchemeRuleRequest).then((res) => {
        if (res) {
          toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Scheme rule created successfully', life: 3000 });
          getAllSchemeRules();
        }
      });
    }

    if (modalType === 'edit') {
      const updateSchemeRuleRequest = {
        scheme_code: schemeRuleData.schemeCode,
        scheme_name: schemeRuleData.schemeName,
        scheme_description: schemeRuleData.schemeDescription,
        scheme_status: schemeRuleData.schemeStatus,
        destination: schemeRuleData.destination,
        scheme_duration: String(schemeRuleData.duration),
        grace_period: Number(schemeRuleData.extentionDays),
        min_deposit_amount: String(schemeRuleData.minAmountToDeposit),
        gift_eligible_min_amount: String(schemeRuleData.minAmountToDepositForGiftEligibility),
        updated_by: user?.id,
      }
      // console.log("updateSchemeRuleRequest:", updateSchemeRuleRequest);
      // console.log("schemeRuleData?.id:", schemeRuleData?.id);
      schemeRulesService.updateSchemeRule(schemeRuleData?.id as string, updateSchemeRuleRequest as SchemeRuleRequest).then((res: any) => {
        if (res) {
          toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Scheme rule updated successfully', life: 3000 });
          getAllSchemeRules();
        }
      });
    }
  }

  return (
    <div className="body dark:body h-full">
      <Toast ref={toast} />
      <section className="page-header dark:page-header flex items-center justify-between py-2 px-3">
        <div className="flex items-center">
          <div>
            <Button
              text
              style={{height: '32px', width: '32px', alignItems: 'center', justifyContent: 'center' }}
              onClick={() => window.history.back()}
            >
              <span
                className="material-symbols-rounded text-[#704F01] dark:text-white font-light text-2xl"
              >
                chevron_left
              </span>
            </Button>
          </div>
          <div className="px-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-secondary-900 dark:text-white m-0">Scheme Rules</h1>
            </div>
            <p className="m-0 text-secondary-900 dark:text-white text-xs">App content / scheme Rules</p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button
            onClick={() => onModalOpen('new')}
            pt={{
              root: { className: 'px-3 py-2 border-none rounded-lg gap-1 bg-[#704f01]' }
            }}>
            <span
              className="material-symbols-rounded text-white"
              style={{ fontSize: '16px', fontWeight: '400' }}
            >
              add_circle
            </span>
            <p className="m-0 text-base text-white">New Scheme Rule</p>
          </Button>
        </div>
      </section>
      <section className="flex items-center justify-between px-4 py-3 h-19.5">
        <div className="text-[#545455]">
          <SelectButton
            value={tabValue}
            options={schemeRulesTabOptionsWithCounts}
            onChange={(e) => setTabValue(e.value)}
            optionLabel="label"
            optionValue="value"
            pt={{
              root: {
                className:
                  'p-2 bg-gray-100 rounded-full flex gap-1 border-none rounded-xl dark:bg-[#704f01]',
              },
              button: ({ context }: { context: { selected?: boolean } }) => ({
                className: `px-3 py-2 rounded-lg border-none transition-all duration-200 gap-1 focus:outline-none focus:ring-0 focus:shadow-none ${
                  context.selected
                    ? 'bg-[#404040] text-white font-bold shadow-sm dark:text-[#2e240f] dark:bg-white'
                    : 'bg-transparent text-gray-500 hover:bg-gray-200 dark:text-white dark:hover:bg-[#5a3e0c] dark:hover:text-white'
                }`,
              }),
              label: { className: 'p-0' },
            }}
          />
        </div>
        <div className="grid lg:flex items-center justify-center gap-4">
          <div>
            <Button text style={{ fontSize: '32px', padding: '0px' }}>
              <span
                className="material-symbols-rounded text-[#704F01] dark:text-white"
                style={{ fontSize: '28px', fontWeight: '400' }}
              >
                download
              </span>
            </Button>
          </div>
          <div>
            <Button text style={{ fontSize: '32px', padding: '0px' }}>
              <span
                className="material-symbols-rounded text-[#704F01] dark:text-white"
                style={{ fontSize: '28px', fontWeight: '400' }}
              >
                filter_alt
              </span>
            </Button>
          </div>
          <div className="flex items-center">
            <IconField iconPosition="left" pt={{ root: { className: 'border-lg' } }}>
              <InputIcon pt={{ root: { className: 'flex items-center top-2/5' } }}>
                <span className="material-symbols-rounded flex items-center justify-center"> search </span>
              </InputIcon>
              <InputText placeholder="Search" className="shadow-none focus:border-[#555555]" />
            </IconField>
          </div>
        </div>
      </section>
      <section>
        <DataTable
          value={schemes}
          style={{ overflow: 'auto' }}
          showGridlines={false}
          onRowClick={(e) => onModalOpen('edit', e.data as schemeRule)}
          rowHover
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 15, 20]}
          pt={{
            root: { className: 'datatable dark:datatable' },
            header: { className: 'p-datatable-thead dark:p-datatable-thead' },
          }}
        >
          <Column header="S.No" style={{ width: '3rem' }} body={serialNumberBodyTemplate} />
          <Column
            header="Scheme Name & Code"
            body={(rowData: schemeRule) => 
              <div className="grid">
                <h4 className="m-0">{rowData.schemeName}</h4> 
                <h6 className="m-0">{rowData.schemeCode}</h6>
              </div>
            }
          />
          <Column body={(rowData: schemeRule) => <div className="grid">
            <h4 className="m-0">{rowData.destination}</h4>
          </div>} header="Destination" />
          <Column 
            header="Created by & on" 
            body={(rowData: schemeRule) => <div className="grid">
              <h4 className="m-0">{rowData.createdBy}</h4> 
              <h6 className="m-0">{formatDateTime(rowData.createdAt)}</h6>
            </div>}
          />
          <Column
            header="Last Modified by & on"
            body={(rowData: schemeRule) => <div className="grid">
              <h4 className="m-0">{rowData.updatedBy}</h4> 
              <h6 className="m-0">{formatDateTime(rowData.updatedAt)}</h6>
            </div>}
          />
          <Column
            header="Actions"
            body= {
              (rowData: schemeRule) => (
                <div>
                  <InputSwitch 
                    checked={rowData.schemeStatus === 'active'}
                    onChange={(e: InputSwitchChangeEvent) => onToggleSchemeStatus(rowData.id as string, e.value)}
                    pt={{
                      slider: {
                        style: {
                          backgroundColor: rowData.schemeStatus === 'active' ? 'green' : '#555555',
                        },
                      },
                    }} 
                  />
                </div>
              )
            }
          />
        </DataTable>
      </section>
      {
      modalOpen && (
        <SchemeRuleForm modalType={modalType} visible={modalOpen} onHide={onModalClose} scheme={schemeData} onSave={onSave} />
        )
      }
    </div>
  );
}

export default SchemeRulesPage;