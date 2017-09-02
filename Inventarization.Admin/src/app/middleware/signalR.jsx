export function signalRStart(store, callback) {
    _hub = $.connection.myHubName;

    _hub.client.firstClientFunction = (p1) => {
        store.dispatch({ type: "SERVER_CALLED_ME", a: p1 });
    }
    $.connection.hub.start(() => callback());
}