/*
 *  Javascript status notifications - v0.0.1
 *  Javascript status notifications
 *  
 *
 *  Made by Corey Sewell - Guru Digital Media
 *    Email corey@gdmedia.tv
 *  Under BSD-3-Clause License
 */
(function (window) {

    var SS_StatusMessageTypes = {
        SUCCESS: "success",
        DANGER: "danger",
        INFO: "info",
        LOADING: "loading",
        WARNING: "warning",
        forForm: function (type) {
            var result = "bad";
            if (type === SS_StatusMessageTypes.SUCCESS || type === SS_StatusMessageTypes.INFO || type === SS_StatusMessageTypes.LOADING) {
                result = "good";
            } else if (type === SS_StatusMessageTypes.DANGER) {
                result = "bad";
            } else if (type === SS_StatusMessageTypes.WARNING) {
                result = "warning";
            } else {
                result = type ? "good" : "bad";
            }
            return result;
        },
        fromForm: function (type) {
            var result = SS_StatusMessageTypes.DANGER;
            if (type === "good") {
                result = SS_StatusMessageTypes.SUCCESS;
            } else if (type === "bad") {
                result = SS_StatusMessageTypes.DANGER;
            } else if (type === "warning") {
                result = SS_StatusMessageTypes.WARNING;
            } else {
                result = type ? SS_StatusMessageTypes.SUCCESS : SS_StatusMessageTypes.DANGER;
            }
            return result;
        }
    },
    SS_StatusMessage = (function () {
        var self = this;
        self.conf = {
            adapter: "",
            adapters: {}
        };
        function create(content, type, title, options) {
            var adapter;
            if (typeof self.conf.adapters[self.conf.adapter] === "function") {
                adapter = self.conf.adapters[self.conf.adapter];
            } else {
                adapter = self.conf.adapters["default"];
            }
            return adapter(content, type, title, options);
        }
        function info(content, title, options) {
            return create(content, SS_StatusMessageTypes.INFO, title, options);
        }
        function warning(content, title, options) {
            return create(content, SS_StatusMessageTypes.WARNING, title, options);
        }
        function success(content, title, options) {
            return create(content, SS_StatusMessageTypes.SUCCESS, title, options);
        }
        function danger(content, title, options) {
            return create(content, SS_StatusMessageTypes.DANGER, title, options);
        }
        function loading(content, title, options) {
            return create(content, SS_StatusMessageTypes.LOADING, title, options);
        }
        function addAdpater(name, callback) {
            self.conf.adapters[name] = callback;
        }
        function setDefaultAdapter(name) {
            self.conf.adapter = name;
        }

        return {
            create: create,
            info: info,
            warning: warning,
            success: success,
            danger: danger,
            loading: loading,
            addAdpater: addAdpater,
            setDefaultAdapter: setDefaultAdapter,
            conf: self.conf
        };
    }()),
            ssStatusMessageLoadingQueue = [], ssStatusMessageIsLoading = false;
    function SS_StatusMessageToastrAdapter(content, type, title, options) {
        function showToast(content, type, title, options) {
            options = options ? options : {};
            if (options.sticky) {
                options.extendedTimeOut = 0;
                options.timeOut = 0;
            }
            if (type === SS_StatusMessageTypes.SUCCESS) {
                return toastr.success(content, title, options);
            } else if (type === SS_StatusMessageTypes.INFO) {
                return toastr.info(content, title, options);
            } else if (type === SS_StatusMessageTypes.LOADING) {
                options.iconClass = (options.iconClass ? options.iconClass + " " : "") + "toast-info toast-icon-loading";
                return toastr.info(content, title, options);
            } else if (type === SS_StatusMessageTypes.DANGER) {
                return toastr.error(content, title, options);
            } else if (type === SS_StatusMessageTypes.WARNING) {
                return toastr.warning(content, title, options);
            }
        }
        function queueToast(content, type, title, options) {
            var queueItem = {
                content: content, type: type, title: title, options: options, proxy: (
                        function (index) {
                            return {
                                hide: function () {
                                    var callIt = function () {
                                        var funcName = "hide";
                                        if (ssStatusMessageLoadingQueue[index] && ssStatusMessageLoadingQueue[index].toast && typeof ssStatusMessageLoadingQueue[index].toast[funcName] === "function") {
                                            ssStatusMessageLoadingQueue[index].toast[funcName].call(ssStatusMessageLoadingQueue[index].toast, arguments);
                                        } else {
                                            setTimeout(callIt, 20);
                                        }
                                    };
                                    callIt(arguments);
                                }
                            };
                        }(ssStatusMessageLoadingQueue.length)
                        )
            };
            ssStatusMessageLoadingQueue.push(queueItem);
            return ssStatusMessageLoadingQueue[ssStatusMessageLoadingQueue.length - 1].proxy;
        }
        function loadAndShowToast(content, type, title, options) {
            ssStatusMessageIsLoading = true;
            var script = document.createElement("script"), baseTag = document.getElementsByTagName("base")[0], res = queueToast(content, type, title, options);
            script.src = baseTag.href + "silverstripe-status-message/javascript/thirdparty/toastr/toastr.min.js";
            script.onreadystatechange = script.onload = function () {
                var state = script.readyState;
                if (ssStatusMessageIsLoading && (!state || /loaded|complete/.test(state))) {
                    showQueueToasts();
                    ssStatusMessageIsLoading = false;
                }
            };
            document.getElementsByTagName("head")[0].appendChild(script);
            return res;
        }
        function showQueueToasts() {
            for (i = 0; i < ssStatusMessageLoadingQueue.length; i++) {
                var mesg = ssStatusMessageLoadingQueue[i];
                ssStatusMessageLoadingQueue[i].toast = SS_StatusMessageToastrAdapter(mesg.content, mesg.type, mesg.title, mesg.options);
            }
        }

        if (typeof toastr === "undefined") {
            if (ssStatusMessageIsLoading) {
                return queueToast(content, type, title, options);
            } else {
                return loadAndShowToast(content, type, title, options);
            }
        } else {
            return showToast(content, type, title, options);
        }
    }

    SS_StatusMessage.addAdpater("default", SS_StatusMessageToastrAdapter);
    SS_StatusMessage.setDefaultAdapter("default");
    window.SS_StatusMessageTypes = SS_StatusMessageTypes;
    window.SS_StatusMessage = SS_StatusMessage;
}(window));
//var t1 = SS_StatusMessage.info("Info, with progress bar", "Info", {extendedTimeOut: 60000, timeOut: 60000, progressBar: 1}), t2 = SS_StatusMessage.info("Info, with progress bar", "Info", {extendedTimeOut: 60000, timeOut: 60000, progressBar: 1}), t3 = SS_StatusMessage.info("Info, with progress bar", "Info", {extendedTimeOut: 60000, timeOut: 60000, progressBar: 1});
//t1.hide();
//t2.hide();
//t3.hide();
//
//
//function demoStatusMessages() {
//    SS_StatusMessage.info("Info, with progress bar", "Info", {extendedTimeOut: 60000, timeOut: 60000, progressBar: 1});
//    SS_StatusMessage.warning("Sticky warning message", "Warning", {extendedTimeOut: 0, timeOut: 0});
//    SS_StatusMessage.success("Success with default timeout", "Success");
//    SS_StatusMessage.danger("Error with 30 second time out and close button", "Error", {extendedTimeOut: 30000, timeOut: 30000, closeButton: 1});
//    SS_StatusMessage.info("Sticky loading animation", "Loading", {extendedTimeOut: 0, timeOut: 0, iconClass: "toast-info toast-icon-loading"});
//}
//
//function demoAdapterMessages() {
//    SS_StatusMessage.addAdpater("console", function (content, type, title, options) {
//        console.log(content, type, title, options);
//    });
//    SS_StatusMessage.setDefaultAdapter("console");
//    SS_StatusMessage.conf.adapter = "console";
//    SS_StatusMessage.info("Info, with progress bar", "Info", {extendedTimeOut: 60000, timeOut: 60000, progressBar: 1});
//    SS_StatusMessage.warning("Sticky warning message", "Warning", {extendedTimeOut: 0, timeOut: 0});
//    SS_StatusMessage.success("Success with default timeout", "Success");
//    SS_StatusMessage.danger("Error with 30 second time out and close button", "Error", {extendedTimeOut: 30000, timeOut: 30000, closeButton: 1});
//    SS_StatusMessage.info("Sticky loading animation", "Loading", {extendedTimeOut: 0, timeOut: 0, iconClass: "toast-info toast-icon-loading"});
//    SS_StatusMessage.setDefaultAdapter("default");
//
//}
//
//demoAdapterMessages();
//demoStatusMessages();
//
//SS_StatusMessage.addAdpater("alert", function (content, type, title, options) {
//    alert(title + content);
//});
//SS_StatusMessage.setDefaultAdapter("alert");
//SS_StatusMessage.info("Info, with progress bar", "Info", {extendedTimeOut: 60000, timeOut: 60000, progressBar: 1});