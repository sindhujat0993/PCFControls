import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { OneToManyRelationshipMetadata, MultiSelectLookup, IMultiSelectLookupProps, ChipItem } from "./MultiSelectLookup";
import * as React from "react";
import { associateRecord, dissociateRecord, updateLookupReferenceAndShortName } from "./Components/WebApiOperations";
import { normalizeGuid  } from "./Helper/GUID-Utils"
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;
export class MultiSelectControl implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private context: ComponentFramework.Context<IInputs>;
    
    constructor() {
        // Empty
    }

   
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.context = context;
        this.notifyOutputChanged = notifyOutputChanged;
    }


    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        this.context = context;
        const dataset = context.parameters.relatedRecordsDataset;
        const imageURL: string = context.parameters.controlImageURl?.raw ?? "";
        const label: string | null = context.parameters.labelText?.raw;
        const chipItemWidth: string = context.parameters.chipWidth?.raw ?? "150px";

        const chipItems: ChipItem[] = [];
        if (dataset?.records) {
            const records = dataset.records
            const primaryCol = dataset.columns.find((c: ComponentFramework.PropertyHelper.DataSetApi.Column) => {
                return (c as unknown as { isPrimary?: boolean }).isPrimary === true;
            });
            const primaryFieldName = primaryCol?.name;
            for (const recordId in records) {
                const record = records[recordId];
                let name = "";
                if (primaryFieldName) {
                    name = record.getFormattedValue(primaryFieldName);
                }
                chipItems.push({
                    id: record.getRecordId(),     
                    name, 
                    image: imageURL
                });
            }
        }
        const extendedContext = context as unknown as ComponentFramework.ExtendedContext<IInputs>;
        const parentEntityName = extendedContext.page?.entityTypeName;
        const parentId = extendedContext.page?.entityId;
        const relatedEntityName = dataset.getTargetEntityType?.();

        const extendedDataset = dataset as unknown as ComponentFramework.PropertyHelper.DataSetApi.ExtendedDataSet;
        const relationshipInput: string | null = context.parameters.relationshipName.raw;
        const relationshipName: string = extendedDataset.relationship?.name ?? relationshipInput ?? "";

        const removeAssociation = async (id: string | number) => {
            const record = dataset.records[id as string];
            if (record && parentEntityName && parentId && relationshipName && relatedEntityName) {
                try {
                    await dissociateRecord({
                      context,
                        parent: { entityType: parentEntityName, id: normalizeGuid(parentId) },
                        child: { entityType: relatedEntityName, id: normalizeGuid(record.getRecordId()) },
                      relationship: relationshipName
                    });
                    dataset.refresh();
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        console.error("Error dissociating record:", error.message);
                    } else {
                        console.error("Error dissociating record:", error);
                    }
                }
            }
        };

        const openLookupDialog = async (): Promise<void> => {
            if (!parentEntityName || !parentId || !relationshipName || !relatedEntityName) {
                console.warn("Missing required values for association");
                return;
            }

            try {
                const selected = await context.utils.lookupObjects({
                    allowMultiSelect: true,
                    defaultEntityType: relatedEntityName,
                    entityTypes: [relatedEntityName]
                });

                if (!selected || selected.length === 0) {
                    return;
                }

                // Check relationship is 1:N or N:N and call function accordingly
                const metadata = await context.utils.getEntityMetadata(parentEntityName, []);
                for (const sel of selected) {
                    const parentRef = { entityType: parentEntityName, id: normalizeGuid(parentId) };
                    const childRef = { entityType: sel.entityType, id: normalizeGuid(sel.id) };
                        await associateRecord({
                            context,
                            parent: parentRef,
                            child: childRef,
                            relationship: relationshipName
                        });
                }
                if (dataset) {
                    dataset.refresh();
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error("Error in lookup association:", error.message);
                } else {
                    console.error("Error in lookup association:", error);
                }
            }
        };

        const openRecord = async (id: string | number) => {
            const record = dataset.records[id as string];
            if (!record) return;

            try {
                await context.navigation.openForm({
                    entityName: dataset.getTargetEntityType(),
                    entityId: record.getRecordId()
                });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error("Error opening record:", error.message);
                } else {
                    console.error("Error opening record:", error);
                }
            }
        };

        const props: IMultiSelectLookupProps = {
            items: chipItems,
            labelText: label,
            chipItemWidth: chipItemWidth,
            onRemoveItem: (id) => { void removeAssociation(id); },
            onSearch: () => { void openLookupDialog(); },
            onChipClick: (id) => { void openRecord(id); }
        };
        return React.createElement(
            MultiSelectLookup, props
        );
    }

    
    public getOutputs(): IOutputs {
        return {};
    }


    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
