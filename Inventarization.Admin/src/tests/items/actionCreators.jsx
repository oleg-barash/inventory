import configureMockStore from 'redux-mock-store'
import { fetchItems } from '../../app/itemActions'
import thunk from 'redux-thunk'
import nock from 'nock'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)
const store = mockStore({ auth: { "IsAuthorized": true, "InProcess": false, "Token": "Basic bWFuYWdlcl90ZXN0OnRlc3Q=", "Error": null, "FullName": "test_manager_name test_manager_family", "Inventorizations": [{ "Id": "81d51f07-9ff3-46c0-961c-c8ebfb7b47e3", "Company": "9e0e8591-293d-4603-898d-59334e4c53dc", "CreatedAt": "2017-03-21T16:46:36.980666+03:00", "ClosedAt": "9999-12-31T23:59:59.9999999", "Date": "2017-03-21T00:00:00" }], "Username": "manager_test", "Password": "test", "DefaultInventorization": { "Id": "81d51f07-9ff3-46c0-961c-c8ebfb7b47e3", "Company": "9e0e8591-293d-4603-898d-59334e4c53dc", "CreatedAt": "2017-03-21T16:46:36.980666+03:00", "ClosedAt": "9999-12-31T23:59:59.9999999", "Date": "2017-03-21T00:00:00" }, "isInventorizationDialogOpened": true, "SelectedInventorization": { "Id": "81d51f07-9ff3-46c0-961c-c8ebfb7b47e3", "Company": "9e0e8591-293d-4603-898d-59334e4c53dc", "CreatedAt": "2017-03-21T16:46:36.980666+03:00", "ClosedAt": "9999-12-31T23:59:59.9999999", "Date": "2017-03-21T00:00:00" } } })
describe('items integration tests', () => {
    beforeAll(() => {

    })

    it('server returns items', () => {
        return store.dispatch(fetchItems(store.auth.SelectedInventorization.Id, {}, store.auth.Token)).then(() => {
            expect(store.items.receivedAt).not.toEqual(undefined)
        })
    })
})