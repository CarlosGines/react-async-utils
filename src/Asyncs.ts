export enum Progress {
  Init,
  InProgress,
  Success,
  Error,
}

class BaseAsnyc<Payload = {}> {
  protected progress: unknown;
  public isInit(): this is InitAsync {
    return this.progress === Progress.Init;
  }
  public isInProgress(): this is InProgressAsync {
    return this.progress === Progress.InProgress;
  }
  public isSuccess(): this is SuccessAsync<Payload> {
    return this.progress === Progress.Success;
  }
  public isError(): this is ErrorAsync {
    return this.progress === Progress.Error;
  }
  public isInProgressOrInvalidated(): this is
    | InProgressAsync
    | SuccessAsync<Payload> {
    return this.isInProgress() || (this.isSuccess() && !!this.invalidated);
  }
  public isAborted(): this is InitAsync {
    return this.isInit() && !!this.aborted;
  }
  public getError(): Error | undefined {
    return this.isError() ? this.error : undefined;
  }
}

export class InitAsync extends BaseAsnyc {
  public progress: Progress.Init;
  public aborted?: boolean;

  public constructor(aborted?: boolean) {
    super();
    this.progress = Progress.Init;
    this.aborted = aborted;
  }

  public getPayload(): undefined {
    return undefined;
  }
}

export class InProgressAsync extends BaseAsnyc {
  public progress: Progress.InProgress;

  public constructor() {
    super();
    this.progress = Progress.InProgress;
  }

  public getPayload(): undefined {
    return undefined;
  }
}

export class SuccessAsync<Payload> extends BaseAsnyc<Payload> {
  public progress: Progress.Success;
  public payload: Payload;
  public invalidated?: boolean;

  public constructor(payload: Payload, invalidated?: boolean) {
    super();
    this.progress = Progress.Success;
    this.payload = payload;
    this.invalidated = invalidated;
  }

  public getPayload(): Payload {
    return this.payload;
  }
}

export class ErrorAsync extends BaseAsnyc {
  public progress: Progress.Error;
  public error: Error;

  public constructor(error: Error) {
    super();
    this.progress = Progress.Error;
    this.error = error;
  }

  public getPayload(): undefined {
    return undefined;
  }
}

export type Async<Payload> =
  | InitAsync
  | InProgressAsync
  | SuccessAsync<Payload>
  | ErrorAsync;
