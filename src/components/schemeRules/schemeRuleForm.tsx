import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { useEffect, useRef, useState } from "react";
import { Tag } from "primereact/tag";
import { PrimeReactIcon } from "..";
import { InputTextarea } from "primereact/inputtextarea";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import { schemeRulesService } from "@/api/services/schemeRules.service";

export function SchemeRuleForm({ modalType, visible, onHide, scheme, onSave }: { modalType: string, visible: boolean, onHide: () => void, scheme?: any, onSave: (schemeRuleData: any) => void }) {
    const [isPreview, setIsPreview] = useState(false);
    const [deleteconfirmModalOpen, setDeleteconfirmModalOpen] = useState(false);
    const [schemeCode, setSchemeCode] = useState(scheme?.schemeCode);
    const [schemeName, setSchemeName] = useState(scheme?.schemeName);
    const [schemeDescription, setSchemeDescription] = useState(scheme?.schemeDescription);
    const [minAmountToDeposit, setMinAmountToDeposit] = useState(scheme?.minAmountToDeposit);
    const [minAmountToDepositForGiftEligibility, setMinAmountToDepositForGiftEligibility] = useState(scheme?.minAmountToDepositForGiftEligibility);
    const [duration, setDuration] = useState(scheme?.duration);
    const [extentionDays, setExtentionDays] = useState(scheme?.extentionDays);
    const [schemeImages, setSchemeImages] = useState(scheme?.schemeImages);
    const [destination, setDestination] = useState(scheme?.destination ?? 'Schemes');
    const [schemeStatus, setSchemeStatus] = useState(scheme?.schemeStatus ?? 'active');
    const [enteredSchemeNameForDelete, setEnteredSchemeNameForDelete] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const toast = useRef<Toast>(null);


    const schemeRuleData = {
        id: scheme?.id,
        schemeCode: schemeCode,
        schemeName: schemeName,
        schemeDescription: schemeDescription,
        minAmountToDeposit: String(minAmountToDeposit),
        minAmountToDepositForGiftEligibility: String(minAmountToDepositForGiftEligibility),
        duration: String(duration),
        extentionDays: extentionDays,
        schemeImages: schemeImages,
        destination: destination,
        schemeStatus: schemeStatus
    }
    // console.log("schemeRuleData:", schemeRuleData);

    const onClickPreview = () => {
        setIsPreview(true);
        // console.log('preview');
    }

    useEffect(() => {
        if (modalType === 'new') {
            setSchemeCode('');
            setSchemeName('');
            setSchemeDescription('');
            setMinAmountToDeposit('');
            setMinAmountToDepositForGiftEligibility('');
            setDuration('');
            setExtentionDays('');
            setSchemeImages([]);
            setDestination('Schemes');
            setSchemeStatus('active' as const);

            return;
        } else {        
            if(!scheme) {
                return;
            }
            // console.log("scheme in useEffect:", scheme);
            setSchemeCode(scheme?.schemeCode);
            setSchemeName(scheme?.schemeName);
            setSchemeDescription(scheme?.schemeDescription);
            setMinAmountToDeposit(scheme?.minAmountToDeposit);
            setMinAmountToDepositForGiftEligibility(scheme?.minAmountToDepositForGiftEligibility);
            setDuration(scheme?.duration);
            setExtentionDays(scheme?.extentionDays);
            setSchemeImages(scheme?.schemeImages);
            setDestination(scheme?.destination);
            setSchemeStatus(scheme?.schemeStatus as 'active' | 'inactive');
        }
    }, [modalType, scheme]);

    const onDeleteAccept = (id: string, actualName: string, enteredName: string) => {
        if(enteredName !== actualName) {
            setDeleteError('Scheme name does not match');
            return;
        }
        if(enteredName === actualName) {
            schemeRulesService.deleteSchemeRule(id).then((res: any) => {
                if(res) {
                    toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Scheme deleted successfully', life: 3000 });
                    onHide();
                    setDeleteconfirmModalOpen(false);
                }
            });
        }
    }

    const onDeleteClick = () => {
        setEnteredSchemeNameForDelete('');
        setDeleteconfirmModalOpen(true);
    }

    const onDeleteModalClose = () => {
        setDeleteconfirmModalOpen(false);
        setEnteredSchemeNameForDelete('');
    }

    const previewHeaderTemplateContent = (
        <div className="flex justify-start gap-2 items-center">
            <h3 className="text-lg font-bold text-secondary-900 dark:text-white m-0">Preview</h3>
            { modalType !== 'new' && (
                <Tag value={schemeRuleData.schemeStatus ?? ''} severity={schemeRuleData.schemeStatus === 'active' ? 'success' : 'danger'} className="text-sm px-3 py-1 rounded-lg bg-[#E5FFEA] border border-[#00A91C] text-[#00A91C] flex justify-around items-center" />
            )}
        </div>
    )

    const mainFooterTemplateContent = (
        <>
        {
            modalType === 'new' && (
                <div className="flex gap-4 items-center justify-end p-4 border-t border-gray-200 dark:border-[#424b57]">
                <div>
                    <Button
                        pt={{
                            root: { className: 'px-3 py-2 border-none rounded-lg gap-1 bg-[#555555] w-full m-0 gap-1'}
                        }}
                        onClick={onClickPreview}
                    >
                        <span className="material-symbols-rounded text-white text-base font-normal">
                            visibility
                        </span>
                        <span className="text-sm font-medium text-white">Preview</span>
                    </Button>
                </div>
                <div>
                    <Button
                        pt={{
                            root: { className: 'px-3 py-2 border-none rounded-lg gap-1 bg-[#704f01] w-full m-0 gap-1'}
                        }}
                        onClick={() => { 
                            onSave(schemeRuleData);
                            onHide();
                            setIsPreview(false);
                        }}
                    >
                        <span className="material-symbols-rounded text-white text-base font-normal">
                            check
                        </span>
                        <span className="text-sm font-medium text-white">Done</span>
                    </Button>
                </div>
            </div>
            )
        }
        {
            modalType === 'edit' && (
                <div className="flex gap-4 items-center justify-between p-4 border-t border-gray-200 dark:border-[#424b57]">
                    <div>
                        <Button text 
                            severity="danger"
                            pt={{
                                root: { className: 'p-0' }
                            }}
                            onClick={onDeleteClick}
                        >
                            <span className="material-symbols-rounded"> delete </span>
                        </Button>
                    </div>
                    <div className="flex gap-4 items-center justify-end">
                        <div>
                            <Button
                                pt={{
                                    root: { className: 'px-3 py-2 border-none rounded-lg gap-1 bg-[#555555] w-full m-0 gap-1'}
                                }}
                                onClick={onClickPreview}
                            >
                                <span className="material-symbols-rounded text-white text-base font-normal">
                                    visibility
                                </span>
                                <span className="text-sm font-medium text-white">Preview</span>
                            </Button>
                        </div>
                        <div>
                            <Button
                                pt={{
                                    root: { className: 'px-3 py-2 border-none rounded-lg gap-1 bg-[#704f01] w-full m-0 gap-1'}
                                }}
                                onClick={() => { 
                                    onSave(schemeRuleData);
                                    onHide();
                                    setIsPreview(false);
                                }}
                            >
                                <span className="material-symbols-rounded text-white text-base font-normal">
                                    check
                                </span>
                                <span className="text-sm font-medium text-white">Done</span>
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }
        </>

    ) 
    return (
        <>
            <div>
                <Dialog 
                onHide={() => {
                    setIsPreview(false);
                    onHide();
                }} 
                visible={visible && !isPreview}
                header={modalType === 'new' ? 'New Scheme Rule' : 'Edit Scheme Rule'}
                footer= {mainFooterTemplateContent}
                pt={{
                    root: { className: 'w-[720px]'},
                    header: { className: 'text-lg font-bold text-secondary-900 dark:text-white border-b border-gray-200 dark:border-[#424b57] py-4 px-4'},
                    content: { className: 'py-4 px-5'},
                    footer: { className: 'p-0'}
                }}>
                    <div className="grid gap-4">
                        <div className="flex gap-2 w-full">
                            <div className="grid gap-2 w-1/2">
                                <label className="block text-sm font-medium text-secondary-900 dark:text-white m-0">
                                    Scheme Code *
                                </label>
                                <InputText type="text" placeholder="Scheme Code" value={schemeCode} onChange={(e) => setSchemeCode(e.target.value)} />
                            </div>
                            <div className="grid gap-2 w-1/2">
                                <label className="block text-sm font-medium text-secondary-900 dark:text-white m-0">
                                    Scheme Name *
                                </label>
                                <InputText type="text" placeholder="Scheme Name" value={schemeName} onChange={(e) => setSchemeName(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                        <label className="block text-sm font-medium text-secondary-900 dark:text-white m-0">
                            Destination *
                        </label>
                        <div>
                            <Tag value="Schemes" severity="info" className="text-sm px-3 py-1 rounded-lg bg-[#f2debe] text-[#675122]" />
                        </div>
                        </div>
                        <div className="flex gap-2 w-full">
                            <div className="grid gap-2 w-1/2">
                                <label className="block text-sm font-medium text-secondary-900 dark:text-white m-0">
                                    Min.Amount to Deposit *
                                </label>
                                <InputNumber mode="currency" currency="INR" placeholder="Min.Amount to Deposit" value={minAmountToDeposit} onValueChange={(e: any) => setMinAmountToDeposit(e.value)} />
                            </div>
                            <div className="grid gap-2 w-1/2">
                                <label className="block text-sm font-medium text-secondary-900 dark:text-white m-0">
                                    Min.Amount to Deposit for Gift Eligibility *
                                </label>
                                <InputNumber mode="currency" currency="INR" placeholder="Min.Amount to Get Gift" value={minAmountToDepositForGiftEligibility} onValueChange={(e: any) => setMinAmountToDepositForGiftEligibility(e.value)} />
                            </div>
                        </div>
                        <div className="flex gap-2 w-full">
                            <div className="grid gap-2 w-1/2">
                                <label className="block text-sm font-medium text-secondary-900 dark:text-white m-0">
                                    Tenure(in Months) *
                                </label>
                                <InputNumber 
                                    placeholder="1"
                                    value={duration || 0}
                                    min={1}
                                    showButtons={true}
                                    buttonLayout="horizontal"
                                    inputClassName="text-center w-[64px]! h-[40px]!"
                                    incrementButtonIcon={<PrimeReactIcon name="add" size={20} />}
                                    decrementButtonIcon={<PrimeReactIcon name="remove" size={20} />}
                                    pt={{
                                        root: { className: 'w-[128px] h-[40px] border-[#cccccc] rounded-lg'},
                                        incrementButton: { className: 'bg-[#f2f2f2] text-[#675122] border-[#CCC] w-[32px]! h-[40px]! dark:bg-[#111827] dark:text-white dark:border-[#424b57]'},
                                        decrementButton: { className: 'bg-[#f2f2f2] text-[#675122] border-[#CCC] w-[32px]! h-[40px]! dark:bg-[#111827] dark:text-white dark:border-[#424b57]'},
                                    }}
                                    onValueChange={(e) => setDuration(String(e.value))}
                                />
                            </div>
                            <div className="grid gap-2 w-1/2">
                                <label className="block text-sm font-medium text-secondary-900 dark:text-white m-0">
                                    Default Grace Period (in Days) *
                                </label>
                                <InputNumber 
                                    placeholder="1"
                                    value={extentionDays || 0}
                                    min={0}
                                    showButtons={true}
                                    buttonLayout="horizontal"
                                    inputClassName="text-center w-[64px]! h-[40px]!"
                                    incrementButtonIcon={<PrimeReactIcon name="add" size={20} />}
                                    decrementButtonIcon={<PrimeReactIcon name="remove" size={20} />}
                                    pt={{
                                        root: { className: 'w-[128px] h-[40px] border-[#cccccc] rounded-lg'},
                                        incrementButton: { className: 'bg-[#f2f2f2] text-[#675122] border-[#CCC] w-[32px]! h-[40px]! dark:bg-[#111827] dark:text-white dark:border-[#424b57]'},
                                        decrementButton: { className: 'bg-[#f2f2f2] text-[#675122] border-[#CCC] w-[32px]! h-[40px]! dark:bg-[#111827] dark:text-white dark:border-[#424b57]'},
                                    }}
                                    onValueChange={(e) => setExtentionDays(e.value)}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <label className="block text-sm font-medium text-secondary-900 dark:text-white m-0">Scheme Rules *</label>
                            <div>
                                <InputTextarea placeholder="Scheme Description" value={schemeDescription} rows={4} className="w-full" onChange={(e) => setSchemeDescription(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
            {
                isPreview  && (
                    <Dialog
                        visible={visible && isPreview}
                        onHide={() => setIsPreview(false)}
                        header={previewHeaderTemplateContent}
                        pt={{
                            root: { className: 'w-[480px] h-[720px]'},
                            header: { className: 'text-lg font-bold text-secondary-900 dark:text-white border-b border-gray-200 dark:border-[#424b57] py-4 px-4'},
                            content: { className: 'py-4 px-5'},
                            footer: { className: 'p-0'}
                        }}
                    >
                        <div className="grid gap-2 w-full">
                            <div>
                                <Tag value={`Content / Scheme Rules / ${schemeRuleData.schemeName}`} severity="info" className="text-sm px-3 py-1 rounded-lg bg-[#f2debe] text-[#675122]" />
                            </div>
                            <h3 className="text-3xl font-bold text-secondary-900 dark:text-white m-0">{schemeRuleData.schemeName ?? '-'}</h3>
                            <div className="grid gap-[6px]">
                                <h5 className="text-base font-bold text-gray-500 dark:text-white m-0">Scheme Rules:</h5>
                                {/* <ul className="list-disc list-inside">
                                    <li>Minimum Deposit Amount: {schemeRuleData.minAmountToDeposit ?? '-'}</li>
                                    <li>Minimum Deposit Amount for Gift Eligibility: {schemeRuleData.minAmountToDepositForGiftEligibility ?? '-'}</li>
                                    <li>Tenure: {schemeRuleData.duration ?? '-'} months</li>
                                    <li>Default Grace Period: {schemeRuleData.extentionDays ?? '-'} days</li>
                                    <li>Scheme Description: {schemeRuleData.schemeDescription ?? '-'}</li>
                                </ul> */}
                                <p className="text-sm font-medium text-secondary-900 dark:text-white m-0">{schemeRuleData.schemeDescription ?? '-'}</p>
                            </div>
                        </div>
                    </Dialog>
                )
            }
            {deleteconfirmModalOpen && (
                <Dialog
                    header="Delete Scheme"
                    visible={deleteconfirmModalOpen}
                    onHide={onDeleteModalClose}
                    footer={
                        <div className="flex justify-between items-center p-4 border-t border-gray-200 dark:border-[#424b57] h-[70px]">
                            <div>
                                <Button
                                    label="Delete"
                                    severity="danger"
                                    onClick={() => onDeleteAccept(schemeRuleData.id, schemeRuleData.schemeName, enteredSchemeNameForDelete)}
                                    pt={{
                                        root: { className: 'px-3 py-2 border-none rounded-lg gap-1 bg-[#FFE5E5] text-[#A90000] w-full m-0 gap-1 w-[72px] h-[38px]' }
                                    }}
                                />
                            </div>
                            <div>
                                <Button
                                    onClick={onDeleteModalClose}
                                    pt={{
                                        root: { className: 'px-3 py-2 border-none rounded-lg gap-1 bg-[#675122] w-full m-0 gap-1 w-[135px] h-[38px]' }
                                    }}
                                >
                                    <span className="material-symbols-rounded text-white text-base font-normal"> close </span>
                                    <span className="text-sm font-medium text-white">Don't Delete</span>
                                </Button>
                            </div>
                        </div>
                    }
                    pt={{
                        root: { className: 'w-[640px]' },
                        header: { className: 'text-lg font-bold text-secondary-900 dark:text-white border-b border-gray-200 dark:border-[#424b57] py-4 px-4' },
                        content: { className: 'p-4' },
                        footer: { className: 'p-0' }
                    }}
                >
                    <div className="grid gap-2">
                        <p className="m-0 text-sm font-medium text-[#545455] dark:text-white">
                            Are you sure you want to inactive the scheme <b>"{schemeRuleData.schemeName}"</b>? By deactivating, your future users will not be able to see this scheme in their mobile app.
                            However, your current users will still be continuing with the scheme and retain its benefits until all their dues are over and till they redeem.
                            <br />
                            This action can be reversed by toggling on the scheme under the 'Inactive' tab.
                        </p>
                        <div className="grid gap-[8px]">
                            <label className="block text-sm font-medium text-secondary-900 dark:text-white m-0">Enter Scheme Name</label>
                            <div className="flex flex-wrap items-center gap-2">
                                <InputText
                                    type="text"
                                    placeholder="Enter Scheme Name"
                                    value={enteredSchemeNameForDelete}
                                    onChange={(e) => setEnteredSchemeNameForDelete(e.target.value)}
                                    pt={{
                                        root: { className: 'w-[50%]' }
                                    }}
                                />

                                {deleteError && (
                                    <Message 
                                        severity="error"
                                        text={deleteError}
                                        pt={{
                                            root: { className: 'p-2 w-fit justify-start'},
                                            text: { className: 'text-[12px]'},
                                            icon: { className: 'w-[16px] h-[16px]'},
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </Dialog>
            )}
        </>
    );
}

export default SchemeRuleForm;