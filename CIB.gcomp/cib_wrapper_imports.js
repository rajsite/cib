(function () {
    'use strict';

    const results = {};

    wasmImports.saveResult = function (namePtr, start, size) {
        const name = emModule.Pointer_stringify(namePtr);
        const result = new Float64Array(emModule.buffer, start, size);
        results[name] = result;
    };

    commands.getSavedResult = function ({name}) {
        const result = results[name];
        sendMessage({function: 'workerGetSavedResultDone', result});
    };

    const inputs = {};

    wasmImports.loadInput = function (namePtr, start, size) {
        const name = emModule.Pointer_stringify(namePtr);
        const target = new Float64Array(emModule.buffer, start, size);
        const input = inputs[name];
        target.set(input);
    };

    commands.setInputValue = function ({name, value}) {
        inputs[name] = value;
        sendMessage({function: 'workerSetInputValueDone'});
    };
}());
