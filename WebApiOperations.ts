import { IInputs } from "../generated/ManifestTypes";

interface EntityRef {
    entityType: string;
    id: string;
}
/**
 * ExecuteRequest for Associate.
 */
export interface AssociateExecuteRequest {
  getMetadata: () => {
    boundParameter: null;
    parameterTypes: Record<string, never>;
    operationType: 2;
    operationName: "Associate";
  };
    target: EntityRef;
    relatedEntities: EntityRef[];
  relationship: string;
}

/**
 * ExecuteRequest for Disassociate.
 */
export interface DisassociateExecuteRequest {
  getMetadata: () => {
    boundParameter: null;
    parameterTypes: Record<string, never>;
    operationType: 2;
    operationName: "Disassociate";
  };
  target: EntityRef;
  relatedEntityId: string;
  relationship: string;
}

interface AssociationParams {
  context: ComponentFramework.Context<IInputs>;
  parent: { entityType: string; id: string };
  child: { entityType: string; id: string }; // logical name + id
  relationship: string;
}

/**
 * Associate one child record to a parent.
 */
export async function associateRecord({
  context,
  parent,
  child,
  relationship
}: AssociationParams): Promise<void> {
  const request: AssociateExecuteRequest = {
    getMetadata: () => ({
      boundParameter: null,
      parameterTypes: {},
      operationType: 2,
      operationName: "Associate"
    }),
    target: {
      entityType: parent.entityType,
      id: parent.id
    },
    relatedEntities: [
      {
        id: child.id,
        entityType: child.entityType
      }
    ],
    relationship
  };

  await context.webAPI.execute(request);
}

/**
 * Disassociate one child record from a parent.
 */
export async function dissociateRecord({
  context,
  parent,
  child,
  relationship
}: AssociationParams): Promise<void> {
  const request: DisassociateExecuteRequest = {
    getMetadata: () => ({
      boundParameter: null,
      parameterTypes: {},
      operationType: 2,
      operationName: "Disassociate"
    }),
    target: {
      entityType: parent.entityType,
      id: parent.id
    },
    relatedEntityId: child.id, 
    relationship
  };

  await context.webAPI.execute(request);
}


