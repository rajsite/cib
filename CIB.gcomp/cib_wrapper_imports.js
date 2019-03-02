(function () {
    'use strict';

    const registrations = {};

    wasmImports.saveResult = function (namePtr, start, size) {
        const name = emModule.Pointer_stringify(namePtr);
        const result = new Float64Array(emModule.buffer, start, size);
        registrations[name] = result;
    };

    commands.getSavedResult = function ({name}) {
        const result = registrations[name];
        sendMessage({ function: 'workerGetSavedResultDone', result });
    };
}());
