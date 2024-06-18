class NotificationService {
    constructor() {
        this._listeners = [];

        this.Types = {
            'SUCCESS': 'success',
            'ERROR': 'error',
            'INFO': 'info',
        };
    }

    static Types = {
        'SUCCESS': 'success',
        'ERROR': 'error',
        'INFO': 'info',
    };

    trigger(notif) {
        this._listeners.forEach((listener) => {
            listener(notif);
        });
    }

    listen(listener) {
        this._listeners.push(listener);

        return (() => {
            this._listeners.splice(this._listeners.indexOf(listener), 1);
        });
    }
};

export default NotificationService;