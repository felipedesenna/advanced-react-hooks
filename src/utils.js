import React, { useCallback, useLayoutEffect, useReducer, useRef } from 'react';

const REQUEST_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

const useSafeDispatch = (dispatch) => {
  const mounted = useRef(false);

  useLayoutEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  return useCallback(
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch]
  );
};

const asyncReducer = (state, action) => {
  switch (action.type) {
    case REQUEST_STATUS.PENDING: {
      return { status: REQUEST_STATUS.PENDING, data: null, error: null };
    }
    case REQUEST_STATUS.RESOLVED: {
      return {
        status: REQUEST_STATUS.RESOLVED,
        data: action.data,
        error: null,
      };
    }
    case REQUEST_STATUS.REJECTED: {
      return {
        status: REQUEST_STATUS.REJECTED,
        data: null,
        error: action.error,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
};

const useAsync = (initialState) => {
  const [state, unsafeDispatch] = useReducer(asyncReducer, {
    status: REQUEST_STATUS.IDLE,
    data: null,
    error: null,
    ...initialState,
  });

  const dispatch = useSafeDispatch(unsafeDispatch);

  const { data, error, status } = state;

  const run = useCallback(
    (promise) => {
      dispatch({ type: REQUEST_STATUS.PENDING });
      promise.then(
        (data) => {
          dispatch({ type: REQUEST_STATUS.RESOLVED, data });
        },
        (error) => {
          dispatch({ type: REQUEST_STATUS.REJECTED, error });
        }
      );
    },
    [dispatch]
  );
};

const setData = useCallback(
  (data) => dispatch({ type: REQUEST_STATUS.RESOLVED, data }),
  [dispatch]
);

const setError = useCallback(
  (error) => dispatch({ type: REQUEST_STATUS.REJECTED, error }),
  [dispatch]
);

return {
  run,
  data,
  error,
  status,
  setData,
  setError,
};

export { useAsync, REQUEST_STATUS };
