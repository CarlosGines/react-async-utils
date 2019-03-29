import React, { ReactNode, ReactElement } from 'react';
import {
  cleanup,
  fireEvent,
  render as testingRender,
  wait,
} from 'react-testing-library';
import { render as asyncRender } from '../render';
import { Async } from '../types';
import { useAsyncData, UseAsyncDataOptions } from './useAsyncData';

afterEach(cleanup);

interface Props<Payload> {
  getData: (singal?: AbortSignal) => Promise<Payload>;
  options?: UseAsyncDataOptions<Payload>;
  children: (
    asyncData: Async<Payload>,
    refreshData: () => void,
    resetData: () => void,
  ) => ReactNode;
}

function UseAsyncDataComponent<Payload>({
  getData,
  options,
  children,
}: Props<Payload>): ReactElement {
  return <>{children(...useAsyncData(getData, options))}</>;
}

function getAbortablePromise<Payload>({
  resolveWith,
  rejectWith,
  signal,
  onAbortCallback,
}: {
  resolveWith?: Payload;
  rejectWith?: Error;
  signal: AbortSignal | undefined;
  onAbortCallback: () => void;
}): Promise<Payload> {
  if (signal && signal.aborted) {
    return Promise.reject(new DOMException('Aborted', 'AbortError'));
  }
  return new Promise((resolve, reject) => {
    signal &&
      signal.addEventListener('abort', () => {
        onAbortCallback && onAbortCallback();
        reject(new DOMException('Aborted', 'AbortError'));
      });
    resolveWith !== undefined && resolve(resolveWith);
    rejectWith !== undefined && reject(rejectWith);
  });
}

it('updates async data up to `SuccessAsync` state and invokes `onSuccess` callback', async () => {
  const IN_PROGRESS_TEXT = 'IN_PROGRESS_bonihzes';
  const SUCCESS_TEXT = 'SUCCESS_ukejemuo';
  const PAYLOAD = 'PAYLOAD_ezhihnoi';
  const onSuccessCallback = jest.fn();
  const { container } = testingRender(
    <UseAsyncDataComponent
      getData={() => Promise.resolve(PAYLOAD)}
      options={{ onSuccess: onSuccessCallback }}
    >
      {asyncData =>
        asyncRender(asyncData, {
          inProgress: () => IN_PROGRESS_TEXT,
          success: () => SUCCESS_TEXT,
        })
      }
    </UseAsyncDataComponent>,
  );
  expect(container).toHaveTextContent(IN_PROGRESS_TEXT);
  expect(onSuccessCallback).toHaveBeenCalledTimes(0);
  await wait();
  expect(container).toHaveTextContent(SUCCESS_TEXT);
  expect(onSuccessCallback).toHaveBeenCalledTimes(1);
  expect(onSuccessCallback).toHaveBeenCalledWith(PAYLOAD);
});

it('updates async data up to `ErrorAsync` state and invokes `onError` callback', async () => {
  const IN_PROGRESS_TEXT = 'IN_PROGRESS_tokunalf';
  const ERROR_TEXT = 'ERROR_vaowdenz';
  const ERROR = new Error();
  const onErrorCallback = jest.fn();
  const { container } = testingRender(
    <UseAsyncDataComponent
      getData={() => Promise.reject(ERROR)}
      options={{ onError: onErrorCallback }}
    >
      {asyncData =>
        asyncRender(asyncData, {
          inProgress: () => IN_PROGRESS_TEXT,
          error: () => ERROR_TEXT,
        })
      }
    </UseAsyncDataComponent>,
  );
  expect(container).toHaveTextContent(IN_PROGRESS_TEXT);
  expect(onErrorCallback).toHaveBeenCalledTimes(0);
  await wait();
  expect(container).toHaveTextContent(ERROR_TEXT);
  expect(onErrorCallback).toHaveBeenCalledTimes(1);
  expect(onErrorCallback).toHaveBeenCalledWith(ERROR);
});

it('does not update async data state if disabled', async () => {
  const TRIGGER_BUTTON_TEST_ID = 'gohsuzog';
  const INIT_TEXT = 'INIT_uddokbof';
  const { container, getByTestId } = testingRender(
    <UseAsyncDataComponent
      getData={() => Promise.resolve()}
      options={{ disabled: true }}
    >
      {(asyncData, triggerGetData) => (
        <>
          {asyncRender(asyncData, { init: () => INIT_TEXT })}
          <button
            onClick={triggerGetData}
            data-testid={TRIGGER_BUTTON_TEST_ID}
          />
        </>
      )}
    </UseAsyncDataComponent>,
  );
  expect(container).toHaveTextContent(INIT_TEXT);
  await wait();
  expect(container).toHaveTextContent(INIT_TEXT);
  fireEvent.click(getByTestId(TRIGGER_BUTTON_TEST_ID));
  expect(container).toHaveTextContent(INIT_TEXT);
});

it('stops updating async data after disabled', async () => {
  const INIT_TEXT = 'INIT_puzmesoj';
  const IN_PROGRESS_TEXT = 'IN_PROGRESS_wonillug';
  const children = function<Payload>(asyncData: Async<Payload>): ReactNode {
    return asyncRender(asyncData, {
      init: () => INIT_TEXT,
      inProgress: () => IN_PROGRESS_TEXT,
    });
  };
  const { container, rerender } = testingRender(
    <UseAsyncDataComponent getData={() => Promise.resolve()}>
      {children}
    </UseAsyncDataComponent>,
  );
  expect(container).toHaveTextContent(IN_PROGRESS_TEXT);
  rerender(
    <UseAsyncDataComponent
      getData={() => Promise.resolve()}
      options={{ disabled: true }}
    >
      {children}
    </UseAsyncDataComponent>,
  );
  expect(container).toHaveTextContent(INIT_TEXT);
});

it('updates async data to `InitAsync` and aborted `InitAsync` state and fires the `abort` event of the `AbortSignal` after being reset', async () => {
  const TRIGGER_BUTTON_TEST_ID = 'wivalcij';
  const RESET_BUTTON_TEST_ID = 'kusjiuck';
  const INIT_TEXT = 'INIT_ohihuwda';
  const ABORTED_TEXT = 'ABORTED_fisozkuc';
  const IN_PROGRESS_TEXT = 'IN_PROGRESS_bizkopoz';
  const SUCCESS_TEXT = 'SUCCESS_wukdaajo';
  const onAbortCallback = jest.fn();

  const { container, getByTestId } = testingRender(
    <UseAsyncDataComponent
      getData={signal =>
        getAbortablePromise({ resolveWith: {}, signal, onAbortCallback })
      }
    >
      {(asyncData, triggerGetData, resetAsyncData) => (
        <>
          <button
            onClick={triggerGetData}
            data-testid={TRIGGER_BUTTON_TEST_ID}
          />
          <button onClick={resetAsyncData} data-testid={RESET_BUTTON_TEST_ID} />
          {asyncRender(asyncData, {
            init: aborted => (aborted ? ABORTED_TEXT : INIT_TEXT),
            inProgress: () => IN_PROGRESS_TEXT,
            success: () => SUCCESS_TEXT,
          })}
        </>
      )}
    </UseAsyncDataComponent>,
  );
  expect(container).toHaveTextContent(IN_PROGRESS_TEXT);
  await wait();
  expect(container).toHaveTextContent(SUCCESS_TEXT);
  expect(onAbortCallback).toHaveBeenCalledTimes(0);
  fireEvent.click(getByTestId(RESET_BUTTON_TEST_ID));
  expect(container).toHaveTextContent(INIT_TEXT);
  expect(onAbortCallback).toHaveBeenCalledTimes(1);
  fireEvent.click(getByTestId(TRIGGER_BUTTON_TEST_ID));
  expect(container).toHaveTextContent(IN_PROGRESS_TEXT);
  fireEvent.click(getByTestId(RESET_BUTTON_TEST_ID));
  expect(container).toHaveTextContent(ABORTED_TEXT);
  expect(onAbortCallback).toHaveBeenCalledTimes(2);
});

it('prevents racing conditions', async () => {
  const TRIGGER_BUTTON_TEST_ID = 'esusodba';
  const onSuccessCallback = jest.fn();
  const onAbortCallback = jest.fn();
  let counter = 1;
  const { getByTestId } = testingRender(
    <UseAsyncDataComponent
      getData={signal => {
        const payload = counter;
        counter++;
        return getAbortablePromise({
          resolveWith: payload,
          signal,
          onAbortCallback,
        });
      }}
      options={{ onSuccess: onSuccessCallback }}
    >
      {(asyncData, triggerAsycTask) => (
        <button
          onClick={triggerAsycTask}
          data-testid={TRIGGER_BUTTON_TEST_ID}
        />
      )}
    </UseAsyncDataComponent>,
  );
  expect(onAbortCallback).toHaveBeenCalledTimes(0);
  fireEvent.click(getByTestId(TRIGGER_BUTTON_TEST_ID));
  expect(onAbortCallback).toHaveBeenCalledTimes(1);
  expect(onSuccessCallback).toHaveBeenCalledTimes(0);
  await wait();
  expect(onSuccessCallback).toHaveBeenCalledTimes(1);
  expect(onSuccessCallback).toHaveBeenCalledWith(2);
});

it('updates `SuccessAsync` data to invalidated `SuccessAsync` state after being re-triggered as an effect', async () => {
  const INIT_TEXT = 'INIT_vocucluh';
  const IN_PROGRESS_TEXT = 'IN_PROGRESS_hiepurer';
  const PAYLOAD_1 = 'PAYLOAD_1_reuwagge';
  const PAYLOAD_2 = 'PAYLOAD_2_zawejobr';
  const INVALIDATED_TEXT = 'INVALIDATED_zaluwobu';
  const children = function<Payload>(asyncData: Async<Payload>): ReactNode {
    return asyncRender(asyncData, {
      init: () => INIT_TEXT,
      inProgress: () => IN_PROGRESS_TEXT,
      success: (payload, invalidated) =>
        invalidated ? INVALIDATED_TEXT : payload,
    });
  };
  const { container, rerender } = testingRender(
    <UseAsyncDataComponent getData={() => Promise.resolve(PAYLOAD_1)}>
      {children}
    </UseAsyncDataComponent>,
  );
  expect(container).toHaveTextContent(IN_PROGRESS_TEXT);
  await wait();
  expect(container).toHaveTextContent(PAYLOAD_1);
  rerender(
    <UseAsyncDataComponent getData={() => Promise.resolve(PAYLOAD_2)}>
      {children}
    </UseAsyncDataComponent>,
  );
  expect(container).toHaveTextContent(INVALIDATED_TEXT);
  await wait();
  expect(container).toHaveTextContent(PAYLOAD_2);
});