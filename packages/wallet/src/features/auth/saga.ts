import { call } from 'typed-redux-saga'
import { createMonitoredSaga } from 'wallet/src/utils/saga'
import { logger } from '../logger/logger'
import { Keyring } from '../wallet/Keyring/Keyring'
import { AuthParams } from './types'

function* auth({ password }: AuthParams) {
  logger.debug('authSaga', 'auth', `Logging in with password`)

  return yield* call(Keyring.unlock, password)
}

export const {
  name: authSagaName,
  wrappedSaga: authSaga,
  reducer: authReducer,
  actions: authActions,
} = createMonitoredSaga<AuthParams>(auth, 'auth')