// typings/pcf-extensions.d.ts
declare namespace ComponentFramework {
    interface WebApi {
    /**
     * Executes a Web API request (e.g. custom actions, associate/dissociate).
     * @param request The request object with getMetadata().
     */
    execute(request: unknown): Promise<WebApiResponse>;
  }

  interface WebApiResponse {
    ok: boolean;
    json(): Promise<unknown>;
    text(): Promise<string>;
  }
    interface Page {
        entityTypeName: string;
        entityId: string;
    }

    // Extend Context to include page
    interface ExtendedContext<TInputs, TOutputs = unknown> extends Context<TInputs, TOutputs> {
        page?: Page;
    }

    namespace PropertyHelper.DataSetApi {
        interface ExtendedDataSet extends PropertyTypes.DataSet {
            relationship?: { name: string };
        }
    }
}


